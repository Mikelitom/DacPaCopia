"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/app/components/ui/card"
import { Button } from "@/app/components/ui/button"
import { Input } from "@/app/components/ui/input"
import { Label } from "@/app/components/ui/label"
import { useToast } from "@/app/components/ui/use-toast"
import { supabase } from "@/app/lib/supabaseClient"
import { useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/app/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/app/components/ui/dropdown-menu"
import { ChevronDown, Edit, Eye, EyeOff, Key, Save, Trash, UserPlus } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/dialog"
import { Badge } from "@/app/components/ui/badge"
import { RemoveScroll } from "react-remove-scroll"


// Importar las Server Actions al inicio del archivo
import { resetUserPassword } from "@/app/perfil-actions/auth-actions"

type Usuario = {
  id_usuario: string
  correo: string
  nombre_completo: string
  rol: string
  telefono: string
  departamento: string
}

type AdminUser = {
  id_usuario: string
  correo: string
  nombre_completo: string
  rol: string
  telefono: string
  departamento: string
  estado: string
}

export default function PerfilPage() {
  const { toast } = useToast()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [usuario, setUsuario] = useState<Usuario | null>(null)
  const [formData, setFormData] = useState<Partial<Usuario>>({})
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([])
  const [isAddingAdmin, setIsAddingAdmin] = useState(false)
  const [isEditingAdmin, setIsEditingAdmin] = useState(false)
  const [resetPasswordAdmin, setResetPasswordAdmin] = useState<AdminUser | null>(null)
  const [isResettingPassword, setIsResettingPassword] = useState(false)
  const [newPassword, setNewPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [currentAdmin, setCurrentAdmin] = useState<AdminUser | null>(null)
  const [newAdmin, setNewAdmin] = useState({
    nombre_completo: "",
    correo: "",
    rol: "admin",
    telefono: "",
    departamento: "",
    estado: "Activo",
  })

  // Obtener datos del usuario actual y lista de administradores
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)

        // Obtener sesión actual
        const {
          data: { user },
        } = await supabase.auth.getUser()
        if (!user) throw new Error("No autenticado")

        // Datos del usuario actual
        const { data: usuarioData } = await supabase.from("Usuario").select("*").eq("correo", user.email).single()

        setUsuario({
          id_usuario: user.id,
          correo: usuarioData?.correo || user.email || "",
          nombre_completo: usuarioData?.nombre_completo || "",
          rol: usuarioData?.rol || "",
          telefono: usuarioData?.telefono || "",
          departamento: usuarioData?.departamento || "",
        })

        setFormData({
          nombre_completo: usuarioData?.nombre_completo || "",
          correo: usuarioData?.correo || user.email || "",
          telefono: usuarioData?.telefono || "",
          departamento: usuarioData?.departamento || "",
        })

        // Lista de administradores
        const { data: admins } = await supabase.from("Usuario").select("*").or("rol.eq.admin")

        setAdminUsers(
          admins?.map((admin) => ({
            ...admin,
            estado: "Activo",
          })) || [],
        )
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        })
        router.push("/login")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [router, toast])

  // Reemplazar la función handleResetPassword con esta nueva versión
  const handleResetPassword = async () => {
    if (!resetPasswordAdmin || !newPassword) return

    try {
      setIsResettingPassword(true)

      // Validar que la contraseña cumpla con los requisitos mínimos
      if (newPassword.length < 8) {
        throw new Error("La contraseña debe tener al menos 8 caracteres")
      }

      // Llamar a la Server Action para actualizar la contraseña
      const result = await resetUserPassword(resetPasswordAdmin.id_usuario, newPassword)

      if (!result.success) {
        throw new Error(result.error || "Error al restablecer la contraseña")
      }

      toast({
        title: "Contraseña actualizada",
        description: "La contraseña se ha restablecido correctamente",
      })

      setResetPasswordAdmin(null)
      setNewPassword("")
      setShowPassword(false)
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "No se pudo restablecer la contraseña",
        variant: "destructive",
      })
    } finally {
      setIsResettingPassword(false)
    }
  }

  // Manejadores para el perfil del usuario
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSave = async () => {
    if (!usuario) return

    try {
      setLoading(true)

      // Verificar si el correo ha cambiado
      const emailChanged = formData.correo && formData.correo !== usuario.correo

      // Si el correo cambió, actualizar en Auth
      if (emailChanged) {
        const { error: authError } = await supabase.auth.admin.updateUserById(usuario.id_usuario, {
          email: formData.correo,
        })

        if (authError) throw authError
      }

      // Actualizar en la tabla Usuario
      const { error } = await supabase.from("Usuario").update(formData).eq("id_usuario", usuario.id_usuario)

      if (error) throw error

      // Actualizar el estado local
      setUsuario((prev) => (prev ? { ...prev, ...formData } : null))
      toast({ title: "Perfil actualizado" })
      setIsEditing(false)
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Manejadores para administradores
  const handleNewAdminChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setNewAdmin((prev) => ({ ...prev, [name]: value }))
  }

  // Reemplazar la función handleAddAdmin actual con esta versión mejorada
  const handleAddAdmin = async () => {
    try {
      setLoading(true)

      // Validar que el correo no esté vacío
      if (!newAdmin.correo || !newAdmin.correo.includes("@")) {
        throw new Error("Por favor ingrese un correo electrónico válido")
      }

      // Validar que el nombre no esté vacío
      if (!newAdmin.nombre_completo) {
        throw new Error("Por favor ingrese el nombre completo")
      }

      // Usar contraseña predeterminada "123456" para todos los administradores
      const defaultPassword = "123456"

      // Verificar si el correo ya existe en la tabla Usuario
      const { data: existingUser } = await supabase
        .from("Usuario")
        .select("correo")
        .eq("correo", newAdmin.correo)
        .single()

      if (existingUser) {
        throw new Error("Este correo electrónico ya está registrado")
      }

      // 1. Crear usuario en auth con la contraseña predeterminada
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: newAdmin.correo,
        password: defaultPassword,
        options: {
          emailRedirectTo: window.location.origin + "/login",
        },
      })

      if (authError) {
        console.error("Error de autenticación:", authError)
        throw new Error(`Error al crear la cuenta: ${authError.message}`)
      }

      if (!authData.user) {
        throw new Error("No se pudo crear el usuario en el sistema de autenticación")
      }

      // Crear objeto con los datos para la tabla Usuario
      const nuevoUsuario = {
        nombre_completo: newAdmin.nombre_completo,
        correo: newAdmin.correo,
        rol: newAdmin.rol,
        telefono: newAdmin.telefono,
        departamento: newAdmin.departamento,
        estado: newAdmin.estado,
        create_at: new Date().toISOString(), // Fecha actual automática
      }

      console.log("Datos a insertar en Usuario:", nuevoUsuario)

      // 2. Crear registro en tabla Usuario
      const { error: dbError } = await supabase.from("Usuario").insert(nuevoUsuario)

      if (dbError) {
        // Si hay error al insertar en la base de datos, intentar eliminar el usuario de auth
        console.error("Error al insertar en la tabla Usuario:", dbError)
        await supabase.auth.admin.deleteUser(authData.user.id)
        throw new Error(`Error al guardar los datos: ${dbError.message}`)
      }

      // Mostrar mensaje de éxito con la contraseña predeterminada
      toast({
        title: "Administrador agregado correctamente",
        description: `Contraseña predeterminada: ${defaultPassword}`,
        duration: 5000,
      })

      setIsAddingAdmin(false)
      setNewAdmin({
        nombre_completo: "",
        correo: "",
        rol: "admin",
        telefono: "",
        departamento: "",
        estado: "Activo",
      })

      // Refrescar lista
      const { data: admins } = await supabase.from("Usuario").select("*").or("rol.eq.admin")

      setAdminUsers(
        admins?.map((admin) => ({
          ...admin,
          estado: admin.estado || "Activo",
        })) || [],
      )
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "No se pudo agregar el administrador",
        variant: "destructive",
      })
      console.error("Error completo:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleEditAdmin = (admin: AdminUser) => {
    setCurrentAdmin(admin)
    setIsEditingAdmin(true)
  }

  const handleUpdateAdmin = async () => {
    if (!currentAdmin) return

    try {
      setLoading(true)

      // Verificar si el correo ha cambiado
      const { data: oldUserData } = await supabase
        .from("Usuario")
        .select("correo")
        .eq("id_usuario", currentAdmin.id_usuario)
        .single()

      const emailChanged = oldUserData && oldUserData.correo !== currentAdmin.correo

      // 1. Si el correo cambió, actualizar en Auth
      if (emailChanged) {
        const { error: authError } = await supabase.auth.admin.updateUserById(currentAdmin.id_usuario, {
          email: currentAdmin.correo,
        })

        if (authError) throw authError
      }

      // 2. Actualizar en la tabla Usuario
      const { error } = await supabase.from("Usuario").update(currentAdmin).eq("id_usuario", currentAdmin.id_usuario)

      if (error) throw error

      toast({ title: "✅ Cambios guardados" })

      // Actualiza la lista de administradores
      const { data: admins } = await supabase.from("Usuario").select("*").or("rol.eq.admin")

      setAdminUsers(
        admins?.map((admin) => ({
          ...admin,
          estado: admin.estado || "Activo",
        })) || [],
      )


      // Limpia el estado del administrador actual con un pequeño retraso
      setTimeout(() => setCurrentAdmin(null), 100)
    } catch (error: any) {
      toast({
        title: "❌ Error",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Reemplazar la función handleDeleteAdmin con esta nueva versión
  const handleDeleteAdmin = async (id: string) => {
    try {
      setLoading(true)

      // 1. Eliminar de la tabla Usuario primero
      const { error: dbError } = await supabase.from("Usuario").delete().eq("id_usuario", id)

      if (dbError) throw dbError

      // 2. Llamar al endpoint API para eliminar de autenticación
      // Esto usa credenciales de servicio en el servidor
      const response = await fetch("/api/delete-user", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: id }),
      })

      // Si la respuesta no es exitosa, loguear pero continuar
      if (!response.ok) {
        console.error("Error al eliminar usuario de autenticación")
      }

      toast({ title: "Administrador eliminado correctamente" })

      // Refrescar lista
      setAdminUsers((prev) => prev.filter((admin) => admin.id_usuario !== id))
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
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

      <Tabs defaultValue="userActual">
        <TabsList>
          <TabsTrigger value="userActual">Información personal</TabsTrigger>
          <TabsTrigger value="listaUsers">Administradores</TabsTrigger>
        </TabsList>

        {/* Pestaña de información personal */}
        <TabsContent value="userActual" className="mt-4">
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
                          value={formData.nombre_completo || ""}
                          onChange={handleChange}
                        />
                      ) : (
                        <div className="p-2 border rounded-md">{usuario.nombre_completo}</div>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Correo electrónico</Label>
                      {isEditing ? (
                        <Input
                          id="email"
                          name="correo"
                          value={formData.correo || ""}
                          onChange={handleChange}
                          type="email"
                        />
                      ) : (
                        <div className="p-2 border rounded-md">{usuario.correo}</div>
                      )}
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
                          value={formData.departamento || ""}
                          onChange={handleChange}
                        />
                      ) : (
                        <div className="p-2 border rounded-md">{usuario.departamento}</div>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="telefono">Teléfono</Label>
                      {isEditing ? (
                        <Input id="telefono" name="telefono" value={formData.telefono || ""} onChange={handleChange} />
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
                        correo: usuario.correo,
                        telefono: usuario.telefono,
                        departamento: usuario.departamento,
                      })
                    }}
                    disabled={loading}
                  >
                    Cancelar
                  </Button>
                  <Button onClick={handleSave} className="bg-pink-600 hover:bg-pink-700" disabled={loading}>
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
                <Button onClick={() => setIsEditing(true)} className="bg-pink-600 hover:bg-pink-700">
                  <Edit className="mr-2 h-4 w-4" />
                  Editar perfil
                </Button>
              )}
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Pestaña de administradores */}
        <TabsContent value="listaUsers" className="mt-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Administradores del Sistema</CardTitle>
                <CardDescription>Lista de usuarios con acceso administrativo</CardDescription>
              </div>
              <Button onClick={() => setIsAddingAdmin(true)} className="bg-pink-300 hover:bg-pink-400">
                <UserPlus className="mr-2 h-4 w-4" />
                Agregar Administrador
              </Button>
            </CardHeader>
            <CardContent>
              {/* Tabla de administradores */}
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Correo</TableHead>
                    <TableHead>Rol</TableHead>
                    <TableHead>Departamento</TableHead>
                    <TableHead>Teléfono</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {adminUsers.map((admin) => (
                    <TableRow key={admin.id_usuario}>
                      <TableCell className="font-medium">{admin.nombre_completo}</TableCell>
                      <TableCell>{admin.correo}</TableCell>
                      <TableCell>{admin.rol}</TableCell>
                      <TableCell>{admin.departamento}</TableCell>
                      <TableCell>{admin.telefono}</TableCell>
                      <TableCell>
                        <Badge variant={admin.estado === "Activo" ? "default" : "secondary"}>{admin.estado}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <ChevronDown className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-neutral-50">
                            <DropdownMenuItem className="flex items-center" onClick={() => handleEditAdmin(admin)}>
                              <Edit className="mr-2 h-4 w-4" />
                              <span>Editar</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="flex items-center"
                              onClick={() => {
                                setResetPasswordAdmin(admin)
                                setNewPassword("") // Resetear campo de contraseña
                              }}
                            >
                              <Key className="mr-2 h-4 w-4" />
                              <span>Restablecer contraseña</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="flex items-center text-destructive"
                              onClick={() => handleDeleteAdmin(admin.id_usuario)}
                            >
                              <Trash className="mr-2 h-4 w-4" />
                              <span>Eliminar</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Diálogo para restablecer contraseña */}
      <Dialog
        open={!!resetPasswordAdmin}
        onOpenChange={(open) => {
          if (!open) {
            // Primero actualiza el estado para cerrar el diálogo
            setResetPasswordAdmin(null)
            // Luego limpia otros estados relacionados
            setNewPassword("")
            setShowPassword(false)
          }
        }}
      >
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle>Restablecer Contraseña</DialogTitle>
            <DialogDescription>
              Establece una nueva contraseña para {resetPasswordAdmin?.nombre_completo}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="newPassword">Nueva Contraseña</Label>
              <div className="relative">
                <Input
                  id="newPassword"
                  type={showPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Ingresa la nueva contraseña"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            <div className="text-sm text-muted-foreground">La contraseña debe tener al menos 8 caracteres.</div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                // Primero actualiza el estado para cerrar el diálogo
                setResetPasswordAdmin(null)
                // Luego limpia otros estados relacionados
                setNewPassword("")
                setShowPassword(false)
              }}
            >
              Cancelar
            </Button>
            <Button
              onClick={async () => {
                await handleResetPassword()
                // No es necesario hacer nada más aquí, ya que handleResetPassword ya maneja el cierre
              }}
              disabled={isResettingPassword || newPassword.length < 8}
              className="bg-pink-600 hover:bg-pink-700"
            >
              {isResettingPassword ? "Actualizando..." : "Confirmar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Diálogo para agregar administrador */}
      <Dialog open={isAddingAdmin} onOpenChange={setIsAddingAdmin}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle>Agregar Nuevo Administrador</DialogTitle>
            <DialogDescription>Complete todos los campos para registrar un nuevo administrador</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="nombre">Nombre completo</Label>
              <Input
                id="nombre"
                name="nombre_completo"
                value={newAdmin.nombre_completo}
                onChange={handleNewAdminChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="correo">Correo electrónico</Label>
              <Input id="correo" name="correo" type="email" value={newAdmin.correo} onChange={handleNewAdminChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="rol">Rol</Label>
              <select
                id="rol"
                name="rol"
                value={newAdmin.rol}
                onChange={(e) => setNewAdmin({ ...newAdmin, rol: e.target.value })}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="admin">Administrador</option>
                <option value="padre">Padre</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="departamento">Departamento</Label>
              <Input
                id="departamento"
                name="departamento"
                value={newAdmin.departamento}
                onChange={handleNewAdminChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="telefono">Teléfono</Label>
              <Input id="telefono" name="telefono" value={newAdmin.telefono} onChange={handleNewAdminChange} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddingAdmin(false)}>
              Cancelar
            </Button>
            <Button onClick={handleAddAdmin} className="bg-pink-300 hover:bg-pink-400" disabled={loading}>
              {loading ? "Guardando..." : "Guardar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Diálogo para editar administrador */}
      {isEditingAdmin && (
        <Dialog
          open={true}
          onOpenChange={(open) => {
            if (!open) {
              setIsEditingAdmin(false)
              setTimeout(() => setCurrentAdmin(null), 100)
            }
          }}
        >
          <DialogContent className="bg-white">
            <RemoveScroll forwardProps={true}>
              <div>
                <DialogHeader>
                  <DialogTitle>Editar Administrador</DialogTitle>
                  <DialogDescription>Modifique los campos que desee actualizar</DialogDescription>
                </DialogHeader>

                {currentAdmin && (
                  <>
                    <div className="grid gap-4 py-4">
                              <div className="space-y-2">
                                <Label htmlFor="editNombre">Nombre completo</Label>
                                <Input
                                  id="editNombre"
                                  value={currentAdmin.nombre_completo}
                                  onChange={(e) =>
                                    setCurrentAdmin({ ...currentAdmin, nombre_completo: e.target.value })
                                  }
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="editCorreo">Correo electrónico</Label>
                                <Input
                                  id="editCorreo"
                                  type="email"
                                  value={currentAdmin.correo}
                                  onChange={(e) =>
                                    setCurrentAdmin({ ...currentAdmin, correo: e.target.value })
                                  }
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="editRol">Rol</Label>
                                <select
                                  id="editRol"
                                  value={currentAdmin.rol}
                                  onChange={(e) =>
                                    setCurrentAdmin({ ...currentAdmin, rol: e.target.value })
                                  }
                                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                                >
                                  <option value="admin">Administrador</option>
                                  <option value="padre">Padre</option>
                                </select>
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="editDepartamento">Departamento</Label>
                                <Input
                                  id="editDepartamento"
                                  value={currentAdmin.departamento}
                                  onChange={(e) =>
                                    setCurrentAdmin({ ...currentAdmin, departamento: e.target.value })
                                  }
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="editTelefono">Teléfono</Label>
                                <Input
                                  id="editTelefono"
                                  value={currentAdmin.telefono}
                                  onChange={(e) =>
                                    setCurrentAdmin({ ...currentAdmin, telefono: e.target.value })
                                  }
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="editEstado">Estado</Label>
                                <select
                                  id="editEstado"
                                  value={currentAdmin.estado}
                                  onChange={(e) =>
                                    setCurrentAdmin({ ...currentAdmin, estado: e.target.value })
                                  }
                                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                                >
                                  <option value="Activo">Activo</option>
                                  <option value="Inactivo">Inactivo</option>
                                </select>
                              </div>
                            </div>

                    <DialogFooter>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setIsEditingAdmin(false)
                          setTimeout(() => setCurrentAdmin(null), 100)
                        }}
                      >
                        Cancelar
                      </Button>
                      <Button
                        onClick={async () => {
                          await handleUpdateAdmin()
                          setIsEditingAdmin(false)
                          setTimeout(() => setCurrentAdmin(null), 100)
                        }}
                        className="bg-pink-300 hover:bg-pink-400"
                        disabled={loading}
                      >
                        {loading ? "Guardando..." : "Guardar cambios"}
                      </Button>
                    </DialogFooter>
                  </>
                )}
              </div>
            </RemoveScroll>
          </DialogContent>
        </Dialog>
      )}



    </div>
  )
}
