import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/auth";
import { PrismaClient } from "@prisma/client";
import { YoutubeTranscript } from "youtube-transcript";
import OpenAI from "openai";

const prisma = new PrismaClient();
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    console.log("Starting YouTube analysis...");
    const session = await getServerSession(authOptions);

    if (!session) {
      console.log("No session found");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log("Session found:", session.user.email);
    const { url } = await req.json();

    if (!url) {
      console.log("No URL provided");
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    console.log("Processing YouTube URL:", url);
    
    // Extract video ID from URL
    const videoId = new URL(url).searchParams.get("v");
    if (!videoId) {
      console.log("Invalid YouTube URL, no video ID found");
      return NextResponse.json({ error: "Invalid YouTube URL" }, { status: 400 });
    }

    console.log("Fetching transcript for video ID:", videoId);
    
    if (!process.env.OPENAI_API_KEY) {
      console.error("OpenAI API key is not set");
      return NextResponse.json({ error: "OpenAI API key is not configured" }, { status: 500 });
    }

    // Get video transcript
    try {
      const transcript = await YoutubeTranscript.fetchTranscript(videoId);
      console.log("Transcript fetched successfully");
      const transcriptText = transcript.map(part => part.text).join(" ");

      // Analyze with OpenAI
      console.log("Analyzing transcript with OpenAI...");
      const completion = await openai.chat.completions.create({
        messages: [
          {
            role: "system",
            content: "You are a helpful assistant that analyzes YouTube video transcripts and provides concise, insightful summaries. Focus on key points and main ideas.",
          },
          {
            role: "user",
            content: `Please analyze this video transcript and provide a summary including: 
            1. Main Topic (2-3 sentences)
            2. Key Points (bullet points)
            3. Overall Message (1-2 sentences)
            
            Transcript: ${transcriptText}`,
          },
        ],
        model: "gpt-3.5-turbo",
        temperature: 0.7,
        max_tokens: 1000,
      });

      console.log("OpenAI response received");
      const analysis = completion.choices[0].message.content;

      // Save to database
      console.log("Saving to database...");
      await prisma.aiUsage.create({
        data: {
          userId: session.user.id,
          aiType: "youtube",
          prompt: url,
          result: analysis,
        },
      });

      console.log("Successfully generated and saved analysis");
      return NextResponse.json({ analysis });
    } catch (transcriptError: any) {
      console.error("Transcript fetch error:", {
        message: transcriptError.message,
        details: transcriptError
      });
      return NextResponse.json(
        { error: "Could not fetch video transcript. Make sure the video has captions enabled.", details: transcriptError.message },
        { status: 400 }
      );
    }
  } catch (error: any) {
    console.error("YouTube analysis error:", {
      message: error.message,
      stack: error.stack,
      details: error
    });
    return NextResponse.json(
      { error: "Failed to analyze video", details: error.message },
      { status: 500 }
    );
  }
} 