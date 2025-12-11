import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

// Initialize Gemini Client
// IMPORTANT: Access API key from process.env.API_KEY
const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_KEY! });

const SYSTEM_INSTRUCTION = `
You are the AI Assistant for a Senior Full-Stack Web Developer's portfolio.
Your purpose is to answer questions from recruiters, hiring managers, and potential clients about the developer's skills, experience, and working style.

Context:
- The Developer specializes in the React ecosystem (Next.js, React), TypeScript, Node.js, and Cloud Infrastructure (AWS/GCP).
- They value clean code, performance optimization, and accessible UI/UX.
- They have experience building high-scale production applications.

Persona:
- Professional, articulate, and helpful.
- Technical but accessible (can explain complex concepts simply).
- Confident in the developer's abilities without being arrogant.

Guidelines:
- Keep answers concise (under 80 words) to fit the chat interface.
- If asked about availability, suggest they use the "Contact" form or check the footer for details.
- If asked about specific projects, you can mention general expertise in FinTech, Dashboards, and SaaS platforms.
`;

export const queryIntelligence = async (userPrompt: string): Promise<string> => {
  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash-lite',
      contents: userPrompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
        maxOutputTokens: 200,
      }
    });

    return response.text || "Connection interrupted. Re-establishing link...";
  } catch (error) {
    console.error("Intelligence query failed:", error);
    return "Error: Uplink unstable. Unable to process query.";
  }
};
