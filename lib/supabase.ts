import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  "https://ygupjsnezqlxfoxxoddg.supabase.co",
  "YOUR_PUBLISHABLE_ANON_KEY"
);