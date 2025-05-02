"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/app/components/ui/card"
import { Button } from "@/app/components/ui/button"
import { Input } from "@/app/components/ui/input"
import { Label } from "@/app/components/ui/label"
import { useToast } from "@/app/components/ui/use-toast"
import { Edit, Save } from "lucide-react"
import { supabase } from "@/app/lib/supabaseClient"
import { useRouter } from "next/navigation"

type Usuario = {
  id_usuario: string;
  correo: string;
  nombre_completo: string;
  rol: string;
  telefono: string;
  departamento: string;
};

export default function PerfilPage() {
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
        updated_at: new Date().toISOString()
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

  if (loading || !usuario) {
    return (
      <div className="p-6 flex justify-center items-center h-[60vh]">
        <p>Cargando perfil...</p>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Perfil</h1>
      <Card>
        <CardHeader>
          <CardTitle>Información de Perfil</CardTitle>
          <CardDescription>Administra tu información personal y de contacto</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nombre_completo">Nombre completo</Label>
                  {isEditing ? (
                    <Input
                      id="nombre_completo"
                      name="nombre_completo"
                      value={formData.nombre_completo || ''}
                      onChange={handleChange}
                    />
                  ) : (
                    <div className="p-2 border rounded-md">{usuario.nombre_completo}</div>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Correo electrónico</Label>
                  <div className="p-2 border rounded-md">{usuario.correo}</div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rol">Rol</Label>
                  <div className="p-2 border rounded-md">{usuario.rol}</div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="departamento">Departamento</Label>
                  {isEditing ? (
                    <Input
                      id="departamento"
                      name="departamento"
                      value={formData.departamento || ''}
                      onChange={handleChange}
                    />
                  ) : (
                    <div className="p-2 border rounded-md">{usuario.departamento}</div>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="telefono">Teléfono</Label>
                  {isEditing ? (
                    <Input
                      id="telefono"
                      name="telefono"
                      value={formData.telefono || ''}
                      onChange={handleChange}
                    />
                  ) : (
                    <div className="p-2 border rounded-md">{usuario.telefono}</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-2">
          {isEditing ? (
            <>
              <Button
                variant="outline"
                onClick={() => {
                  setIsEditing(false)
                  setFormData({
                    nombre_completo: usuario.nombre_completo,
                    telefono: usuario.telefono,
                    departamento: usuario.departamento
                  })
                }}
                disabled={loading}
              >
                Cancelar
              </Button>
              <Button
                onClick={handleSave}
                className="bg-pink-600 hover:bg-pink-700"
                disabled={loading}
              >
                {loading ? (
                  "Guardando..."
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Guardar cambios
                  </>
                )}
              </Button>
            </>
          ) : (
            <Button
              onClick={() => setIsEditing(true)}
              className="bg-pink-300 hover:bg-pink-400"
            >
              <Edit className="mr-2 h-4 w-4" />
              Editar perfil
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}