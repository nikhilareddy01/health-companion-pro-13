import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!supabaseUrl || !supabaseServiceKey || supabaseUrl === 'YOUR_SUPABASE_URL') {
  console.warn('[Backend] WARNING: Supabase URL or Service Role Key is missing in .env!');
}

const validUrl = (supabaseUrl && supabaseUrl !== 'YOUR_SUPABASE_URL') ? supabaseUrl : 'https://demo-placeholder.supabase.co';
const validKey = (supabaseServiceKey && supabaseServiceKey !== 'YOUR_SUPABASE_SERVICE_ROLE_KEY') ? supabaseServiceKey : 'demo-placeholder-key';

export const supabaseAdmin = createClient(validUrl, validKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});
