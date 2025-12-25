import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeFace = async (base64Image: string): Promise<AnalysisResult> => {
  try {
    // Strip the data URL prefix if present to get just the base64 string
    const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, "");

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: base64Data,
            },
          },
          {
            text: `Analyze the face in this selfie. 
            1. Rate the aesthetics from 0 to 100 based on conventional beauty standards and symmetry.
            2. Identify the face shape (e.g., Oval, Square, Round, Diamond, Heart).
            3. Provide a list of "bad" features or areas for improvement (be honest but constructive, e.g., skin texture, asymmetry, grooming).
            4. Provide a list of best features.
            5. Suggest 3 modern haircuts that specifically suit this face shape and why.
            
            Return the result in JSON format.`
          },
        ],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            rating: { type: Type.NUMBER, description: "Rating from 0 to 100" },
            faceShape: { type: Type.STRING, description: "The identified face shape" },
            critique: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: "List of areas for improvement or 'bad' features"
            },
            bestFeatures: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "List of the best facial features"
            },
            haircutSuggestions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  description: { type: Type.STRING },
                  reason: { type: Type.STRING }
                },
                required: ["name", "description", "reason"]
              },
              description: "3 haircut suggestions"
            }
          },
          required: ["rating", "faceShape", "critique", "bestFeatures", "haircutSuggestions"]
        }
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response from AI");
    }

    return JSON.parse(text) as AnalysisResult;

  } catch (error) {
    console.error("Error analyzing face:", error);
    throw error;
  }
};
