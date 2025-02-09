import Groq from "groq-sdk";
import { NextRequest, NextResponse } from "next/server";

const groq = new Groq({ apiKey: process.env.NEXT_PUBLIC_GROQ_API_KEY });

export async function POST(req: NextRequest) {
  try {
    // Read the request body as plain text
    const bodyText = await req.text();

    if (!bodyText.trim()) {
      return NextResponse.json({ error: "Empty request body" }, { status: 400 });
    }

    // Format the prompt for the AI model
    const formattedPrompt = `You are a world-class SaaS product marketer skilled at crafting viral tweets. Write a tweet about the following product in a way that is:
	•	Simple (easy to understand)
	•	Human-like (casual, friendly, and relatable)
	•	Attention-grabbing (stopping the scroll instantly)
	•	Memorable (leaves a lasting impression and sparks curiosity)

Here’s the product:

${bodyText}

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