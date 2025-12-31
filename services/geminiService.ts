import { GoogleGenAI, Type } from "@google/genai";
import { AIParseResult, MediaType } from '../types';
import { TAGS, ENTITIES, SOURCES } from '../constants';

// Initialize Gemini
// NOTE: Process.env.API_KEY is handled by the build environment
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const parseNaturalLanguageQuery = async (query: string): Promise<AIParseResult | null> => {
  if (!process.env.API_KEY) {
    console.warn("No API Key found, AI features disabled.");
    return null;
  }

  try {
    const prompt = `
      You are an advanced search query parser for a digital asset management system.
      The user will provide a natural language search request.
      Your job is to translate this request into a structured JSON object that matches the system's filtering capabilities.

      Available Metadata:
      - Tags: ${TAGS.join(', ')}
      - Entities: ${ENTITIES.join(', ')}
      - Sources: ${SOURCES.join(', ')}
      - Media Types: Image, Video, Audio, Document
      - Years: 2020-2025
      - Score: 0-100

      Instructions:
      1. Extract keywords for the 'searchQuery'.
      2. Identify any tags explicitly or implicitly mentioned.
      3. Identify entities mentioned (e.g., "Taylor Swift", "NASA").
      4. Identify sources mentioned (e.g., "from Reddit", "Unsplash images").
      5. Identify media types (e.g., "show me videos").
      6. Identify numeric ranges for year or score (e.g., "high quality" implies score > 80, "recent" implies year >= 2024).

      Return strictly a JSON object.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: query,
      config: {
        systemInstruction: prompt,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            searchQuery: { type: Type.STRING },
            tags: { type: Type.ARRAY, items: { type: Type.STRING } },
            entities: { type: Type.ARRAY, items: { type: Type.STRING } },
            sources: { type: Type.ARRAY, items: { type: Type.STRING } },
            mediaTypes: { type: Type.ARRAY, items: { type: Type.STRING, enum: Object.values(MediaType) } },
            minScore: { type: Type.NUMBER },
            maxScore: { type: Type.NUMBER },
            minYear: { type: Type.NUMBER },
            maxYear: { type: Type.NUMBER },
          }
        }
      }
    });

    const text = response.text;
    if (!text) return null;
    return JSON.parse(text) as AIParseResult;

  } catch (error) {
    console.error("Gemini Parse Error:", error);
    return null;
  }
};
