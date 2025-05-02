// src/lib/supabaseClient.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

// Agrega logging para verificar la conexión
console.log("Configuración Supabase:", {
  url: supabaseUrl?.slice(0, 20) + "...", // Muestra solo parte del URL por seguridad
  key: supabaseKey?.slice(0, 10) + "..."  // Muestra solo parte de la clave
});

export const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
        persistSession: true, // ← Esto es crucial
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
});
