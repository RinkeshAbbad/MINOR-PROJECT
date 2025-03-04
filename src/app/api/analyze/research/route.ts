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
    console.log("Starting research analysis...");
    const session = await getServerSession(authOptions);

    if (!session) {
      console.log("No session found");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log("Session found:", session.user.email);
    const { topic } = await req.json();

    if (!topic) {
      console.log("No topic provided");
      return NextResponse.json({ error: "Topic is required" }, { status: 400 });
    }

    console.log("Generating research report for topic:", topic);
    
    if (!process.env.OPENAI_API_KEY) {
      console.error("OpenAI API key is not set");
      return NextResponse.json({ error: "OpenAI API key is not configured" }, { status: 500 });
    }

    // Generate research report with OpenAI
    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `You are an expert research assistant that creates comprehensive, well-structured reports.
          Create a detailed research report with these sections:
          
          1. Executive Summary
          - Brief overview of the topic (2-3 sentences)
          - Key findings and implications
          
          2. Introduction
          - Background information
          - Significance of the topic
          - Current state of research
          
          3. Methodology
          - Approach to research
          - Sources and data considered
          
          4. Key Findings
          - Main discoveries and insights
          - Supporting evidence
          - Statistical data when relevant
          
          5. Analysis
          - Detailed examination of findings
          - Interpretation of results
          - Implications for the field
          
          6. Future Implications
          - Potential future developments
          - Areas for further research
          
          7. Conclusion
          - Summary of key points
          - Final recommendations
          
          Format the report with clear headings and maintain a professional, academic tone.
          Include relevant statistics and data where appropriate.
          Ensure all sections are well-connected and flow logically.`,
        },
        {
          role: "user",
          content: `Research topic: ${topic}
          
          Please provide a comprehensive research report following the format above. Focus on current research, key developments, and future implications.`,
        },
      ],
      model: "gpt-3.5-turbo",
      temperature: 0.7,
      max_tokens: 2500,
    });

    console.log("OpenAI response received");
    const report = completion.choices[0].message.content;

    // Save to database
    console.log("Saving to database...");
    await prisma.aiUsage.create({
      data: {
        userId: session.user.id,
        aiType: "research",
        prompt: topic,
        result: report,
      },
    });

    console.log("Successfully generated and saved research report");
    return NextResponse.json({ report });
  } catch (error: any) {
    console.error("Research report generation error:", {
      message: error.message,
      stack: error.stack,
      details: error
    });
    return NextResponse.json(
      { error: "Failed to generate research report", details: error.message },
      { status: 500 }
    );
  }
} 