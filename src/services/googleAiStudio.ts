import { GoogleGenerativeAI } from '@google/generative-ai';

// Central Google AI Studio API Key Configuration
export const GOOGLE_AI_STUDIO_API_KEY =
  (import.meta as any).env?.VITE_GEMINI_API_KEY || '';


export const isApiKeyConfigured = Boolean(
  GOOGLE_AI_STUDIO_API_KEY && GOOGLE_AI_STUDIO_API_KEY.length > 10
);

let genAiInstance: GoogleGenerativeAI | null = null;

export function getGoogleGenerativeAI(): GoogleGenerativeAI {
  if (!genAiInstance) {
    genAiInstance = new GoogleGenerativeAI(GOOGLE_AI_STUDIO_API_KEY);
  }
  return genAiInstance;
}

export function getGeminiModel(modelName: string = 'gemini-1.5-flash') {
  const genAI = getGoogleGenerativeAI();
  return genAI.getGenerativeModel({ model: modelName });
}

export async function verifyGoogleAiConnection(): Promise<{ connected: boolean; model: string; error?: string }> {
  try {
    const model = getGeminiModel('gemini-1.5-flash');
    const result = await model.generateContent('Say "SpendWise AI Connected" in 3 words.');
    const response = await result.response;
    return {
      connected: true,
      model: 'gemini-1.5-flash',
    };
  } catch (err: any) {
    return {
      connected: false,
      model: 'gemini-1.5-flash',
      error: err.message || 'API connection failed',
    };
  }
}
