import { Router } from 'express';
import { parsePrescription, getHealthRecommendations, chatWithAI } from '../controllers/ai.controller';

const router = Router();

// POST /api/ai/parse-prescription
router.post('/parse-prescription', parsePrescription);

// POST /api/ai/health-recommendations
router.post('/health-recommendations', getHealthRecommendations);

// POST /api/ai/chat
router.post('/chat', chatWithAI);

export default router;
