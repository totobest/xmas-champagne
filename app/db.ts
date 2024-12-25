import { createClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";

// Create a single supabase client for interacting with your database
export default createClient<Database>(
  "https://xmdbduqvqpbxaluhbvsl.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhtZGJkdXF2cXBieGFsdWhidnNsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzUwMzMxMjIsImV4cCI6MjA1MDYwOTEyMn0.TQxz5n655CZsP_U4S61lgmNkb3QFkSdSG3nqvMV2HzQ",
  { auth: { persistSession: true } }
);
