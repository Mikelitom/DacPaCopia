"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ChevronDown, ChevronLeft, Download, Filter, Package, Plus, Search, Trash } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/app/components/ui/card"
import { Button } from "@/app/components/ui/button"
import { Input } from "@/app/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/app/components/ui/table"
import { Badge } from "@/app/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/app/components/ui/dialog"
import { Label } from "@/app/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select"
import { Textarea } from "@/app/components/ui/textarea"
import { useToast } from "@/app/components/ui/use-toast"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/app/components/ui/dropdown-menu"

export default function MermasPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState("todos")
  const [selectedReason, setSelectedReason] = useState("todos")
  const [loading, setLoading] = useState(false)

  // Datos de ejemplo para mermas
  const mermas = [
    {
      id: "M-001",
      fecha: "2023-09-05",
      articulo: "Uniforme Escolar - Talla 6",
      categoria: "Uniformes",
      cantidad: 2,
      motivo: "Defecto de fábrica",
      valor: 700,
      responsable: "Juan Pérez",
      notas: "Costuras defectuosas en las mangas",
    },
    {
      id: "M-002",
      fecha: "2023-09-02",
      articulo: "Libro Matemáticas 2° Grado",
      categoria: "Libros",
      cantidad: 1,
      motivo: "Daño por humedad",
      valor: 280,
      responsable: "María López",
      notas: "Daño por filtración de agua en almacén",
    },
    {
      id: "M-003",
      fecha: "2023-08-28",
      articulo: "Cuaderno Profesional Cuadro Chico",
      categoria: "Útiles",
      cantidad: 5,
      motivo: "Daño en almacén",
      valor: 225,
      responsable: "Carlos Rodríguez",
      notas: "Caída de estante que dañó los productos",
    },
    {
      id: "M-004",
      fecha: "2023-08-20",
      articulo: "Uniforme Deportivo - Talla 8",
      categoria: "Uniformes",
      cantidad: 1,
      motivo: "Defecto de fábrica",
      valor: 300,
      responsable: "Juan Pérez",
      notas: "Cierre defectuoso",
    },
    {
      id: "M-005",
      fecha: "2023-08-15",
      articulo: "Libro Español 1° Grado",
      categoria: "Libros",
      cantidad: 2,
      motivo: "Daño por manipulación",
      valor: 500,
      responsable: "Ana Martínez",
      notas: "Páginas rotas durante el desempaque",
    },
  ]

  // Datos de ejemplo para artículos en inventario
  const inventoryItems = [
    {
      id: 1,
      name: "Uniforme Escolar - Talla 6",
      category: "Uniformes",
      stock: 25,
      price: 350,
    },
    {
      id: 2,
      name: "Uniforme Escolar - Talla 8",
      category: "Uniformes",
      stock: 8,
      price: 350,
    },
    {
      id: 3,
      name: "Uniforme Deportivo - Talla 6",
      category: "Uniformes",
      stock: 15,
      price: 300,
    },
    {
      id: 4,
      name: "Uniforme Deportivo - Talla 8",
      category: "Uniformes",
      stock: 12,
      price: 300,
    },
    {
      id: 5,
      name: "Libro Matemáticas 1° Grado",
      category: "Libros",
      stock: 30,
      price: 250,
    },
    {
      id: 6,
      name: "Libro Español 1° Grado",
      category: "Libros",
      stock: 28,
      price: 250,
    },
    {
      id: 7,
      name: "Libro Ciencias 2° Grado",
      category: "Libros",
      stock: 20,
      price: 280,
    },
    {
      id: 8,
      name: "Cuaderno Profesional Cuadro Chico",
      category: "Útiles",
      stock: 50,
      price: 45,
    },
  ]

  // Obtener valores únicos para los filtros
  const uniqueCategories = Array.from(new Set(mermas.map((merma) => merma.categoria)))
  const uniqueReasons = Array.from(new Set(mermas.map((merma) => merma.motivo)))

  // Filtrar mermas según los criterios seleccionados
  const filteredMermas = mermas.filter((merma) => {
    const matchesSearch =
      merma.articulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      merma.responsable.toLowerCase().includes(searchTerm.toLowerCase()) ||
      merma.id.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesCategory = selectedCategory === "todos" || merma.categoria === selectedCategory
    const matchesReason = selectedReason === "todos" || merma.motivo === selectedReason

    return matchesSearch && matchesCategory && matchesReason
  })

  // Estado del formulario para nueva merma
  const [formData, setFormData] = useState({
    articulo: "",
    cantidad: 1,
    motivo: "Defecto de fábrica",
    responsable: "",
    notas: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: Number.parseInt(value) || 0 }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
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
      motivo: "Defecto de fábrica",
      responsable: "",
      notas: "",
    })
  }

  const handleDelete = (id: string) => {
    toast({
      title: "Merma eliminada",
      description: `La merma ${id} ha sido eliminada correctamente.`,
    })
  }

  // Calcular el valor total de las mermas
  const totalValue = filteredMermas.reduce((sum, merma) => sum + merma.valor, 0)

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h1 className="text-3xl font-bold">Registro de Mermas</h1>
        </div>
        <Dialog>
          <DialogTrigger>
            <Button className="bg-pink-300 hover:bg-pink-400">
              <Plus className="mr-2 h-4 w-4" /> Nueva Merma
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
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
                  <Select
                    name="articulo"
                    value={formData.articulo}
                    onValueChange={(value) => handleSelectChange("articulo", value)}
                    required
                  >
                    <SelectTrigger id="articulo">
                      <SelectValue placeholder="Seleccionar artículo" />
                    </SelectTrigger>
                    <SelectContent>
                      {inventoryItems.map((item) => (
                        <SelectItem key={item.id} value={item.name}>
                          {item.name} (Stock: {item.stock})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                    <Label htmlFor="motivo">
                      Motivo <span className="text-destructive">*</span>
                    </Label>
                    <Select
                      name="motivo"
                      value={formData.motivo}
                      onValueChange={(value) => handleSelectChange("motivo", value)}
                      required
                    >
                      <SelectTrigger id="motivo">
                        <SelectValue placeholder="Seleccionar motivo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Defecto de fábrica">Defecto de fábrica</SelectItem>
                        <SelectItem value="Daño por manipulación">Daño por manipulación</SelectItem>
                        <SelectItem value="Daño por humedad">Daño por humedad</SelectItem>
                        <SelectItem value="Daño en almacén">Daño en almacén</SelectItem>
                        <SelectItem value="Caducidad">Caducidad</SelectItem>
                        <SelectItem value="Pérdida">Pérdida</SelectItem>
                        <SelectItem value="Otro">Otro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="responsable">
                    Responsable <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="responsable"
                    name="responsable"
                    value={formData.responsable}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notas">Notas adicionales</Label>
                  <Textarea
                    id="notas"
                    name="notas"
                    value={formData.notas}
                    onChange={handleChange}
                    placeholder="Detalles adicionales sobre la merma"
                    rows={3}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" type="button">
                  Cancelar
                </Button>
                <Button type="submit" disabled={loading} className="bg-pink-600 hover:bg-pink-700">
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
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mermas.length}</div>
            <p className="text-xs text-muted-foreground">En el último mes</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor Total</CardTitle>
            <Trash className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalValue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Pérdida acumulada</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Motivo Principal</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold">Defecto de fábrica</div>
            <p className="text-xs text-muted-foreground">
              {mermas.filter((m) => m.motivo === "Defecto de fábrica").length} incidencias
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por artículo, responsable o ID..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline" onClick={() => setShowFilters(!showFilters)} className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          Filtros
          {showFilters ? <ChevronDown className="h-4 w-4 rotate-180" /> : <ChevronDown className="h-4 w-4" />}
        </Button>
      </div>

      {showFilters && (
        <Card className="bg-pink-50/50">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="filter-category">Categoría</Label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger id="filter-category">
                    <SelectValue placeholder="Filtrar por categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todas las categorías</SelectItem>
                    {uniqueCategories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="filter-reason">Motivo</Label>
                <Select value={selectedReason} onValueChange={setSelectedReason}>
                  <SelectTrigger id="filter-reason">
                    <SelectValue placeholder="Filtrar por motivo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos los motivos</SelectItem>
                    {uniqueReasons.map((reason) => (
                      <SelectItem key={reason} value={reason}>
                        {reason}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Historial de Mermas</CardTitle>
          <CardDescription>
            Mostrando {filteredMermas.length} de {mermas.length} registros
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">ID</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Artículo</TableHead>
                <TableHead>Categoría</TableHead>
                <TableHead>Cantidad</TableHead>
                <TableHead>Motivo</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Responsable</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMermas.map((merma) => (
                <TableRow key={merma.id}>
                  <TableCell className="font-medium">{merma.id}</TableCell>
                  <TableCell>{new Date(merma.fecha).toLocaleDateString()}</TableCell>
                  <TableCell>{merma.articulo}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-gray-100">
                      {merma.categoria}
                    </Badge>
                  </TableCell>
                  <TableCell>{merma.cantidad}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        merma.motivo === "Defecto de fábrica"
                          ? "bg-yellow-100 text-yellow-800"
                          : merma.motivo === "Daño en almacén"
                            ? "bg-red-100 text-red-800"
                            : "bg-blue-100 text-blue-800"
                      }
                    >
                      {merma.motivo}
                    </Badge>
                  </TableCell>
                  <TableCell>${merma.valor}</TableCell>
                  <TableCell>{merma.responsable}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        <Button variant="ghost" size="sm">
                          <ChevronDown className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem className="hover:bg-pink-200">Ver detalles</DropdownMenuItem>
                        <DropdownMenuItem className="hover:bg-pink-200">Editar registro</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDelete(merma.id)} className="hover:bg-pink-200 text-red-600">
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
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Exportar
          </Button>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Página 1 de 1</span>
          </div>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Análisis de Mermas</CardTitle>
          <CardDescription>Distribución de mermas por categoría y motivo</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium mb-4">Por Categoría</h3>
              <div className="space-y-4">
                {uniqueCategories.map((category) => {
                  const categoryMermas = mermas.filter((m) => m.categoria === category)
                  const categoryTotal = categoryMermas.reduce((sum, m) => sum + m.valor, 0)
                  const percentage = Math.round((categoryTotal / totalValue) * 100)

                  return (
                    <div key={category} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{category}</span>
                        <span className="text-sm text-muted-foreground">${categoryTotal}</span>
                      </div>
                      <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-pink-500 rounded-full" style={{ width: `${percentage}%` }}></div>
                      </div>
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>{categoryMermas.length} artículos</span>
                        <span>{percentage}%</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-4">Por Motivo</h3>
              <div className="space-y-4">
                {uniqueReasons.map((reason) => {
                  const reasonMermas = mermas.filter((m) => m.motivo === reason)
                  const reasonTotal = reasonMermas.reduce((sum, m) => sum + m.valor, 0)
                  const percentage = Math.round((reasonTotal / totalValue) * 100)

                  return (
                    <div key={reason} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{reason}</span>
                        <span className="text-sm text-muted-foreground">${reasonTotal}</span>
                      </div>
                      <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-pink-500 rounded-full" style={{ width: `${percentage}%` }}></div>
                      </div>
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>{reasonMermas.length} artículos</span>
                        <span>{percentage}%</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
