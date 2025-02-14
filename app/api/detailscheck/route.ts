import Groq from "groq-sdk";
import { NextRequest, NextResponse } from "next/server";

const groq = new Groq({ apiKey: process.env.NEXT_PUBLIC_GROQ_API_KEY });

export async function POST(req: NextRequest) {
  try {
    // Read the request body as JSON
    // const { productDetails } = await req.json();
    //
    const productDetails = await req.body

    // if (!productDetails?.trim()) {
    //   return NextResponse.json({ error: "Empty product details" }, { status: 400 });
    // }

    // Prompt to evaluate product details
    const productEvaluationPrompt = `Analyze the following SaaS product details provided by a user. Determine if the description is coherent, meaningful, and describes a legitimate product, or if it is gibberish, nonsensical, or lacks clarity.

SaaS Product Details:
"${productDetails}"

Evaluation Criteria:
• Does it describe a real or plausible SaaS product?
• Is it clear, structured, and understandable?
• Does it avoid random, nonsensical, or unrelated words?
• Would a potential customer understand what this product does?

If the description is **valid**, respond with: "Valid: This SaaS product description makes sense."
If the description is **gibberish**, respond with: "Invalid: This SaaS product description appears to be nonsensical or unclear."

Return only "Valid" or "Invalid" as the response. No explanations, no analysis—just one of those two words.`;

    // Call Groq API to evaluate the product details
    const productEvaluationResponse = await groq.chat.completions.create({
      messages: [{ role: "user", content: productEvaluationPrompt }],
      model: "llama-3.3-70b-versatile",
    });

    const productEvaluationResult = productEvaluationResponse.choices[0]?.message?.content?.trim() || "";

    if (productEvaluationResult === "Valid") {
      console.log("Valid");
    } else if (productEvaluationResult === "Invalid") {
      console.log("No enough explanation");
      return NextResponse.json(NextResponse.json({ error: "Invalid product details" }, { status: 400 }));
    } else {
      return NextResponse.json({ error: "Unexpected response from product evaluation" }, { status: 500 });
    }

    // Prompt to evaluate tweet quality
    const evaluationPrompt = `You are an expert tweet critic with deep knowledge of human psychology, social media engagement strategies, and the latest trends in crafting viral tweets. Your job is to analyze tweets and assess their appeal, authenticity, and engagement potential.

Here is the tweet:

${productDetails}

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
      return NextResponse.json({ tweet: productDetails });
    }

    // Otherwise, extract feedback and generate a revised tweet
    console.log("Tweet feedback:", evaluationResult);

    // Prompt to generate an improved tweet
    const improvementPrompt = `The following tweet was evaluated and received a score below 7. Here is the feedback on how to improve it:

Original Tweet:
"${productDetails}"

Feedback:
${evaluationResult}

Using this feedback, rewrite the tweet to be **more engaging, human-like, and likely to go viral**. Maintain the original intent but make it **stronger** and **more compelling**.

Return only the new tweet. No explanations, no analysis, just the tweet.`;

    // Call Groq API to generate an improved tweet
    const improvementResponse = await groq.chat.completions.create({
      messages: [{ role: "user", content: improvementPrompt }],
      model: "llama-3.3-70b-versatile",
    });

    const improvedTweet = improvementResponse.choices[0]?.message?.content?.trim() || "";

    if (!improvedTweet) {
      return NextResponse.json({ error: "Failed to generate improved tweet" }, { status: 500 });
    }

    console.log("Improved Tweet:", improvedTweet);

    return NextResponse.json({ tweet: improvedTweet, feedback: evaluationResult });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}