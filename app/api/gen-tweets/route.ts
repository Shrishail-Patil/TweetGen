import Groq from "groq-sdk";
import { NextRequest, NextResponse } from "next/server";

const groq = new Groq({ apiKey: process.env.NEXT_PUBLIC_GROQ_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const { productDetails, tweetType, structurePreference, casePreference } = await req.json();

    // Validate inputs
    if (!productDetails?.trim()) {
      return NextResponse.json({ error: "Product details are required" }, { status: 400 });
    }
    if (!tweetType) {
      return NextResponse.json({ error: "Tweet type is required" }, { status: 400 });
    }

    // Define tweet type prompts
    const tweetTypePrompts: Record<string, string> = {
      CTA: "Focus on a strong call-to-action, encouraging engagement or sign-ups.",
      Casual: "Write in a fun, relaxed, and friendly tone.",
      Educational: "Share an insightful or informative tweet about the product.",
      Funny: "Make it witty and humorous while still being relevant.",
      Inspirational: "Write something motivating and uplifting about the product.",
    };


    // Select the prompt based on tweetType
    const tweetStylePrompt = tweetTypePrompts[tweetType] || tweetTypePrompts["CTA"];

    // Define structure preference
    const structurePrompt = structurePreference === "short" ? "Keep the tweet to 1-3 lines, simple and easy to read." : "";

    // Define case preference
    const casePrompt = casePreference === "lowercase" ? "Write the entire tweet in lowercase." : "";

    // Generate tweet using Groq API
    const formattedPrompt = `You are a world-class SaaS product marketer skilled at crafting viral tweets. Write a tweet about the following product in a way that is:
    • Simple (easy to understand)
    • Human-like (casual, friendly, and relatable)
    • Attention-grabbing (stopping the scroll instantly)
    • Memorable (leaves a lasting impression and sparks curiosity)
    • Short and informative (shouldn't require additional context and easy to read)
    
    Style: ${tweetStylePrompt}
    Structure: ${structurePrompt}
    Case: ${casePrompt}

    Here’s the product:

    ${productDetails}

    Return only the tweet. No explanations, no analysis, no additional text—just the tweet.`;
    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: "user", content: formattedPrompt }],
      model: "llama-3.3-70b-versatile",
    });

    const generatedTweet = chatCompletion.choices[0]?.message?.content?.trim() || "";

    if (!generatedTweet) {
      return NextResponse.json({ error: "Failed to generate tweet" }, { status: 500 });
    }

    // Call QC API
    const qcResponse = await fetch(`${process.env.NEXT_PUBLIC_VERCEL_URL}/api/qc`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        tweet: generatedTweet,
        constraints: { structure: structurePreference, hashtags: true, length: 280 }, // Adjust as needed
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