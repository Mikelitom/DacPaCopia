import { adminSupabase } from "../../db-utils"

// Esta es una API route sencilla para eliminar usuarios
export default async function handler(req, res) {
  if (req.method !== "DELETE") {
    return res.status(405).json({ error: "Método no permitido" })
  }

  const { userId } = req.body

  if (!userId) {
    return res.status(400).json({ error: "userId es requerido" })
  }

  try {
    // Eliminar usuario de autenticación
    const authResult = await adminSupabase.auth.admin.deleteUser(userId)

    if (authResult.error) {
      console.error("Error eliminando usuario de auth:", authResult.error)
    }

    return res.status(200).json({ success: true })
  } catch (error) {
    console.error("Error en delete-user:", error)
    return res.status(500).json({ error: error.message })
  }
}
