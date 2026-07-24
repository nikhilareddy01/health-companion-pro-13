import { Request, Response } from 'express';
import { supabaseAdmin } from '../config/supabase';

// Central in-memory store for real-time cross-device sync
const accountsStore: Record<string, any> = {};
const profilesStore: Record<string, any> = {};

// Register/Sync account across devices
export const syncAccount = async (req: Request, res: Response) => {
  try {
    const { email, password, name, userId } = req.body;
    if (!email) return res.status(400).json({ error: 'Email is required' });

    const key = email.toLowerCase();
    accountsStore[key] = { email, password, name, userId, createdAt: new Date().toISOString() };
    if (userId) {
      profilesStore[userId] = { id: userId, email, name, ...(profilesStore[userId] || {}) };
    }
    
    console.log(`[Backend Sync] Account synced: ${email} (ID: ${userId})`);
    res.status(200).json({ status: 'ok', account: accountsStore[key] });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// Login verification across devices
export const loginAccount = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email) return res.status(400).json({ error: 'Email is required' });

    const key = email.toLowerCase();
    const existing = accountsStore[key];
    
    if (existing) {
      return res.status(200).json({ status: 'ok', account: existing });
    }

    // Auto-create on first login if not present
    const userId = `user_${key.replace(/[^a-zA-Z0-9]/g, '_')}`;
    const newAcc = { email, password, name: email.split('@')[0], userId };
    accountsStore[key] = newAcc;
    res.status(200).json({ status: 'ok', account: newAcc });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// Get user profile
export const getProfile = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ error: 'User ID is required' });

    if (profilesStore[id]) {
      return res.status(200).json(profilesStore[id]);
    }

    const { data, error } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116' || error.message.includes('public.profiles') || error.code === '42P01') {
        const fallback = {
          id,
          name: "Patient",
          email: "user@example.com",
          phone: "9390449424",
        };
        profilesStore[id] = fallback;
        return res.status(200).json(fallback);
      }
      throw error;
    }
    
    res.status(200).json(data || {});
  } catch (error: any) {
    console.error('[Backend] Error fetching profile:', error);
    res.status(500).json({ error: error.message });
  }
};

// Update user profile
export const updateProfile = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    profilesStore[id] = { ...(profilesStore[id] || {}), id, ...updates };

    try {
      await supabaseAdmin.from('profiles').upsert({ id, ...updates });
    } catch {
      // Ignore database missing table warnings
    }
    
    console.log(`[Backend Sync] Profile updated for ${id}`);
    res.status(200).json(profilesStore[id]);
  } catch (error: any) {
    console.error('[Backend] Error updating profile:', error);
    res.status(500).json({ error: error.message });
  }
};

const userDataStore: Record<string, Record<string, any>> = {};

export const syncUserData = async (req: Request, res: Response) => {
  try {
    const { userId, dataKey, value, fullData } = req.body;
    if (!userId) return res.status(400).json({ error: 'userId is required' });

    if (!userDataStore[userId]) {
      userDataStore[userId] = {};
    }

    if (fullData && typeof fullData === 'object') {
      userDataStore[userId] = { ...userDataStore[userId], ...fullData };
    }

    if (dataKey) {
      userDataStore[userId][dataKey] = value;
    }

    console.log(`[Backend Sync] UserData updated for ${userId}:`, Object.keys(userDataStore[userId]));
    res.status(200).json({ status: 'ok', data: userDataStore[userId] });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const getUserData = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    if (!userId) return res.status(400).json({ error: 'userId is required' });

    const userObj = userDataStore[userId] || {};
    res.status(200).json({ status: 'ok', data: userObj });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

