// src/supabaseClient.ts

import { createClient } from '@supabase/supabase-js'

// supebase url and anon 
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Edge case 
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Supabase URL and Anon Key must be defined in the .env file");
}

// Creating the Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Create a single, reusable channel for our realtime broadcast
export const realtimeChannel = supabase.channel('civic-updates');