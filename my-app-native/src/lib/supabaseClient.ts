import { createClient } from '@supabase/supabase-js'
import Constants from 'expo-constants';

const supabaseUrl = Constants.expoConfig?.extra?.supabaseUrl || "https://yhxdyndkdhhnuginaekn.supabase.co"
const supabaseAnonKey = Constants.expoConfig?.extra?.supabaseAnonKey || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InloeGR5bmRrZGhobnVnaW5hZWtuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA3MTYxMTgsImV4cCI6MjA2NjI5MjExOH0.-3qFN_HEZx7i1rGhpaZg9edxoSRDgUkPzDYfrPNiIqI"

if (!supabaseUrl) {
  throw new Error("Missing supabaseUrl configuration")
}
if (!supabaseAnonKey) {
  throw new Error("Missing supabaseAnonKey configuration")
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
