"use client"

import * as React from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/app/components/ui/card"
import { Button } from "@/app/components/ui/button"
import { Input } from "@/app/components/ui/input"
import { Label } from "@/app/components/ui/label"
import { Edit, Save } from "lucide-react"
import { usePerfilUsuario } from "./usePerfilUsuario"

export default function PerfilPage() {
  const {
    loading,
    isEditing,
    usuario,
    formData,
    handleChange,
    handleSave,
    handleCancel,
    toggleEditing
  } = usePerfilUsuario();

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
                onClick={handleCancel}
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
              onClick={toggleEditing}
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