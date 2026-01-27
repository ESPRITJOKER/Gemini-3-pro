import { GoogleGenAI, Type } from "@google/genai";
import { OracleAnalysis } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeDecision = async (
  situation: string,
  constraints: { financial: string; time: string; risk: string }
): Promise<OracleAnalysis> => {
  // We can rely on process.env.API_KEY being present as per guidelines, but checking availability is safe practice.
  if (!process.env.API_KEY) {
    throw new Error("API Key is missing.");
  }

  const prompt = `
    SITUATION:
    ${situation}

    CONSTRAINTS:
    - Financial: ${constraints.financial}
    - Time: ${constraints.time}
    - Risk Tolerance: ${constraints.risk}

    ROLE:
    You are ORACLE, an advanced AI decision-reasoning engine.
    Your role is NOT to chat or give generic advice.
    Your role is to analyze high-stakes real-world decisions.
    
    TASK:
    1. Identify the user's core objective.
    2. Extract key constraints (financial, time, risk, access, ethics).
    3. Generate 3-4 realistic decision options.
    4. Simulate short-term (0-1 year) and long-term (3-5 years) outcomes for each option.
    5. Score each option (0-100 scale) on:
       - Feasibility (Higher is easier)
       - Risk (Higher is riskier)
       - Long-term Impact (Higher is better positive impact)
       - Opportunity Cost (Higher is higher cost/loss of other options)
    6. Recommend the best option with a clear justification.

    OUTPUT:
    Provide the result in strictly structured JSON format.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 2048 },
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            objective: { type: Type.STRING, description: "The core objective identified from the situation." },
            identifiedConstraints: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: "List of key constraints extracted."
            },
            options: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                  shortTermSimulation: { type: Type.STRING, description: "0-1 year outcome simulation" },
                  longTermSimulation: { type: Type.STRING, description: "3-5 years outcome simulation" },
                  scores: {
                    type: Type.OBJECT,
                    properties: {
                      feasibility: { type: Type.INTEGER },
                      risk: { type: Type.INTEGER },
                      longTermImpact: { type: Type.INTEGER },
                      opportunityCost: { type: Type.INTEGER }
                    },
                    required: ["feasibility", "risk", "longTermImpact", "opportunityCost"]
                  }
                },
                required: ["title", "description", "shortTermSimulation", "longTermSimulation", "scores"]
              }
            },
            recommendation: {
              type: Type.OBJECT,
              properties: {
                bestOptionTitle: { type: Type.STRING },
                reasoning: { type: Type.STRING }
              },
              required: ["bestOptionTitle", "reasoning"]
            }
          },
          required: ["objective", "identifiedConstraints", "options", "recommendation"]
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as OracleAnalysis;
    } else {
      throw new Error("No response text received from Gemini.");
    }
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw error;
  }
};