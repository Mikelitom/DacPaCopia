"use client"

import type React from "react"

import { useState } from "react"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { ChevronDown, Package, Plus, Search, Trash } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/app/components/ui/card"
import { Button } from "@/app/components/ui/button"
import { Input } from "@/app/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/app/components/ui/table"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/app/components/ui/dialog"
import { Label } from "@/app/components/ui/label"
import { Textarea } from "@/app/components/ui/textarea"
import { useToast } from "@/app/components/ui/use-toast"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/app/components/ui/dropdown-menu"
import { supabase } from "@/app/lib/supabaseClient"; 


export default function MermasPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState("todos")
  const [selectedReason, setSelectedReason] = useState("todos")
  const [loading, setLoading] = useState(false)
  const [mermaSeleccionada, setMermaSeleccionada] = useState<string | null>(null);
  const [merma, setMerma] = useState<Mermas[]>([]);
  const [cargando, setCargando] = useState<boolean>(true);


  type Mermas = {
    id_merma: number;
    id_articulo: number;
    cantidad: number;
    motivo: string;
    fecha: Date;
    id_usuario: number;
  };



  useEffect(() => {
          const fetchMermas = async () => {
            setCargando(true);
            const { data, error } = await supabase
              .from("Merma") 
              .select("*");
        
            if (error) {
              console.error("Error al cargar los articulos:", error.message);
            } else {
              setMerma(data as Mermas[]); 
            }
            setCargando(false);
          };
        
          fetchMermas();

        }, []);


  // Filtrar mermas 
  const filtroMermas = merma.filter(
    (item) =>
    item.id_articulo.toLowerCase().includes(searchTerm.toLowerCase()),
  )



  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setMerma((prev) => ({ ...prev, [name]: value }))
  }

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setMerma((prev) => ({ ...prev, [name]: Number.parseInt(value) || 0 }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Simulación de envío de datos
    await new Promise((resolve) => setTimeout(resolve, 1500))

    toast({
      title: "Merma registrada",
      description: "La merma ha sido registrada correctamente en el sistema.",
    })

    setLoading(false)
    setFormData({
      articulo: "",
      cantidad: 1,
      motivo: "",
      id_usuario: 1,
    })
  }

  const handleDelete = (id: number) => {
    toast({
      title: "Merma eliminada",
      description: `La merma ${id} ha sido eliminada correctamente.`,
    })
  }

  // Calcular el valor total de las mermas
  const valorTotal = filtroMermas.reduce((sum, merma) => sum + merma.id_usuario.precio_venta, 0)

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h1 className="text-3xl font-bold">Registro de Mermas</h1>
        </div>
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
                  <Label htmlFor="articulo">
                    Artículo <span className="text-destructive">*</span>
                  </Label>
                  <Input id="articulo" name="articulo" value={merma.id_articulo} onChange={handleChange} required /> 
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
                      onChange={handleNumberChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="id_usuario">
                      Responsable <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="id_usuario"
                      name="id_usuario"
                      value={formData.id_usuario}
                      onChange={handleChange}
                      required
                    />
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
                <DialogClose>
                  <Button variant="outline" type="button">
                    Cancelar
                  </Button>
                </DialogClose>
                <Button type="submit" disabled={loading} className="bg-pink-300 hover:bg-pink-400">
                  {loading ? "Registrando..." : "Registrar Merma"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Mermas</CardTitle>
            <Package className="h-4 w-4 text-pink-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{merma.length}</div>
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

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por artículo, responsable o ID..."
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
            Mostrando {filtroMermas.length} de {merma.length} registros
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">ID</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Artículo</TableHead>
                <TableHead>Cantidad</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Responsable</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtroMermas.map((merma) => (
                <TableRow key={merma.id_merma}>
                  <TableCell className="font-medium">{merma.id_merma}</TableCell>
                  <TableCell>{new Date(merma.fecha).toLocaleDateString()}</TableCell>
                  <TableCell>{merma.id_articulo.nombre}</TableCell>
                  <TableCell>{merma.cantidad}</TableCell>
                  <TableCell>${merma.id_articulo.precio_adquisicion}</TableCell>
                  <TableCell>{merma.id_usuario}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <ChevronDown className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <Dialog>
                          <DialogTrigger>
                            <DropdownMenuItem className="hover:bg-pink-200">Ver detalles</DropdownMenuItem>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[600px] bg-stone-50">
                            <DialogHeader>
                              <DialogTitle>Detalles de Merma</DialogTitle>
                              <DialogDescription>
                                Información completa de la merma {merma.id_merma}
                              </DialogDescription>
                            </DialogHeader>
                            
                            <div className="grid gap-4 py-4">
                              
                              <div>
                                <Label>Motivo:</Label>
                                <p className="font-medium">{merma.motivo}</p>
                              </div>

                            </div>
                          </DialogContent>
                        </Dialog>
                        <DropdownMenuItem className="hover:bg-pink-200">Editar registro</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDelete(merma.id_merma)} className="hover:bg-pink-200 text-red-600">
                          Eliminar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Página 1 de 1</span>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
