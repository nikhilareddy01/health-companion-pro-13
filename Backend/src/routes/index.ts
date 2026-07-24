import { Router } from 'express';
import healthRoutes from './health.routes';
import medicineRoutes from './medicine.routes';
import profileRoutes from './profile.routes';
import aiRoutes from './ai.routes';
import medicalHistoryRoutes from './medical-history.routes';

const router = Router();

// Register routes
router.use('/health', healthRoutes);
router.use('/medicines', medicineRoutes);
router.use('/profiles', profileRoutes);
router.use('/ai', aiRoutes);
router.use('/medical-history', medicalHistoryRoutes);

export default router;

