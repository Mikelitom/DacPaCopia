"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { ChevronDown, Package, Plus, Search, Trash } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/app/components/ui/card"
import { Button } from "@/app/components/ui/button"
import { Input } from "@/app/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/app/components/ui/table"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/app/components/ui/dialog"
import { Label } from "@/app/components/ui/label"
import { Textarea } from "@/app/components/ui/textarea"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/app/components/ui/dropdown-menu"
import { useMermas } from "./useMermas"

export default function MermasPage() {
  const router = useRouter()
  const {
    searchTerm,
    setSearchTerm,
    loading,
    mermas,
    cargando,
    articulos,
    usuarios,
    formData,
    filtroMermas,
    handleChange,
    handleSubmit,
    handleDelete,
    valorTotal,
    resetForm
  } = useMermas()

  return (
    <div className="p-6 space-y-6">
      {/* Encabezado y botón de nueva merma */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Registro de Mermas</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-pink-300 hover:bg-pink-400">
              <Plus className="mr-2 h-4 w-4" /> Nueva Merma
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] bg-stone-50">
            <DialogHeader>
              <DialogTitle>Registrar Nueva Merma</DialogTitle>
              <DialogDescription>Complete los datos para registrar una merma en el inventario.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="id_articulo">
                    Artículo <span className="text-destructive">*</span>
                  </Label>
                  <select
                    id="id_articulo"
                    name="id_articulo"
                    value={formData.id_articulo}
                    onChange={handleChange}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    required
                  >
                    <option value="">Seleccione un artículo</option>
                    {articulos.map(articulo => (
                      <option key={articulo.id_articulo} value={articulo.id_articulo}>
                        {articulo.nombre} (ID: {articulo.id_articulo})
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="cantidad">
                      Cantidad <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="cantidad"
                      name="cantidad"
                      type="number"
                      min="1"
                      value={formData.cantidad}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="id_usuario">
                      Responsable <span className="text-destructive">*</span>
                    </Label>
                    <select
                      id="id_usuario"
                      name="id_usuario"
                      value={formData.id_usuario}
                      onChange={handleChange}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      required
                    >
                      <option value="">Seleccione un responsable</option>
                      {usuarios.map(usuario => (
                        <option key={usuario.id_usuario} value={usuario.id_usuario}>
                          {usuario.nombre_completo} (ID: {usuario.id_usuario})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="motivo">Motivo</Label>
                  <Textarea
                    id="motivo"
                    name="motivo"
                    value={formData.motivo}
                    onChange={handleChange}
                    placeholder="Detalle el motivo de la merma..."
                    rows={3}
                  />
                </div>
              </div>
              
              <DialogFooter>
                <DialogClose
                    className="text-sm px-4 py-2 rounded-md border" // Estilo similar a tu Button
                    onClick={resetForm}
                >
                    Cancelar
                </DialogClose>
                <Button type="submit" disabled={loading} className="bg-pink-300 hover:bg-pink-400">
                  {loading ? "Registrando..." : "Registrar Merma"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Tarjetas de resumen */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Mermas</CardTitle>
            <Package className="h-4 w-4 text-pink-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mermas.length}</div>
            <p className="text-xs text-muted-foreground">En el último mes</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor Total</CardTitle>
            <Trash className="h-4 w-4 text-pink-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${valorTotal.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Pérdida acumulada</p>
          </CardContent>
        </Card>
      </div>

      {/* Búsqueda y tabla */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por ID, artículo o responsable..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Historial de Mermas</CardTitle>
          <CardDescription>
            Mostrando {filtroMermas.length} de {mermas.length} registros
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Artículo</TableHead>
                <TableHead>Cantidad</TableHead>
                <TableHead>Responsable</TableHead>
                <TableHead>Motivo</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cargando ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    Cargando mermas...
                  </TableCell>
                </TableRow>
              ) : filtroMermas.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    No se encontraron mermas
                  </TableCell>
                </TableRow>
              ) : (
                filtroMermas.map((merma) => (
                  <TableRow key={merma.id_merma}>
                    <TableCell className="font-medium">{merma.id_merma}</TableCell>
                    <TableCell>{new Date(merma.fecha).toLocaleDateString()}</TableCell>
                    <TableCell>
                      {merma.Articulo?.nombre || `ID: ${merma.id_articulo}`}
                    </TableCell>
                    <TableCell>{merma.cantidad}</TableCell>
                    <TableCell>
                      {merma.Usuario?.nombre || `ID: ${merma.id_usuario}`}
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate">
                      {merma.motivo || "Sin motivo"}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <ChevronDown className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem 
                            onClick={() => handleDelete(merma.id_merma)}
                            className="text-red-600"
                          >
                            Eliminar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}