import "react-native-url-polyfill/auto"

import { createClient } from "@supabase/supabase-js"

const SUPABASE_URL = "https://gdasvdepqifkqsfgypvc.supabase.co"
const SUPABASE_PUBLICK_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdkYXN2ZGVwcWlma3FzZmd5cHZjIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTU1ODQzNTYsImV4cCI6MjAxMTE2MDM1Nn0.OHJWyXhB9hEb7S4i4mkYFtuyozroPmOxt2UBl_0KE84"

// Create a single supabase client for interacting with your database
const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLICK_KEY)

export { supabase }
