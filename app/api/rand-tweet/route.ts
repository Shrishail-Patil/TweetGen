import Groq from "groq-sdk";
import { NextRequest, NextResponse } from "next/server";

const groq = new Groq({ apiKey: process.env.NEXT_PUBLIC_GROQ_API_KEY });

export async function POST(req: NextRequest) {
  try {
    // Parse the JSON body
    const { mood, style, length, tweetType, structure, hashtags } : { mood: string, style: string, length: number, tweetType: string, structure: keyof typeof structureOptions, hashtags: boolean } = await req.json();

    // Validate required fields
    if (!tweetType?.trim()) {
      return NextResponse.json({ error: "Tweet type is required" }, { status: 400 });
    }
    if (!mood || !style || !length) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    // Define moods
    const moods: Record<string, string> = {
      happy: "Express joy and positivity in your message. Use uplifting and optimistic language.",
      funny: "Use humor and wit to engage the audience. Include punchlines, puns, or clever wordplay.",
      sarcastic: "Convey a playful, ironic tone. Use subtle sarcasm to make it relatable and entertaining.",
      motivational: "Inspire and uplift the reader. Use powerful, action-oriented language.",
      controversial: "Challenge opinions and spark discussion. Be bold but respectful.",
      philosophical: "Encourage deep thinking and reflection. Use thought-provoking questions or statements.",
    };

    // Define styles
    const styles: Record<string, string> = {
      viral: "Craft content with the potential to spread quickly and widely. Use hooks, emotional triggers, and trending formats.",
      trendy: "Tap into current trends, memes, and popular culture. Make it relevant and timely.",
      casual: "Use a relaxed, friendly, and approachable tone. Write like you're talking to a friend.",
      professional: "Maintain a formal, authoritative style. Use data, facts, and clear insights.",
      storytelling: "Engage readers by narrating relatable or impactful stories. Use a beginning, middle, and end.",
    };

    // Define topics
    const topics: Record<string, string> = {
      Tech: "Discuss innovations, gadgets, and software trends. Highlight how it impacts daily life or the future.",
      Life: "Share personal experiences, routines, and reflections. Make it relatable and authentic.",
      Success: "Explore achievements, goals, and strategies for growth. Inspire action and ambition.",
      Relationships: "Talk about connections, friendships, and love. Use emotional triggers to resonate with readers.",
      Money: "Cover finances, investments, and wealth-building tips. Provide actionable advice or insights.",
      Creativity: "Highlight artistic expression and creative thinking. Encourage readers to think outside the box.",
      Growth: "Focus on personal development and self-improvement. Share practical tips or mindset shifts.",
      Wisdom: "Share timeless advice and thought-provoking insights. Make it concise and impactful.",
      Humor: "Deliver lighthearted jokes, memes, and funny observations. Keep it fresh and original.",
      Culture: "Examine societal trends, traditions, and pop culture. Make it relevant and engaging.",
    };


    // Validate and default values
    const selectedMood = moods[mood] || moods.happy;
    const selectedStyle = styles[style] || styles.casual;
    const selectedTopic = topics[tweetType] || topics.Humor;

    // Define structure options
    const structureOptions = {
      lowercase: "all lowercase",
      uppercase: "ALL UPPERCASE",
      sentence: "Sentence case",
    };

    const selectedStructure = structureOptions[structure] || structureOptions.sentence;

    // Format the AI model prompt
    const formattedPrompt = `
You are a world-class content creator specializing in viral tweets. Your task is to generate a tweet that will captivate audiences and spread rapidly. Follow these guidelines:

1. **Mood**: ${selectedMood}
2. **Style**: ${selectedStyle}
3. **Topic**: ${selectedTopic}
4. **Length**: Keep it under ${length} characters.
5. **Structure**: The tweet should be in ${selectedStructure}.
6. **Engagement**: Use hooks, emotional triggers, or trending formats to grab attention instantly.
7. **Relatability**: Make it feel personal and authentic. Use "you" or "we" to connect with the reader.
8. **Memorability**: Include a surprising twist, bold statement, or unique perspective.
9. **Actionability**: Encourage readers to like, retweet, or share their thoughts.
10. **Format**: Ensure the tweet is 1-3 lines long, easy to read, and follows the typical structure of successful tweets.
11. **Hashtags**: ${hashtags ? "Include 1-2 relevant hashtags at the end of the tweet." : "Do not include any hashtags."}

Avoid generic phrases, clichés, or overused templates. Be bold, concise, and impactful.

Now, generate a tweet based on the above guidelines. Return only the tweet. No explanations or additional text.
`;

    // Generate tweet using Groq API
    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: "user", content: formattedPrompt }],
      model: "llama-3.3-70b-versatile",
    });

    let generatedTweet = chatCompletion?.choices?.[0]?.message?.content?.trim() || "";

    // Remove hashtags if the user disabled them
    if (!hashtags) {
      generatedTweet = generatedTweet.replace(/#\w+/g, "").trim();
    }

    if (!generatedTweet) {
      return NextResponse.json({ error: "Failed to generate a tweet." }, { status: 500 });
    }

    console.log("Generated Tweet:", generatedTweet);

    // Call the QC API to check tweet quality
    const qcResponse = await fetch(`${process.env.NEXT_PUBLIC_VERCEL_URL}/api/qc`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        tweet: generatedTweet,
        constraints: { structure, hashtags, length },
      }),
    });

    if (!qcResponse.ok) {
      return NextResponse.json({ error: "QC API request failed." }, { status: 500 });
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
