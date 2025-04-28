"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/app/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/app/components/ui/avatar"
import { Button } from "@/app/components/ui/button"
import { Input } from "@/app/components/ui/input"
import { Label } from "@/app/components/ui/label"
import { useToast } from "@/app/components/ui/use-toast"
import { Edit, Save } from "lucide-react"

export default function PerfilPage() {
    const { toast } = useToast()
    const [usuario, setUsuario] = useState({
      id_usuario: "",
      nombre_completo: "Joaquín López-Dóriga",
      correo: "lopezitodoriga@dac.mx",
      rol: "Administrador",
      telefono: "662-555-5555",
      departamento: "Dirección",
      image: "",
    })
  
    const [isEditing, setIsEditing] = useState(false)
    const [formData, setFormData] = useState({ ...usuario })
  
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target
      setFormData((prev) => ({ ...prev, [name]: value }))
    }
  
    const handleSave = () => {
      setUsuario(formData)
      setIsEditing(false)
      toast({
        title: "Perfil actualizado con exito!",
        description: "Los cambios han sido guardados correctamente.",
      })
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
                  <div className="flex flex-col items-center space-y-4">
                    <Avatar className="h-32 w-32">
                      <AvatarImage src={usuario.image} alt={usuario.nombre_completo} />
                      <AvatarFallback>{usuario.nombre_completo.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-pink-50 text-pink-700 border-pink-200 hover:bg-pink-100 hover:text-pink-800"
                    >
                      Cambiar foto
                    </Button>
                  </div>
  
                  <div className="md:col-span-2 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="nombre">Nombre completo</Label>
                        {isEditing ? (
                          <Input id="nombre" name="nombre" value={formData.nombre_completo} onChange={handleChange} />
                        ) : (
                          <div className="p-2 border rounded-md">{usuario.nombre_completo}</div>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="correo">Correo electrónico</Label>
                        {isEditing ? (
                          <Input id="correo" name="correo" type="email" value={formData.correo} onChange={handleChange} />
                        ) : (
                          <div className="p-2 border rounded-md">{usuario.correo}</div>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="rol">Rol</Label>
                        {isEditing ? (
                          <Input id="rol" name="rol" value={formData.rol} onChange={handleChange} />
                        ) : (
                          <div className="p-2 border rounded-md">{usuario.rol}</div>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="departamento">Departamento</Label>
                        {isEditing ? (
                          <Input id="departamento" name="departamento" value={formData.departamento} onChange={handleChange} />
                        ) : (
                          <div className="p-2 border rounded-md">{usuario.departamento}</div>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="telefono">Teléfono</Label>
                        {isEditing ? (
                          <Input id="telefono" name="telefono" value={formData.telefono} onChange={handleChange} />
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
                        setFormData({ ...usuario })
                      }}
                    >
                      Cancelar
                    </Button>
                    <Button onClick={handleSave} className="bg-pink-600 hover:bg-pink-700">
                      <Save className="mr-2 h-4 w-4" />
                      Guardar cambios
                    </Button>
                  </>
                ) : (
                  <Button onClick={() => setIsEditing(true)} className="bg-pink-300 hover:bg-pink-400">
                    <Edit className="mr-2 h-4 w-4" />
                    Editar perfil
                  </Button>
                )}
              </CardFooter>
            </Card>
      </div>
    )
  }