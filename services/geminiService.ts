
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import type { Transaction, FinancialData } from '../types';

// Ensure the API key is available in the environment variables
const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("API_KEY environment variable not set. AI features will be disabled.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const generateContent = async (prompt: string): Promise<string> => {
    if (!API_KEY) return "AI service is unavailable. Please configure the API key.";
    try {
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        return response.text;
    } catch (error) {
        console.error("Error generating content:", error);
        return "Sorry, I encountered an error while processing your request.";
    }
};

export const getFinancialAdvice = async (query: string, financialData: FinancialData): Promise<string> => {
  const prompt = `
    You are a friendly and helpful financial assistant for a user in India.
    Analyze the user's financial data and their question to provide personalized advice.
    All monetary values are in Indian Rupees (INR).

    User's Financial Data:
    - Recent Transactions: ${JSON.stringify(financialData.transactions.slice(0, 10))}
    - Budgets: ${JSON.stringify(financialData.budgets)}
    - Financial Goals: ${JSON.stringify(financialData.goals)}

    User's Question: "${query}"

    Please provide a concise and actionable response. Use markdown for formatting.
  `;
  return generateContent(prompt);
};

export const getSpendingAnalysis = async (transactions: Transaction[]): Promise<string> => {
  const expenses = transactions.filter(t => t.type === 'expense');
  const prompt = `
    You are an expert financial analyst. Analyze the following list of transactions (in INR) from an Indian user.
    Provide a brief summary of their spending patterns.
    Identify the top 3 spending categories.
    Suggest 2-3 specific and actionable ways they could save money based on their habits.
    Keep the analysis concise and easy to understand. Use markdown for formatting, like using bullet points.

    Transactions:
    ${JSON.stringify(expenses)}
  `;
  return generateContent(prompt);
};
