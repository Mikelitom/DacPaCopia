import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://xakntjlnhxwpmiwzrala.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhha250amxuaHh3cG1pd3pyYWxhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUwMjUzNzAsImV4cCI6MjA2MDYwMTM3MH0.ofpudYh-PLiRbVsSTXobGHpZSmNlorEbPB4raXuLJIc";

export const supabase = createClient(supabaseUrl, supabaseKey);
