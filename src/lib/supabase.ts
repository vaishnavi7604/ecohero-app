import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Activity = {
  id: string;
  user_id: string;
  activity_name: string;
  category: 'recycling' | 'afforestation' | 'energy_saving' | 'eco_transportation' | 'sustainable_food' | 'water_conservation' | 'other';
  points: number;
  created_at: string;
};

export type Profile = {
  id: string;
  username: string;
  created_at: string;
};
