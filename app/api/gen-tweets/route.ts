import Groq from "groq-sdk";
import { NextRequest, NextResponse } from "next/server";

const groq = new Groq({ apiKey: process.env.NEXT_PUBLIC_GROQ_API_KEY });

export async function POST(req: NextRequest) {
  try {
    // Parse the JSON body
    const { productDetails, tweetType } = await req.json();

    if (!productDetails?.trim()) {
      return NextResponse.json({ error: "Product details cannot be empty" }, { status: 400 });
    }

    if (!tweetType) {
      return NextResponse.json({ error: "Tweet type is required" }, { status: 400 });
    }

    // Define different styles for tweet generation
    const tweetTypePrompts: Record<string, string> = {
      CTA: "Focus on a strong call-to-action, encouraging engagement or sign-ups.",
      Casual: "Write in a fun, relaxed, and friendly tone.",
      Educational: "Share an insightful or informative tweet about the product.",
      Funny: "Make it witty and humorous while still being relevant.",
      Inspirational: "Write something motivating and uplifting about the product.",
    };

    // Default to CTA if the provided type is not recognized
    const tweetStylePrompt = tweetTypePrompts[tweetType] || tweetTypePrompts["CTA"];

    // Format the prompt for the AI model
    const formattedPrompt = `You are a world-class SaaS product marketer skilled at crafting viral tweets. Write a tweet about the following product in a way that is:
    • Simple (easy to understand)
    • Human-like (casual, friendly, and relatable)
    • Attention-grabbing (stopping the scroll instantly)
    • Memorable (leaves a lasting impression and sparks curiosity)
    • Short and informative (shouldn't require additional context and easy to read)
    
    Style: ${tweetStylePrompt}

    Here’s the product:

    ${productDetails}

    Return only the tweet. No explanations, no analysis, no additional text—just the tweet.`;

    // Generate tweet using Groq API
    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: "user", content: formattedPrompt }],
      model: "llama-3.3-70b-versatile",
    });

    const generatedTweet = chatCompletion.choices[0]?.message?.content?.trim() || "";

    if (!generatedTweet) {
      return NextResponse.json({ error: "Failed to generate tweet" }, { status: 500 });
    }

    console.log("Generated Tweet:", generatedTweet);

    // Call the QC API to check tweet quality
    const qcResponse = await fetch(`${process.env.NEXT_PUBLIC_VERCEL_URL}/api/qc`, {
      method: "POST",
      headers: { "Content-Type": "text/plain" },
      body: generatedTweet,
    });

    if (!qcResponse.ok) {
      return NextResponse.json({ error: "QC API failed" }, { status: 500 });
    }

    // Parse the QC API response
    const qcResult = await qcResponse.json();

    return NextResponse.json({ tweet: generatedTweet, qc: qcResult });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}