import { geminiService } from "@/services/gemini";
import { handleError } from "@/utils/AppError";
import { z } from "zod";

const enhanceRequestSchema = z.object({
  text: z.string().min(10, "Text must be at least 10 characters").max(10000, "Text is too long"),
  action: z.enum(['summarize', 'expand', 'improve', 'simplify', 'translate', 'tags', 'questions', 'actionItems', 'outline', 'critique']),
  language: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Validate input
    const result = enhanceRequestSchema.safeParse(body);
    if (!result.success) {
      return Response.json(
        { error: "Validation Error", details: result.error.flatten() },
        { status: 400 }
      );
    }

    const { text, action, language } = result.data;
    const enhanced = await geminiService.enhanceText(text, action, language);

    return Response.json({ result: enhanced });
  } catch (error) {
    const { message, statusCode } = handleError(error);
    return Response.json({ error: message }, { status: statusCode });
  }
}
