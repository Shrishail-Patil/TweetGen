import Groq from "groq-sdk";
import { NextRequest, NextResponse } from "next/server";

const groq = new Groq({ apiKey: process.env.NEXT_PUBLIC_GROQ_API_KEY });

export async function POST(req: NextRequest) {
  try {
    // Parse the request body
    const { tweet, constraints } = await req.json();

    if (!tweet?.trim()) {
      return NextResponse.json({ error: "Tweet is required" }, { status: 400 });
    }

    // Extract constraints
    const { structure, hashtags, length } = constraints;

    // Prompt to evaluate tweet quality
    const evaluationPrompt = `You are an expert tweet critic with deep knowledge of human psychology, social media engagement strategies, and the latest trends in crafting viral tweets. Your job is to analyze tweets and assess their appeal, authenticity, and engagement potential.

Here is the tweet:

${tweet}

Rate the tweet on a scale from 1 to 10 based on how engaging, human-like, and likely to go viral it is.
  - If the score is **7 or above**, return only the number—nothing else.
  - If the score is **below 7**, provide **specific, actionable feedback** on how to improve it while maintaining its original intent.`;

    // Call Groq API to evaluate the tweet
    const evaluationResponse = await groq.chat.completions.create({
      messages: [{ role: "user", content: evaluationPrompt }],
      model: "llama-3.3-70b-versatile",
    });

    const evaluationResult = evaluationResponse.choices[0]?.message?.content?.trim() || "";

    // If the response is a number 7 or higher, return the original tweet
    if (/^[7-9]|10$/.test(evaluationResult)) {
      return NextResponse.json({ tweet });
    }

    // Otherwise, extract feedback and generate a revised tweet
    console.log("Tweet feedback:", evaluationResult);

    // Prompt to generate an improved tweet
    const improvementPrompt = `The following tweet was evaluated and received a score below 7. Here is the feedback on how to improve it:

    Original Tweet:
    "${tweet}"

    Feedback:
    ${evaluationResult}

    Using this feedback, rewrite the tweet to be **more engaging, human-like, and likely to go viral**. Maintain the original intent but make it **stronger** and **more compelling**.

    Constraints:
    - Structure: ${structure}
    - Hashtags: ${hashtags ? "Include 1-2 relevant hashtags." : "Do not include hashtags."}
    - Length: Keep it under ${length} characters.

    Return only the new tweet. No explanations, no analysis, just the tweet.`;

    // Call Groq API to generate an improved tweet
    const improvementResponse = await groq.chat.completions.create({
      messages: [{ role: "user", content: improvementPrompt }],
      model: "llama-3.3-70b-versatile",
    });

    let improvedTweet = improvementResponse.choices[0]?.message?.content?.trim() || "";

    // Remove hashtags if the user disabled them
    if (!hashtags) {
      improvedTweet = improvedTweet.replace(/#\w+/g, "").trim();
    }

    if (!improvedTweet) {
      return NextResponse.json({ error: "Failed to generate improved tweet" }, { status: 500 });
    }

    console.log("Improved Tweet:", improvedTweet);

    // Return only the improved tweet
    return NextResponse.json({ tweet: improvedTweet });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}