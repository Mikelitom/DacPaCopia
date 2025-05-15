"use client"

import { useState, useEffect } from "react"
import { useToast } from "@/app/components/ui/use-toast"
import { supabase } from "@/app/lib/supabaseclient"
import { useRouter } from "next/navigation"

export type Usuario = {
  id_usuario: string;
  correo: string;
  nombre_completo: string;
  rol: string;
  telefono: string;
  departamento: string;
};

export function usePerfilUsuario() {
  const { toast } = useToast()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [usuario, setUsuario] = useState<Usuario | null>(null)
  const [formData, setFormData] = useState<Partial<Usuario>>({})

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true)
        
        //Obtener sesión actual
        const { data: { user } } = await supabase.auth.getUser()
        
        if (!user) {
          throw new Error("No hay usuario autenticado")
        }

        const { data, error } = await supabase
          .from('Usuario') 
          .select('*')
          .eq('id', user.id)
          .single()

        if (error) throw error

        setUsuario({
          id_usuario: user.id,
          correo: user.email || '',
          nombre_completo: data?.nombre_completo || '',
          rol: data?.rol || '',
          telefono: data?.telefono || '',
          departamento: data?.departamento || '',
        })

        setFormData({
          nombre_completo: data?.nombre_completo || '',
          telefono: data?.telefono || '',
          departamento: data?.departamento || ''
        })

      } catch (error) {
        console.error("Error cargando perfil:", error)
        toast({
          title: "Error",
          description: "No se pudo cargar la información del perfil",
          variant: "destructive"
        })
        router.push('/login')
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [router, toast])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSave = async () => {
    if (!usuario) return

    try {
      setLoading(true)

      const { error } = await supabase
        .from('usuarios')
        .update({
          nombre_completo: formData.nombre_completo,
          telefono: formData.telefono,
          departamento: formData.departamento,
          updated_at: new Date().toISOString()
        })
        .eq('id', usuario.id_usuario)

      if (error) throw error

      setUsuario(prev => prev ? {
        ...prev,
        nombre_completo: formData.nombre_completo || '',
        telefono: formData.telefono || '',
        departamento: formData.departamento || '',
      } : null)

      toast({
        title: "✅ Perfil actualizado",
        description: "Tus cambios se han guardado correctamente",
      })
      setIsEditing(false)

    } catch (error) {
      console.error("Error guardando perfil:", error)
      toast({
        title: "❌ Error",
        description: "No se pudieron guardar los cambios",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setIsEditing(false)
    setFormData({
      nombre_completo: usuario?.nombre_completo || '',
      telefono: usuario?.telefono || '',
      departamento: usuario?.departamento || ''
    })
  }

  const toggleEditing = () => setIsEditing(true)

  return {
    loading,
    isEditing,
    usuario,
    formData,
    handleChange,
    handleSave,
    handleCancel,
    toggleEditing
  }
}