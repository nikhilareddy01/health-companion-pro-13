import { Router } from 'express';
import { getMedicalHistory, addMedicalHistory, deleteMedicalHistory } from '../controllers/medical-history.controller';

const router = Router();

// GET /api/medical-history
router.get('/', getMedicalHistory);

// POST /api/medical-history
router.post('/', addMedicalHistory);

// DELETE /api/medical-history/:id
router.delete('/:id', deleteMedicalHistory);

export default router;
