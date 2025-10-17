
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import type { Transaction, FinancialData } from '../types';
import { formatCurrency } from "../lib/utils";

// Hardcode the API key as requested
const API_KEY = "AIzaSyB5dNacBZbAH13PI5gtSpdUIRFRJkSfjIc";

const ai = new GoogleGenAI({ apiKey: API_KEY });

const generateContent = async (prompt: string): Promise<string> => {
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
    Suggest 3-5specific and actionable ways they could save money based on their habits.
    Keep the analysis concise and easy to understand. Use markdown for formatting, like using bullet points.

    Transactions:
    ${JSON.stringify(expenses)}
  `;
  return generateContent(prompt);
};

export const getInvestmentSuggestions = async (financialData: FinancialData): Promise<string> => {
  const { transactions, goals } = financialData;
  const income = transactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
  const expenses = transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);
  const monthlySavings = income - expenses;

  const prompt = `
    You are a financial advisor for a young, salaried professional in India. Your advice should be practical, beginner-friendly, and goal-oriented. All monetary values are in Indian Rupees (INR).

    User's Financial Profile:
    - Monthly Income: ${income}
    - Monthly Expenses: ${expenses}
    - Monthly Savings: ${monthlySavings}
    - Financial Goals: ${JSON.stringify(goals)}

    Based on this profile, please provide a simple investment plan.
    1.  **Start with a Savings Assessment:** Briefly comment on their current savings potential.
    2.  **Suggest 2-3 Investment Options:**
        - For each option (e.g., Mutual Fund SIP, Public Provident Fund (PPF), Fixed Deposit), explain what it is in simple terms.
        - Suggest a potential monthly investment amount for each, based on their savings and goals.
        - Mention the risk level (e.g., Low, Medium, High) and typical investment horizon.
    3.  **Actionable Next Step:** Conclude with a clear, simple next step the user can take.

    Keep the entire response concise, clear, and encouraging. Use markdown for formatting.
  `;
  return generateContent(prompt);
};

export const getFinancialOutline = async (financialData: FinancialData, riskProfile: 'low' | 'normal' | 'high'): Promise<string> => {
    const { transactions, goals } = financialData;
    const income = transactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
    const expenses = transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);
    const monthlySavings = income - expenses;

    const prompt = `
    You are a friendly and expert financial planner for a user in India. Your advice should be practical, educational, and tailored to their specific situation. All monetary values are in Indian Rupees (INR).

    Based on the user's financial data and their chosen risk profile, create a comprehensive, step-by-step "Financial Outline". Structure your response in clear, easy-to-digest sections using markdown. Use headings, bold text, and bullet points.

    **User's Financial Profile:**
    - Monthly Income: ${income}
    - Monthly Expenses: ${expenses}
    - Current Monthly Savings: ${monthlySavings}
    - Financial Goals: ${JSON.stringify(goals)}
    - Chosen Risk Profile: "${riskProfile}"

    **Please generate the following sections:**

    ### 1. Your Financial Foundation
    - **Emergency Fund:** Explain its importance. Recommend a target size (e.g., 3-6 months of expenses which is ${formatCurrency(expenses * 3)} to ${formatCurrency(expenses * 6)}) and suggest where to keep it (e.g., high-yield savings account, liquid mutual fund).
    - **Insurance Check-up:** Stress the importance of Term Life Insurance and Health Insurance. Suggest appropriate cover amounts based on their income.

    ### 2. Smart Budgeting: The 50/30/20 Guideline
    - Based on their income, suggest a personalized budget allocation for Needs (essentials), Wants (lifestyle), and Savings. Explain your reasoning and how their current spending compares.
    - **IMPORTANT**: Also embed the budget allocation in a clean JSON block like this, with no markdown formatting around it:
    BUDGET_JSON_START
    {
      "needs": { "percentage": 50, "amount": ${income * 0.5} },
      "wants": { "percentage": 30, "amount": ${income * 0.3} },
      "savings": { "percentage": 20, "amount": ${income * 0.2} }
    }
    BUDGET_JSON_END

    ### 3. Your Personalized Investment Plan (Risk Profile: ${riskProfile})
    - **Asset Allocation:** Recommend a percentage split between Equity, Debt, and Gold that aligns with their risk profile.
    - **Investment Recommendations:** For each asset class, suggest 2-3 specific investment options available in India. For example:
        - **Equity:** Index Funds (Nifty 50), Large-cap funds, or ELSS for tax saving.
        - **Debt:** PPF, VPF, or Debt Mutual Funds.
        - **Other:** Sovereign Gold Bonds (SGBs).
    - For each recommendation, briefly explain what it is, its risk level, and typical investment horizon.

    ### 4. Supercharge Your Tax Savings
    - Explain key tax-saving strategies under the old tax regime.
    - Highlight sections like 80C, 80D, and 80CCD(1B) for NPS.
    - Suggest specific investments from the plan above that also help in tax saving (e.g., ELSS, PPF, NPS).

    ### 5. Smart Credit Card Strategy
    - Based on their expense data, recommend 1-2 types of credit cards that would benefit them (e.g., a cashback card for groceries, a travel card).
    - Provide 2-3 tips on responsible credit card usage.

    ### 6. Your Actionable Next Steps
    - Summarize the top 3 most important actions the user should take in the next month to get started.
    `;

    return generateContent(prompt);
};

export const getChatResponse = async (
    history: { role: 'user' | 'model'; parts: { text: string }[] }[],
    financialData: FinancialData
): Promise<string> => {
    const income = financialData.transactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
    const expenses = financialData.transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);
    
    const systemInstruction = `You are SAFE, a friendly and helpful financial assistant for a user in India. All monetary values are in Indian Rupees (INR). Keep your responses concise, conversational, and use markdown for formatting. You can use the following real-time data about the user to inform your answers.
    
    User's Financial Profile:
    - Monthly Income: ${formatCurrency(income)}
    - Monthly Expenses: ${formatCurrency(expenses)}
    - Budgets: ${JSON.stringify(financialData.budgets)}
    - Financial Goals: ${JSON.stringify(financialData.goals)}`;
    
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: history,
            config: {
                systemInstruction,
            },
        });
        return response.text;
    } catch (error) {
        console.error("Error generating chat response:", error);
        return "I'm having trouble connecting right now. Please try again in a moment.";
    }
};
