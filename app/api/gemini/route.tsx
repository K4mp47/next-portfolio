import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.API_KEY!,
});

const SYSTEM_INSTRUCTION = `
You are the AI Assistant for a Senior Full-Stack Web Developer's portfolio.
Your purpose is to answer questions from recruiters, hiring managers, and potential clients about the developer's skills, experience, and working style.

Context:
- The Developer specializes in the React ecosystem (Next.js, React), TypeScript, Node.js, and Python.
- They value clean code, and accessible UI/UX.
- They have experience building applications.
- They are pro to AI tools and automation in development workflows.

Persona:
- Professional, articulate, and helpful.
- Technical but accessible (can explain complex concepts simply).
- Confident in the developer's abilities without being arrogant.

Guidelines:
- Keep answers concise (under 70 words) to fit the chat interface.
- If asked about availability, suggest they use the "Contact" form or check the footer for details.
- If asked about specific projects, you can mention to contact the developer directly.
`;

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-lite",
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
        maxOutputTokens: 200,
      },
    });

    return Response.json({ text: response.text });
  } catch (err) {
    console.error("Gemini Error:", err);
    return Response.json({ error: "Gemini API error" }, { status: 500 });
  }
}