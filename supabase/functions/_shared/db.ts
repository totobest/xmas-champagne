import { createClient } from 'jsr:@supabase/supabase-js@2'
import {Database} from './database.types.ts'

// Create a single supabase client for interacting with your database
export default createClient<Database>('https://xmdbduqvqpbxaluhbvsl.supabase.co', "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhtZGJkdXF2cXBieGFsdWhidnNsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczNTAzMzEyMiwiZXhwIjoyMDUwNjA5MTIyfQ.hAtUGM2xVK3rCWGe1wFoVcO2S-T0JFp7u4sp70rWf-8", {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })