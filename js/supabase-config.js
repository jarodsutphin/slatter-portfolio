// Fill in your Supabase project URL and anon key after creating the project at supabase.com
var SUPABASE_URL      = 'https://vzzkftfsefrdfjfygedu.supabase.co';
var SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ6emtmdGZzZWZyZGZqZnlnZWR1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM1MjI4NzcsImV4cCI6MjA5OTA5ODg3N30.Mhpuuf0JIgAB2X1hoMmkjugpF8rCOcGq1bjJ7EGQ0VI';
var ADMIN_PASSWORD    = 'Slatter87';

window.db = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
