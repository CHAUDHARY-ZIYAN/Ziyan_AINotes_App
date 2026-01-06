import { GoogleGenerativeAI } from "@google/generative-ai";
import { AppError } from "@/utils/AppError";
import { logger } from '@/lib/utils';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);

const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
});

type AIAction = 'summarize' | 'expand' | 'improve' | 'simplify' | 'translate' | 'tags' | 'questions' | 'actionItems' | 'outline' | 'critique';

const ACTION_PROMPTS: Record<AIAction, (text: string, language?: string) => string> = {
    summarize: (text) => `Create a brief, concise summary of the following text. Focus on key points:\n\n${text}`,
    expand: (text) => `Expand the following text with more details, examples, and explanations while maintaining the original meaning:\n\n${text}`,
    improve: (text) => `Improve the writing quality, grammar, clarity, and flow of the following text:\n\n${text}`,
    simplify: (text) => `Simplify the following text to make it easier to understand. Use simple language and shorter sentences:\n\n${text}`,
    translate: (text, language) => `Translate the following text to ${language}. Maintain the original formatting and meaning:\n\n${text}`,
    tags: (text) => `Generate 5-7 relevant tags for the following text. Return ONLY the tags as a comma-separated list:\n\n${text}`,
    questions: (text) => `Generate 5-7 study questions based on the following text:\n\n${text}`,
    actionItems: (text) => `Extract all action items from the following text. Format as a bullet list:\n\n${text}`,
    outline: (text) => `Create a structured outline of the main points in the following text:\n\n${text}`,
    critique: (text) => `Provide constructive feedback and suggestions to improve the following text:\n\n${text}`,
};

export const geminiService = {
    async enhanceText(text: string, action: AIAction, language?: string): Promise<string> {
        try {
            const promptFn = ACTION_PROMPTS[action];
            if (!promptFn) {
                throw new AppError(`Invalid action: ${action}`, 400);
            }

            const prompt = promptFn(text, language);
            const result = await model.generateContent(prompt);
            const response = await result.response;
            const enhanced = response.text();

            if (!enhanced) {
                throw new AppError("Failed to generate content", 500);
            }

            return enhanced;
        } catch (err: unknown) {
            const error = err as any; // Cast for property access or use a more robust check
            logger.error("Gemini Service Error:", error);

            if (error?.message?.includes('API_KEY_INVALID')) {
                throw new AppError("Invalid Google API Key. Please check your .env file.", 401, true);
            }
            if (error?.message?.includes('fetch failed')) {
                throw new AppError("AI service connectivity issue. Please check your internet or try again later.", 503, true);
            }

            if (error instanceof AppError) throw error;
            throw new AppError(`AI service error: ${error?.message || "Unknown error"}`, 500, true);
        }
    },
};
