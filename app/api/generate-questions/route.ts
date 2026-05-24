import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

type GenerateQuestionsRequest = {
  topic?: unknown;
};

function parseQuestions(text: string): string[] {
  try {
    // Prefer the JSON array requested in the prompt.
    const parsed = JSON.parse(text) as unknown;

    if (
      Array.isArray(parsed) &&
      parsed.every((question) => typeof question === "string")
    ) {
      return parsed.map((question) => question.trim()).filter(Boolean).slice(0, 5);
    }
  } catch {
    // Fall back to parsing plain text if the model does not return strict JSON.
  }

  // Accept simple numbered or bulleted text if Gemini returns plain text.
  return text
    .split(/\r?\n/)
    .map((line) => line.replace(/^\s*(?:\d+[\).\s-]+|[-*]\s+)/, "").trim())
    .filter(Boolean)
    .slice(0, 5);
}

export async function POST(request: Request) {
  let body: GenerateQuestionsRequest;

  try {
    body = (await request.json()) as GenerateQuestionsRequest;
  } catch {
    return NextResponse.json(
      { error: "Request body must be valid JSON." },
      { status: 400 },
    );
  }

  const topic = typeof body.topic === "string" ? body.topic.trim() : "";

  if (!topic) {
    return NextResponse.json(
      { error: "Topic is required." },
      { status: 400 },
    );
  }

  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "Gemini API key is not configured." },
      { status: 500 },
    );
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      // Allow deployment-specific model changes without editing source code.
      model: process.env.GEMINI_MODEL || "gemini-2.5-flash",
      contents: `Generate exactly 5 concise interview questions for this topic: ${topic}. Return only a JSON array of strings.`,
      config: {
        responseMimeType: "application/json",
      },
    });

    const questions = parseQuestions(response.text ?? "");

    if (questions.length === 0) {
      return NextResponse.json(
        { error: "Gemini did not return any questions." },
        { status: 502 },
      );
    }

    return NextResponse.json({ questions });
  } catch (error) {
    console.error("Gemini question generation failed:", error);

    return NextResponse.json(
      { error: "Failed to generate questions. Please try again." },
      { status: 502 },
    );
  }
}
