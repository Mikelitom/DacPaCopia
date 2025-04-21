"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Package, Plus, Search, ShoppingBag } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card"
import { Button } from "@/app/components/ui/button"
import { Input } from "@/app/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/app/components/ui/table"
import { Badge } from "@/app/components/ui/badge"
import RowActionsDropdownProps from "@/app/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select"

export default function articulosPage(){
    const router = useRouter()
    const [valorBusqueda, setBusqueda] = useState("")
    const [filtroCategoria, setFiltro] = useState("todos")


    const inventarioPrueba = [
        {
            id: 1,
            nombre: "Uniforme de Diario Niña",
            categoria: "Uniformes",
            stock: 25,
            stockMin: 10,
            precio: 950,
            ultimaMod: "2025-11-24",
        },
        {
            id: 2,
            nombre: "Uniforme de Diario Niña",
            categoria: "Uniformes",
            stock: 25,
            stockMin: 10,
            precio: 950,
            ultimaMod: "2025-11-24",
        },
        {
            id: 3,
            nombre: "Uniforme de Diario Niña",
            categoria: "Uniformes",
            stock: 25,
            stockMin: 10,
            precio: 950,
            ultimaMod: "2025-11-24",
        },
        {
            id: 4,
            nombre: "Uniforme de Diario Niña",
            categoria: "Uniformes",
            stock: 25,
            stockMin: 10,
            precio: 950,
            ultimaMod: "2025-11-24",
        },

    ]

    //constante para filtrar el inventario
    const filtro = inventarioPrueba.filter(
        (item) =>
        (filtroCategoria === "todos" || item.categoria === filtroCategoria) &&
        item.nombre.toLowerCase().includes(valorBusqueda.toLowerCase()),
    )

    const eliminarArticulo = (id: number) => {
        console.log(`Eliminar producto con id: ${id}`);
      };

    const editarArticulo = (id: number) => {
        console.log(`Editar producto con id: ${id}`);
      };
      

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold mb-6">Inventario</h1>
                <div className="flex gap-2">
                    <Button onClick={() => router.push("/inventario/articulos/nuevo")}>
                        <Plus className="mr-2 h-4 w-4" /> Agregar Articulo
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total de Artículos</CardTitle>
                    <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{inventarioPrueba.length}</div>
                </CardContent>
                </Card>
                <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Valor del Inventario</CardTitle>
                    <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">
                    ${inventarioPrueba.reduce((total, item) => total + item.precio * item.stock, 0).toLocaleString()}
                    </div>
                </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Artículos</CardTitle>
                        <CardDescription>Inventario de uniformes y paquetes de libros</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col md:flex-row gap-4 mb-6">
                        <div className="relative flex-1">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Buscar un artículo..."
                                    className="pl-8"
                                    value={valorBusqueda}
                                    onChange={(e) => setBusqueda(e.target.value)}
                                />
                        </div>
                            <Select value={filtroCategoria} onValueChange={setFiltro}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Categoría" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="todos">Todas las categorías</SelectItem>
                                    <SelectItem value="Uniformes">Uniformes</SelectItem>
                                    <SelectItem value="Libros">Libros</SelectItem>
                                </SelectContent>
                            </Select>
                    </div>

                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Nombre</TableHead>
                                    <TableHead>Categoría</TableHead>
                                    <TableHead>Stock</TableHead>
                                    <TableHead>Precio</TableHead>
                                    <TableHead>Última Actualización</TableHead>
                                    <TableHead className="text-right">Acciones</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filtro.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell className="font-medium">{item.nombre}</TableCell>
                                    <TableCell>{item.categoria}</TableCell>
                                    <TableCell>
                                        {item.stock < item.stockMin ? (
                                            <Badge variant="destructive">{item.stock} (Bajo)</Badge>
                                        ) : (
                                            <Badge variant="outline">{item.stock}</Badge>
                                        )}
                                    </TableCell>
                                    <TableCell>${item.precio}</TableCell>
                                    <TableCell>{new Date(item.ultimaMod).toLocaleDateString()}</TableCell>
                                    <TableCell className="text-right">
                                        <RowActionsDropdownProps
                                            onEdit={() => editarArticulo(item.id)}
                                            onDelete={() => eliminarArticulo(item.id)}
                                        />
                                    </TableCell>
                                </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

        </div>
        
    )
}