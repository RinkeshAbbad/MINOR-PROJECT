import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/auth";
import { PrismaClient } from "@prisma/client";
import OpenAI from "openai";

const prisma = new PrismaClient();
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    console.log("Starting tweet generation...");
    const session = await getServerSession(authOptions);

    if (!session) {
      console.log("No session found");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log("Session found:", session.user.email);
    const { topic, tone } = await req.json();

    if (!topic || !tone) {
      console.log("Missing required fields:", { topic, tone });
      return NextResponse.json({ error: "Topic and tone are required" }, { status: 400 });
    }

    console.log("Generating tweets for topic:", topic, "with tone:", tone);
    
    if (!process.env.OPENAI_API_KEY) {
      console.error("OpenAI API key is not set");
      return NextResponse.json({ error: "OpenAI API key is not configured" }, { status: 500 });
    }

    // Generate tweets with OpenAI
    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `You are a social media expert who creates engaging tweets.
          Create ${tone} tweets that:
          - Are under 280 characters
          - Include 1-2 relevant hashtags
          - Are engaging and shareable
          - Match the requested tone perfectly
          - Use emojis appropriately (1-2 per tweet)`,
        },
        {
          role: "user",
          content: `Create 3 ${tone} tweets about: ${topic}

          Requirements:
          - Each tweet on a new line
          - No numbering or bullets
          - Include hashtags naturally
          - Keep tone consistent`,
        },
      ],
      model: "gpt-3.5-turbo",
      temperature: 0.8,
      max_tokens: 500,
    });

    console.log("OpenAI response received");
    const response = completion.choices[0].message.content;
    const tweets = response?.split('\n').filter(tweet => tweet.trim().length > 0) || [];

    // Save to database
    console.log("Saving to database...");
    await prisma.aiUsage.create({
      data: {
        userId: session.user.id,
        aiType: "twitter",
        prompt: `${topic} (${tone})`,
        result: tweets.join('\n'),
      },
    });

    console.log("Successfully generated and saved tweets");
    return NextResponse.json({ tweets });
  } catch (error: any) {
    console.error("Tweet generation error:", {
      message: error.message,
      stack: error.stack,
      details: error
    });
    return NextResponse.json(
      { error: "Failed to generate tweets", details: error.message },
      { status: 500 }
    );
  }
} 