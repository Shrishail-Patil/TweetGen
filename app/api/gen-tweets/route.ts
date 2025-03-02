import Groq from "groq-sdk";
import { NextRequest, NextResponse } from "next/server";
import { createClient } from '@supabase/supabase-js';

// Initialize Groq client
const groq = new Groq({ apiKey: process.env.NEXT_PUBLIC_GROQ_API_KEY });

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

// Define tweet type prompts
const TWEET_TYPE_PROMPTS: Record<string, string> = {
  CTA: "Focus on a strong call-to-action, encouraging engagement or sign-ups. Use urgency and curiosity to drive clicks.",
  Casual: "Write in a fun, relaxed, and friendly tone. Make it feel like a conversation with a friend.",
  Educational: "Share an insightful or informative tweet about the product. Use data, facts, or tips to add value.",
  Funny: "Make it witty and humorous while still being relevant. Use clever wordplay or relatable humor.",
  Inspirational: "Write something motivating and uplifting about the product. Use powerful language to inspire action.",
  Viral: "Craft a tweet designed to go viral. Use emotional triggers, bold statements, or trending formats.",
  Controversial: "Challenge opinions and spark discussion. Be bold but respectful. Address current hot topics.",
  Storytelling: "Engage readers by narrating a relatable or impactful story. Use a beginning, middle, and end.",
};

// Define structure preferences
const STRUCTURE_PROMPTS: Record<string, string> = {
  short: "Keep the tweet to 1-3 lines, simple and easy to read.",
  long: "Write a detailed tweet with multiple lines, providing more context.",
};

// Define case preferences
const CASE_PROMPTS: Record<string, string> = {
  lowercase: "Write the entire tweet in lowercase.",
  uppercase: "WRITE THE ENTIRE TWEET IN UPPERCASE.",
  sentence: "Write the tweet in sentence case.",
  title: "Write the tweet in title case.",
  alternating: "Write the tweet in alternating case (e.g., AlTeRnAtInG cAsE).",
};

export async function POST(req: NextRequest) {
  try {
    // Parse and validate the request body
    const { productDetails, tweetType, structurePreference, casePreference, url, hashtags } = await req.json();

    // Log the received data for debugging
    // console.log("Received data:", {
    //   productDetails,
    //   tweetType,
    //   structurePreference,
    //   casePreference,
    //   url,
    //   hashtags,
    // });

    // Validate required fields
    if (!productDetails?.trim()) {
      return NextResponse.json({ error: "Product details are required" }, { status: 400 });
    }
    if (!tweetType) {
      return NextResponse.json({ error: "Tweet type is required" }, { status: 400 });
    }

    // Insert data into Supabase with retry mechanism
    let retryCount = 0;
    const maxRetries = 3;
    let supabaseError = null;

    while (retryCount < maxRetries) {
      const { error } = await supabase
        .from('UserData')
        .insert([
          { 
            productdetails:productDetails, 
            tweettype:tweetType, 
            structurepreference:structurePreference, 
            casepreference:casePreference, 
            url: url || null, // Convert empty string to NULL
            hashtags: Boolean(hashtags) // Convert to boolean
          },
        ])
        .select(); // Use .select() to return the inserted data

      if (error) {
        supabaseError = error;
        // console.error(`Supabase Insert Error (Attempt ${retryCount + 1}):`, {
        //   message: error.message,
        //   code: error.code,
        //   details: error.details,
        //   hint: error.hint,
        // });
        retryCount++;
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait 1 second before retrying
      } else {
        // console.log("Data inserted into Supabase:", data);
        supabaseError = null;
        break; // Exit the loop if successful
      }
    }

    if (supabaseError) {
      return NextResponse.json({ error: "Failed to insert data into Supabase after multiple attempts" }, { status: 500 });
    }

    // Select the prompt based on tweetType
    const tweetStylePrompt = TWEET_TYPE_PROMPTS[tweetType] || TWEET_TYPE_PROMPTS["CTA"];

    // Define structure and case preferences
    const structurePrompt = STRUCTURE_PROMPTS[structurePreference] || "";
    const casePrompt = CASE_PROMPTS[casePreference] || "";

    // Include URL in the prompt if provided
    const urlPrompt = url ? `Include this URL in the tweet: ${url}` : "Do not include any URL in the tweet.";

    // Include hashtags in the prompt if enabled
    const hashtagsPrompt = hashtags ? "Include 1-2 relevant hashtags at the end of the tweet." : "Do not include any hashtags.";

    // Generate tweet using Groq API
    const formattedPrompt = `
You are a world-class SaaS product marketer skilled at crafting viral tweets. Write a tweet about the following product in a way that is:
• **Simple**: Easy to understand.
• **Human-like**: Casual, friendly, and relatable.
• **Attention-grabbing**: Stops the scroll instantly.
• **Memorable**: Leaves a lasting impression and sparks curiosity.
• **Short and informative**: Shouldn't require additional context and is easy to read.

**Style**: ${tweetStylePrompt}
**Structure**: ${structurePrompt}
**Case**: ${casePrompt}
**URL**: ${urlPrompt}
**Hashtags**: ${hashtagsPrompt}

**Product Details**:
${productDetails}

**Instructions**:
- Return only the tweet.
- No explanations, no analysis, no additional text—just the tweet.
- Ensure the tweet is highly engaging and optimized for virality.
- Use trending formats, emotional triggers, or bold statements to grab attention.
- If a URL is provided, include it naturally in the tweet.
- If hashtags are enabled, include 1-2 relevant hashtags at the end.
`;

    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: "user", content: formattedPrompt }],
      model: "llama-3.3-70b-versatile",
      temperature: 0.9, // Increase creativity
      max_tokens: 280, // Limit to tweet length
    });

    const generatedTweet = chatCompletion.choices[0]?.message?.content?.trim() || "";

    if (!generatedTweet) {
      return NextResponse.json({ error: "Failed to generate tweet" }, { status: 500 });
    }

    // Call QC API for quality check
    const qcResponse = await fetch(`${process.env.NEXT_PUBLIC_VERCEL_URL}/api/qc`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        tweet: generatedTweet,
        constraints: {
          structure: structurePreference,
          hashtags,
          length: 280,
        },
      }),
    });

    if (!qcResponse.ok) {
      return NextResponse.json({ error: "QC API failed" }, { status: 500 });
    }

    const qcResult = await qcResponse.json();
    console.log("QC Result:", qcResult);

    // Extract the improved tweet from the QC result
    const improvedTweet = qcResult.tweet;

    // Return the improved tweet
    return NextResponse.json({ tweet: improvedTweet });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}