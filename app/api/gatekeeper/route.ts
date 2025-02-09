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
    const formattedPrompt = `Return only “yes” or “no”. No other text.

Is the following tweet a valid product marketing tweet? A valid tweet must:
	•	Clearly promote or describe a product.
	•	Be relevant to product marketing.
	•	Not be off-topic, spammy, or unrelated.

Here is the tweet:

${bodyText}`;

    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: "user", content: formattedPrompt }],
      model: "llama-3.3-70b-versatile",
    });
    const response = chatCompletion.choices[0]?.message?.content!.toLowerCase();
    if (response.includes("yes") ) {
      return NextResponse.json({ tweet: bodyText });
    }
    if (response.includes("no")) {
        return NextResponse.json({ tweet: "Please cross check your product details" });
    }

    console.log("Generated Tweet:", chatCompletion.choices[0]?.message?.content || "");

    return NextResponse.json({ tweet: chatCompletion.choices[0]?.message?.content });
  } catch (error) {
    console.error("Error generating tweet:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}