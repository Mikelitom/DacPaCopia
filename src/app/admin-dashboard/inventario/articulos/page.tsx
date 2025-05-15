"use client"

import { useState } from "react"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Package, Plus, Search, ShoppingBag, ChevronDown } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card"
import { Button } from "@/app/components/ui/button"
import { Input } from "@/app/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/app/components/ui/table"
import { Badge } from "@/app/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/app/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select"
import { supabase } from "@/app/lib/supabaseclient"; 
import { toast } from "@/app/components/ui/use-toast"


export default function articulosPage(){
    const router = useRouter()
    const [valorBusqueda, setBusqueda] = useState("")
    const [filtroCategoria, setFiltro] = useState("todos")
    const [inventario, setInventario] = useState<Articulos[]>([]);
    const [cargando, setCargando] = useState<boolean>(true);



    type Articulos = {
        id_articulo: number;
        nombre: string;
        categoria: string;
        sku: string;
        codigo_barras: string;
        imagen_url: string | null;
        proveedor: string;
        precio_venta: number;
        precio_adquisicion: number;
        stock_actual: number;
        stock_minimo: number;
        stock_inicial: number;
        ultima_actualizacion: string;
    };

    useEffect(() => {
        const fetchInventario = async () => {
          setCargando(true);
          try {
            const { data, error } = await supabase
              .from("Articulo")
              .select("*")
              .order('ultima_actualizacion', { ascending: false });
      
            if (error) throw error;
      
            setInventario(data || []);
          } catch (error) {
            console.error("Error al cargar artículos:", error);
          } finally {
            setCargando(false);
          }
        };
      
        fetchInventario();
      }, []);


    //constante para filtrar el inventario
    const filtro = inventario.filter(
        (item) =>
        (filtroCategoria === "todos" || item.categoria === filtroCategoria) &&
        item.nombre.toLowerCase().includes(valorBusqueda.toLowerCase()),
    )

    const eliminarArticulo = async (id: number) => {
        if (!confirm("¿Estás seguro de eliminar este artículo?")) return;
        try {
          const { error } = await supabase
            .from('Articulo')
            .delete()
            .eq('id_articulo', id);
      
          if (error) throw error;
      
          // Actualizar estado local
          setInventario(inventario.filter(articulo => articulo.id_articulo !== id));
          
          // Mostrar notificación
          toast({
            title: "Artículo eliminado",
            description: "El artículo ha sido eliminado correctamente.",
          });
      
        } catch (error) {
          console.error("Error al eliminar artículo:", error);
          toast({
            title: "Error",
            description: "No se pudo eliminar el artículo.",
            variant: "destructive"
          });
        }
      };

    const editarArticulo = (id: number) => {
        router.push(`/admin-dashboard/inventario/articulos/editar/${id}`);
    };
      

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Inventario</h1>
                <div className="flex gap-2">
                    <Button className="bg-pink-300 hover:bg-pink-400" onClick={() => router.push("/admin-dashboard/inventario/articulos/nuevo")}>
                        <Plus className="mr-2 h-4 w-4" /> Nuevo Artículo
                    </Button>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total de Artículos</CardTitle>
                            <Package className="h-4 w-4 text-pink-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{inventario.length}</div>
                        </CardContent>
                    </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Valor del Inventario</CardTitle>
                        <ShoppingBag className="h-4 w-4 text-pink-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            ${inventario.reduce((total, item) => total + item.precio_venta * item.stock_actual, 0).toLocaleString()}
                        </div>
                        <p className="text-xs text-muted-foreground">Actualizado hoy</p>
                    </CardContent>
                </Card>
            </div>
            <Card>
            <CardHeader>
                <CardTitle>Artículos en Inventario</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <div className="relative flex-1">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Buscar artículo..."
                            className="pl-8"
                            value={valorBusqueda}
                            onChange={(e) => setBusqueda(e.target.value)}
                        />
                    </div>
                    <Select value={filtroCategoria} onValueChange={setFiltro}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Categoría" />
                        </SelectTrigger>
                        <SelectContent className="bg-stone-50" >
                            <SelectItem value="todos">Todas las categorías</SelectItem>
                            <SelectItem value="Uniforme">Uniforme</SelectItem>
                            <SelectItem value="Libros">Libros</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                {cargando ? (
                    <p className="text-center">Cargando inventario...</p>
                    ) : (
                    <div className="rounded-md border">
                    </div>
                )}
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>ID</TableHead>
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
                                <TableRow key={item.id_articulo}>
                                    <TableCell className="font-medium">{item.id_articulo}</TableCell>
                                    <TableCell>{item.nombre}</TableCell>
                                    <TableCell>{item.categoria}</TableCell>
                                    <TableCell>
                                        {item.stock_actual < item.stock_minimo ? (
                                        <Badge variant="destructive">{item.stock_actual} (Bajo)</Badge>
                                        ) : (
                                        <Badge variant="outline">{item.stock_actual}</Badge>
                                        )}
                                    </TableCell>
                                    <TableCell>${item.precio_venta}</TableCell>
                                    <TableCell>{new Date(item.ultima_actualizacion).toLocaleDateString()}</TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="sm">
                                                    <ChevronDown className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent className="bg-neutral-50" align="end">
                                            <DropdownMenuItem 
                                                className="hover:bg-pink-200"
                                                onClick={() => editarArticulo(item.id_articulo)}
                                            >
                                                Editar
                                            </DropdownMenuItem>
                                            <DropdownMenuItem 
                                                className="text-red-600 hover:bg-pink-200"
                                                onClick={() => eliminarArticulo(item.id_articulo)}
                                            >
                                                Eliminar
                                            </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
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