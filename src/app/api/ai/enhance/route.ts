// src/app/api/ai/enhance/route.ts
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);

export async function POST(req: Request) {
  try {
    const { text } = await req.json();

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash-latest",
    });

    const result = await model.generateContent(text);
    const response = await result.response;
    const enhanced = response.text();

    return Response.json({ enhanced });
  } catch (error) {
    console.error("AI Enhance Error:", error);

    const message =
      error instanceof Error ? error.message : "Unknown server error";

    return Response.json({ error: message }, { status: 500 });
  }
}

