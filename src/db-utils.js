import { createClient } from "@supabase/supabase-js"

// Crear un cliente de Supabase con las credenciales completas para administración
export const adminSupabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "", // Asegúrate de tener esta variable de entorno configurada
)

// Esta función usa el cliente admin para eliminar un usuario
export async function deleteAuthUser(userId) {
  try {
    const { error } = await adminSupabase.auth.admin.deleteUser(userId)
    if (error) throw error
    return { success: true }
  } catch (error) {
    console.error("Error eliminando usuario de auth:", error)
    return { success: false, error }
  }
}
