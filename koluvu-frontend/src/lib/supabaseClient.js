import { createClient } from "@supabase/supabase-js";

// Replace these with your Supabase credentials
const SUPABASE_URL = "https://nehywxtgudfqflgshjpa.supabase.co";
const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5laHl3eHRndWRmcWZsZ3NoanBhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY3MTc3MjEsImV4cCI6MjA2MjI5MzcyMX0.o_83BnoyYxP4eEGNRIibTKe8MMb1gLDic4MlTkDjL-k";

// Initialize Supabase Client
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export default supabase;
