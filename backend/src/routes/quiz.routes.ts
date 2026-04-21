import { Router, Request, Response } from "express";
import { generateQuizQuestions } from "../services/quiz.service";

const router = Router();

router.post("/generate-questions", async (req: Request, res: Response) => {
  const { sourceUrl, roomId } = req.body;
  if (!sourceUrl || !roomId) {
    return res.status(400).json({ error: "sourceUrl and roomId are required" });
  }
  try {
    const questions = await generateQuizQuestions(sourceUrl);
    return res.json({ roomId, sourceUrl, questions });
  } catch (err) {
    console.error("Quiz error:", err);
    return res.status(500).json({ error: "Failed to generate questions" });
  }
});

export default router;