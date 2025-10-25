
import { GoogleGenAI } from "@google/genai";

// Assume API_KEY is set in the environment
const API_KEY = process.env.API_KEY;
if (!API_KEY) {
  console.warn("API_KEY is not set. Gemini features will not work.");
}
const ai = new GoogleGenAI({ apiKey: API_KEY });

/**
 * Generates a compelling product description.
 * Uses gemini-2.5-flash-lite for a fast response.
 */
export const generateProductDescription = async (productName: string, category: string): Promise<string> => {
    if (!API_KEY) return "API Key not configured.";
  try {
    const prompt = `Generate a compelling, short e-commerce product description for a product named "${productName}" in the category "${category}". Focus on key features and benefits. Keep it under 50 words.`;
    
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-lite',
        contents: prompt,
    });

    return response.text.trim();
  } catch (error) {
    console.error("Error generating product description:", error);
    return "Failed to generate description.";
  }
};

/**
 * Analyzes business data to answer complex user queries.
 * Uses gemini-2.5-pro with maximum thinkingBudget for deep analysis.
 */
export const analyzeBusinessData = async (prompt: string, data: object): Promise<string> => {
    if (!API_KEY) return "API Key not configured.";
  try {
    const fullPrompt = `
      You are a world-class business analyst. Based on the following JSON data, please answer the user's query.
      Provide a clear, concise, and insightful answer. Use markdown for formatting if it helps clarity (e.g., lists, bold text).

      **User Query:** "${prompt}"

      **JSON Data:**
      \`\`\`json
      ${JSON.stringify(data, null, 2)}
      \`\`\`
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-pro',
      contents: fullPrompt,
      config: {
        thinkingConfig: { thinkingBudget: 32768 }
      }
    });

    return response.text;
  } catch (error) {
    console.error("Error analyzing business data:", error);
    return "I was unable to analyze the data. Please try again.";
  }
};
