import { Request, Response } from 'express';
import { supabaseAdmin } from '../config/supabase';

// In-memory store fallback for medical history records
let inMemoryMedicalRecords: any[] = [];

// Get all medical history records
export const getMedicalHistory = async (req: Request, res: Response) => {
  try {
    const userId = (req.query.user_id as string) || 'demo-user-id';

    try {
      const { data, error } = await supabaseAdmin
        .from('medical_history')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (!error && data) {
        return res.status(200).json(data);
      }
    } catch {
      // Ignore Supabase connection error and fall back to in-memory store
    }

    const userRecords = inMemoryMedicalRecords.filter((r) => !r.user_id || r.user_id === userId);
    return res.status(200).json(userRecords);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

// Add a new medical history record
export const addMedicalHistory = async (req: Request, res: Response) => {
  try {
    const { disease, doctorName, doctorSpecialty, visitDate, status, notes, prescribedMedicines, user_id } = req.body;

    if (!disease || !doctorName) {
      return res.status(400).json({ error: 'disease and doctorName are required' });
    }

    const newRecord = {
      id: `rec-${Date.now()}`,
      user_id: user_id || 'demo-user-id',
      disease,
      doctorName,
      doctorSpecialty: doctorSpecialty || 'General Practice',
      visitDate: visitDate || new Date().toISOString().split('T')[0],
      status: status || 'Managed',
      notes: notes || '',
      prescribedMedicines: prescribedMedicines || '',
      created_at: new Date().toISOString(),
    };

    // Try Supabase first if configured
    try {
      const { data, error } = await supabaseAdmin
        .from('medical_history')
        .insert([newRecord])
        .select()
        .single();

      if (!error && data) {
        return res.status(201).json(data);
      }
    } catch {
      // Fallback to in-memory store
    }

    inMemoryMedicalRecords.unshift(newRecord);
    console.log('[Backend API] Medical history entry added:', newRecord);
    return res.status(201).json({ message: 'Saved to backend API successfully', record: newRecord });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

// Delete a medical history record
export const deleteMedicalHistory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    try {
      await supabaseAdmin.from('medical_history').delete().eq('id', id);
    } catch {
      // Ignore Supabase error
    }

    inMemoryMedicalRecords = inMemoryMedicalRecords.filter((r) => r.id !== id);
    return res.status(200).json({ message: 'Medical history record deleted successfully', id });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};
