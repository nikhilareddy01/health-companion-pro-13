import { Router } from 'express';
import { getProfile, updateProfile, syncAccount, loginAccount, syncUserData, getUserData } from '../controllers/profile.controller';

const router = Router();

// POST /api/profiles/sync_account
router.post('/sync_account', syncAccount);

// POST /api/profiles/login_account
router.post('/login_account', loginAccount);

// POST /api/profiles/sync_userdata
router.post('/sync_userdata', syncUserData);

// GET /api/profiles/get_userdata/:userId
router.get('/get_userdata/:userId', getUserData);

// GET /api/profiles/:id
router.get('/:id', getProfile);

// PUT /api/profiles/:id
router.put('/:id', updateProfile);

export default router;
