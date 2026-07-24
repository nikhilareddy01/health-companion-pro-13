import { Router } from 'express';
import { getMedicines, addMedicine, updateMedicine, deleteMedicine } from '../controllers/medicine.controller';

const router = Router();

// GET /api/medicines?user_id=123
router.get('/', getMedicines);

// POST /api/medicines
router.post('/', addMedicine);

// PUT /api/medicines/:id
router.put('/:id', updateMedicine);

// DELETE /api/medicines/:id
router.delete('/:id', deleteMedicine);

export default router;
