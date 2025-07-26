// Import Supabase client creator
import { createClient } from '@supabase/supabase-js';

// Supabase configuration using environment variables
const SUPABASE_URL = 'https://npuqxyocqaqvicclwjti.supabase.co';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || '';

// Create Supabase client
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Export for use in other files
window.supabaseClient = supabaseClient;
