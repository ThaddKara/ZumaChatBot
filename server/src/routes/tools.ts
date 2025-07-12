import { Router } from 'express';
import { Orchestrator } from '../orchestration/Orchestrator';
import { ToolClassifier } from '../orchestration/ToolClassifier';
import { OpenAIService } from '../services/OpenAIService';

const router = Router();
const openaiService = new OpenAIService(process.env.OPENAI_API_KEY!);
const classifier = new ToolClassifier(openaiService);
const orchestrator = new Orchestrator(classifier);

router.post('/orchestrate', async (req, res) => {
  const { userInput } = req.body;
  try {
    const result = await orchestrator.handle(userInput);
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, message: 'Orchestration failed', error: err });
  }
});

export default router; 