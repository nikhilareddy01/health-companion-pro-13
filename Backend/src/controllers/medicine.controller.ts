import { Request, Response } from 'express';
import { supabaseAdmin } from '../config/supabase';

// Get all medicines for a user
export const getMedicines = async (req: Request, res: Response) => {
  try {
    // In a real app, you'd extract the user_id from the verified JWT token in the request headers
    const userId = req.query.user_id as string;
    
    if (!userId) {
      return res.status(400).json({ error: 'user_id is required as a query parameter' });
    }

    const { data, error } = await supabaseAdmin
      .from('medicines')
      .select('*')
      .eq('user_id', userId)
      .order('time', { ascending: true });

    if (error) throw error;
    res.status(200).json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Add a new medicine
export const addMedicine = async (req: Request, res: Response) => {
  try {
    const { user_id, name, dose, time, icon, color } = req.body;
    
    if (!user_id || !name || !dose || !time) {
      return res.status(400).json({ error: 'user_id, name, dose, and time are required' });
    }

    const { data, error } = await supabaseAdmin
      .from('medicines')
      .insert([{ user_id, name, dose, time, icon: icon || 'Pill', color: color || 'primary' }])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Update an existing medicine (e.g., mark as taken)
export const updateMedicine = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const { data, error } = await supabaseAdmin
      .from('medicines')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    if (!data) return res.status(404).json({ error: 'Medicine not found' });
    
    res.status(200).json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a medicine
export const deleteMedicine = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const { error } = await supabaseAdmin
      .from('medicines')
      .delete()
      .eq('id', id);

    if (error) throw error;
    res.status(200).json({ message: 'Medicine deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
