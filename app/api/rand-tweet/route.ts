import Groq from "groq-sdk";
import { NextRequest, NextResponse } from "next/server";

const groq = new Groq({ apiKey: process.env.NEXT_PUBLIC_GROQ_API_KEY });

export async function POST(req: NextRequest) {
  try {
    // Parse the JSON body
    const { mood, style, length, tweetType, structure, hashtags }: {
      mood: string;
      style: string;
      length: number;
      tweetType: string;
      structure: keyof typeof structureOptions;
      hashtags: boolean;
    } = await req.json();

    // Validate required fields
    if (!tweetType?.trim()) {
      return NextResponse.json({ error: "Tweet type is required" }, { status: 400 });
    }
    if (!mood || !style || !length) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Define moods with more depth and variety
    const moods: Record<string, string> = {
      happy: "Express joy and positivity. Use uplifting and optimistic language. Incorporate recent positive news or trends.",
      funny: "Use humor and wit. Include punchlines, puns, or clever wordplay. Reference current memes or viral jokes.",
      sarcastic: "Use a playful, ironic tone. Be witty and clever, but avoid being mean-spirited. Reference relatable everyday struggles or absurdities.",
      motivational: "Inspire and uplift. Use powerful, action-oriented language. Reference recent success stories or motivational trends.",
      controversial: "Challenge opinions and spark discussion. Be bold but respectful. Address current hot topics or debates.",
      philosophical: "Encourage deep thinking and reflection. Use thought-provoking questions or statements. Relate to recent philosophical discussions.",
      nostalgic: "Evoke feelings of nostalgia. Reference past trends, events, or cultural moments that are making a comeback.",
      mysterious: "Create intrigue and curiosity. Use cryptic language and hint at something larger. Reference recent mysteries or unsolved events.",
      romantic: "Express love and affection. Use poetic language and reference recent romantic trends or events.",
      adventurous: "Encourage exploration and excitement. Use bold language and reference recent adventures or travel trends.",
    };

    // Define styles with more specificity and relevance
    const styles: Record<string, string> = {
      viral: "Craft content with the potential to spread quickly and widely. Use hooks, emotional triggers, and trending formats. Reference current viral challenges or trends.",
      trendy: "Tap into current trends, memes, and popular culture. Make it relevant and timely. Use the latest slang or popular phrases.",
      casual: "Use a relaxed, friendly, and approachable tone. Write like you're talking to a friend. Incorporate everyday language and recent casual trends.",
      professional: "Maintain a formal, authoritative style. Use data, facts, and clear insights. Reference recent studies, reports, or professional trends.",
      storytelling: "Engage readers by narrating relatable or impactful stories. Use a beginning, middle, and end. Reference recent events or personal stories.",
      poetic: "Use rhythmic and expressive language. Create a lyrical flow. Reference recent poetic trends or popular poems.",
      informative: "Provide valuable information and insights. Use clear and concise language. Reference recent news or informative trends.",
      inspirational: "Motivate and uplift with powerful messages. Use encouraging language. Reference recent inspirational stories or quotes.",
      satirical: "Use humor, irony, or exaggeration to critique or mock. Reference current events or societal issues with a satirical twist.",
      dramatic: "Create a sense of drama and intensity. Use bold and impactful language. Reference recent dramatic events or trends.",
    };

    // Define topics with more current and diverse options
    const topics: Record<string, string> = {
      Tech: "Discuss innovations, gadgets, and software trends. Highlight how it impacts daily life or the future. Reference recent tech breakthroughs or trends.",
      Life: "Share personal experiences, routines, and reflections. Make it relatable and authentic. Reference recent lifestyle trends or personal growth topics.",
      Success: "Explore achievements, goals, and strategies for growth. Inspire action and ambition. Reference recent success stories or motivational trends.",
      Relationships: "Talk about connections, friendships, and love. Use emotional triggers to resonate with readers. Reference recent relationship trends or advice.",
      Money: "Cover finances, investments, and wealth-building tips. Provide actionable advice or insights. Reference recent financial news or trends.",
      Creativity: "Highlight artistic expression and creative thinking. Encourage readers to think outside the box. Reference recent creative trends or projects.",
      Growth: "Focus on personal development and self-improvement. Share practical tips or mindset shifts. Reference recent growth trends or self-help topics.",
      Wisdom: "Share timeless advice and thought-provoking insights. Make it concise and impactful. Reference recent wisdom trends or popular quotes.",
      Humor: "Deliver lighthearted jokes, memes, and funny observations. Keep it fresh and original. Reference recent humor trends or viral jokes.",
      Culture: "Examine societal trends, traditions, and pop culture. Make it relevant and engaging. Reference recent cultural events or trends.",
      Health: "Discuss physical and mental well-being. Provide tips and insights. Reference recent health trends or wellness topics.",
      Environment: "Talk about sustainability and environmental issues. Provide actionable advice. Reference recent environmental news or trends.",
      Education: "Explore learning and knowledge-sharing. Provide insights and tips. Reference recent educational trends or innovations.",
      Travel: "Share travel experiences and tips. Inspire exploration. Reference recent travel trends or destinations.",
      Food: "Discuss culinary experiences and trends. Provide recipes or tips. Reference recent food trends or popular dishes.",
    };

    // Validate and default values
    const selectedMood = moods[mood] || moods.happy;
    const selectedStyle = styles[style] || styles.casual;
    const selectedTopic = topics[tweetType] || topics.Humor;

    // Define structure options with more variety
    const structureOptions = {
      lowercase: "all lowercase",
      uppercase: "ALL UPPERCASE",
      sentence: "Sentence case",
      title: "Title Case",
      alternating: "AlTeRnAtInG cAsE",
      random: "RaNDoM cASe",
    };

    const selectedStructure = structureOptions[structure] || structureOptions.sentence;

    // Format the AI model prompt with more creativity and constraints
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

**Avoid generic phrases or overused templates.** Be bold, concise, and impactful. Here are some examples of what NOT to do:
- "We're all just winging adulting, right?"
- "Adulting is hard, lol."
- "Why is life like this?"

Instead, try to come up with fresh, unique, and creative ideas. For example:
- "When you realize 'adulting' is just Googling how to do basic life tasks and hoping no one finds out."
- "The most accurate life hack: lower your expectations. You're welcome."
- "Life tip: if you ignore a problem long enough, it either goes away or becomes someone else's problem."

Now, generate a tweet based on the above guidelines. Return only the tweet. No explanations or additional text.
`;

    // Generate tweet using Groq API
    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: "user", content: formattedPrompt }],
      model: "llama-3.3-70b-versatile",
      temperature: 0.9, // Increase temperature for more creativity
      max_tokens: 100, // Limit length to ensure concise tweets
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