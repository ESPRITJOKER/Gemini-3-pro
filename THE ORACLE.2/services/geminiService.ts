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
    INPUT CONTEXT:
    Situation: ${situation}
    Financial Constraints: ${constraints.financial}
    Time Constraints: ${constraints.time}
    Risk Tolerance: ${constraints.risk}

    PROTOCOL:
    You are ORACLE, a strategic decision engine.
    
    LANGUAGE RULE (CRITICAL):
    1. Detect the dominant language of the INPUT CONTEXT.
    2. Generate ALL text content (descriptions, titles, reasoning, objectives) in that SAME detected language.
    3. Do NOT translate JSON keys; keep them in English (e.g. 'objective', 'options').

    ANALYSIS STEPS:
    1. Synthesize the core objective.
    2. Extract key constraints.
    3. Generate 3-4 distinct, realistic strategic options.
    4. For each option:
       - Simulate Short-term (0-1y) outcome.
       - Simulate Long-term (3-5y) outcome.
       - Score (0-100): Feasibility, Risk, LongTermImpact, OpportunityCost.
    5. Recommend the optimal path with decisive reasoning.

    OUTPUT:
    Return strictly valid JSON.
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