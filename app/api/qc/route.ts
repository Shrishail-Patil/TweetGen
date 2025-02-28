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
    const { structure, hashtags } = constraints;

    // Prompt to evaluate tweet quality
    const evaluationPrompt = `You are an expert tweet critic with deep knowledge of human psychology, social media engagement strategies, and the latest trends in crafting viral tweets. Your job is to analyze tweets and assess their appeal, authenticity, and engagement potential.

Here is the tweet:

${tweet}

Rate the tweet on a scale from 1 to 10 based on the following criteria:
1. **Engagement**: Does it grab attention instantly and encourage interaction (likes, retweets, replies)?
2. **Authenticity**: Does it feel human-like, relatable, and genuine?
3. **Memorability**: Does it leave a lasting impression or spark curiosity?
4. **Clarity**: Is it easy to understand and concise?
5. **Relevance**: Does it align with current trends or audience interests?

If the score is **7 or above**, return only the number—nothing else.
If the score is **below 7**, provide **specific, actionable feedback** on how to improve it while maintaining its original intent.`;

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

    Using this feedback, rewrite the tweet to be **more engaging, human-like, and likely to go viral**. Follow these guidelines:
    1. **Engagement**: Use hooks, emotional triggers, or trending formats to grab attention instantly.
    2. **Authenticity**: Make it feel personal and relatable. Use "you" or "we" to connect with the reader.
    3. **Memorability**: Include a surprising twist, bold statement, or unique perspective.
    4. **Clarity**: Keep it simple, concise, and easy to understand.
    5. **Relevance**: Align it with current trends or audience interests.
    6. **Length**: Ensure the tweet is between 100 and 280 characters.
    7. **Structure**: The tweet should be in ${structure}.
    8. **Hashtags**: ${hashtags ? "Include 1-2 relevant hashtags." : "Do not include hashtags."}

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

    // Ensure the tweet is between 100 and 280 characters
    if (improvedTweet.length < 100 || improvedTweet.length > 280) {
      improvedTweet = improvedTweet.slice(0, 280); // Truncate if necessary
      if (improvedTweet.length < 100) {
        // If still too short, generate a new tweet
        const retryPrompt = `Generate a tweet that is between 100 and 280 characters. It should be engaging, human-like, and likely to go viral. Follow these constraints:
        - Structure: ${structure}
        - Hashtags: ${hashtags ? "Include 1-2 relevant hashtags." : "Do not include hashtags."}
        Return only the tweet.`;
        const retryResponse = await groq.chat.completions.create({
          messages: [{ role: "user", content: retryPrompt }],
          model: "llama-3.3-70b-versatile",
        });
        improvedTweet = retryResponse.choices[0]?.message?.content?.trim() || "";
      }
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