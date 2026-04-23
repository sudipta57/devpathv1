import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function generateQuizQuestions(sourceUrl: string) {
  // const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
  const prompt = `
    You are a coding education expert. Analyze this resource: ${sourceUrl}
    Generate exactly 10 comprehension questions.
    Return ONLY a valid JSON array, no markdown, no extra text:
    [
      { "id": 1, "question": "...", "type": "mcq", "options": ["A","B","C","D"], "answer": "A" }
    ]
    Make 7 MCQ (with options + answer) and 3 short-answer (omit options and answer, type = "short").
  `;

  const result = await model.generateContent(prompt);
  const text = result.response.text();
  const clean = text.replace(/```json|```/g, "").trim();
try {
  return JSON.parse(clean);
} catch (err) {
  console.error("JSON parse failed:", clean);
  throw new Error("Invalid AI response format");
}
}  