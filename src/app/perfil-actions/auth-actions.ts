"use server"

import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

// Acción del servidor para actualizar la contraseña de un usuario
export async function resetUserPassword(userId: string, newPassword: string) {
  try {
    // Crear cliente de Supabase con cookies del servidor
    const supabase = createServerComponentClient({ cookies })

    // Actualizar la contraseña del usuario
    const { error } = await supabase.auth.admin.updateUserById(userId, { password: newPassword })

    if (error) {
      console.error("Error al actualizar contraseña:", error)
      return { success: false, error: error.message }
    }

    // Actualizar el registro en la tabla Usuario 
    const { error: dbError } = await supabase
      .from("Usuario")
      .update({ ultimo_cambio_password: new Date().toISOString() })
      .eq("id_usuario", userId)

    if (dbError) {
      console.warn("Error al actualizar registro de cambio de contraseña:", dbError)

    }

    return { success: true }
  } catch (error: any) {
    console.error("Error inesperado:", error)
    return {
      success: false,
      error: error.message || "Error inesperado al restablecer la contraseña",
    }
  }
}

// Acción del servidor para eliminar un usuario
export async function deleteUser(userId: string) {
  try {
    // Crear cliente de Supabase con cookies del servidor
    const supabase = createServerComponentClient({ cookies })

    // 1. Eliminar de la tabla Usuario primero
    const { error: dbError } = await supabase.from("Usuario").delete().eq("id_usuario", userId)

    if (dbError) {
      return { success: false, error: dbError.message }
    }

    // 2. Eliminar usuario de auth
    const { error: authError } = await supabase.auth.admin.deleteUser(userId)

    if (authError) {
      console.error("Error al eliminar usuario de auth:", authError)
      return {
        success: true,
        warning: "Usuario eliminado de la base de datos pero puede haber un problema con la autenticación",
      }
    }

    return { success: true }
  } catch (error: any) {
    console.error("Error inesperado:", error)
    return {
      success: false,
      error: error.message || "Error inesperado al eliminar el usuario",
    }
  }
}
