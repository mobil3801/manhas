// Supabase configuration
const SUPABASE_URL = 'https://npuqxyocqaqvicclwjti.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5wdXF4eW9jcWFxdmljY2x3anRpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMzNzc4NTMsImV4cCI6MjA2ODk1Mzg1M30.mzMsUY0kIoRASwalbm7Pu7ohzZzFuqzMKLekJqFZS8c';

// Initialize Supabase client
function initializeSupabase() {
    if (typeof supabase !== 'undefined') {
        return supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    } else {
        console.error('Supabase library not loaded');
        return null;
    }
}

// Export for use in other files
window.initializeSupabase = initializeSupabase;
