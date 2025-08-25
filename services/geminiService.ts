
import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  // In a real app, you might handle this more gracefully.
  // For this context, we will proceed, but API calls will fail.
  console.warn("API_KEY environment variable not set. Gemini API calls will fail.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

export const getBreakQuote = async (): Promise<string> => {
  if (!API_KEY) {
    return "Remember to stretch and hydrate. You're doing great!";
  }
  
  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: 'Generate a single, short, encouraging and relaxing sentence for someone on a 15 minute work break. Be positive and concise.',
    });
    return response.text;
  } catch (error) {
    console.error("Error fetching quote from Gemini:", error);
    return "Take a deep breath and enjoy this moment of calm.";
  }
};
