"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { ChevronLeft, Package, Save, Upload } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/app/components/ui/card"
import { Button } from "@/app/components/ui/button"
import { Input } from "@/app/components/ui/input"
import { Label } from "@/app/components/ui/label"
import { Textarea } from "@/app/components/ui/textarea"
import { useToast } from "@/app/components/ui/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select"
import { supabase } from "@/app/lib/supabaseclient"
import { Badge } from "@/app/components/ui/badge"

type Articulo = {
  id_articulo: number;
  nombre: string;
  categoria: string;
  descripcion: string;
  sku: string;
  codigo_barras: string;
  precio_venta: number;
  precio_adquisicion: number;
  stock_actual: number;
  stock_minimo: number;
  stock_inicial: number;
  proveedor: string;
  imagen_url: string;
  ultima_actualizacion: string;
};

export default function EditarArticuloPage() {
  const router = useRouter()
  const params = useParams()
  const { toast } = useToast()
  const [cargando, setCargando] = useState(true)
  const [guardando, setGuardando] = useState(false)
  const [articulo, setArticulo] = useState<Articulo | null>(null)

  // Cargar artículo seleccionado al iniciar
  useEffect(() => {
    const cargarArticulo = async () => {
      try {
        const { data, error } = await supabase
          .from('Articulo')
          .select('*')
          .eq('id_articulo', params.id)
          .single()

        if (error) throw error
        if (!data) throw new Error("Artículo no encontrado")

        setArticulo(data)
      } catch (error) {
        console.error("Error cargando artículo:", error)
        toast({
          title: "Error",
          description: "No se pudo cargar el artículo",
          variant: "destructive"
        })
        router.push("/admin-dashboard/inventario/articulos")
      } finally {
        setCargando(false)
      }
    }

    cargarArticulo()
  }, [params.id, router, toast])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!articulo) return
    const { name, value } = e.target
    setArticulo({ ...articulo, [name]: value })
  }

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!articulo) return
    const { name, value } = e.target
    setArticulo({ ...articulo, [name]: Number(value) })
  }

  const handleSelectChange = (name: string, value: string) => {
    if (!articulo) return
    setArticulo({ ...articulo, [name]: value })
  }

  const handleImageUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!articulo) return
    setArticulo({ ...articulo, imagen_url: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!articulo) return

    setGuardando(true)

    try {
      const { error } = await supabase
        .from('Articulo')
        .update({
          ...articulo,
          ultima_actualizacion: new Date().toISOString()
        })
        .eq('id_articulo', articulo.id_articulo)

      if (error) throw error

      toast({
        title: "✅ Artículo actualizado",
        description: "Los cambios se guardaron correctamente",
      })
      router.push("/admin-dashboard/inventario/articulos")
      
    } catch (error) {
      console.error("Error guardando cambios:", error)
      toast({
        title: "❌ Error",
        description: "No se pudieron guardar los cambios",
        variant: "destructive"
      })
    } finally {
      setGuardando(false)
    }
  }

  if (cargando) {
    return (
      <div className="p-6 flex justify-center items-center h-[60vh]">
        <p>Cargando artículo...</p>
      </div>
    )
  }

  if (!articulo) {
    return (
      <div className="p-6 flex justify-center items-center h-[60vh]">
        <p>Artículo no encontrado</p>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" onClick={() => router.push("/admin-dashboard/inventario/articulos")}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-3xl font-bold">Editar Artículo</h1>
        <Badge variant="outline" className="ml-2">ID: {articulo.id_articulo}</Badge>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Información del Artículo</CardTitle>
                <CardDescription>Modifica los detalles del artículo</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nombre">
                      Nombre <span className="text-destructive">*</span>
                    </Label>
                    <Input 
                      id="nombre" 
                      name="nombre" 
                      value={articulo.nombre} 
                      onChange={handleChange} 
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="categoria">
                      Categoría <span className="text-destructive">*</span>
                    </Label>
                    <Select
                      value={articulo.categoria}
                      onValueChange={(value) => handleSelectChange("categoria", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar categoría" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Uniformes">Uniformes</SelectItem>
                        <SelectItem value="Libros">Paquete de Libros</SelectItem>
                        {/* Agrega más categorías según necesites */}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="descripcion">Descripción</Label>
                    <Textarea
                      id="descripcion"
                      name="descripcion"
                      value={articulo.descripcion || ""}
                      onChange={handleChange}
                      rows={3}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sku">SKU</Label>
                    <Input 
                      id="sku" 
                      name="sku" 
                      value={articulo.sku || ""} 
                      onChange={handleChange} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="codigo_barras">Código de Barras</Label>
                    <Input 
                      id="codigo_barras" 
                      name="codigo_barras" 
                      value={articulo.codigo_barras || ""} 
                      onChange={handleChange} 
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Precios e Inventario</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="precio_venta">
                      Precio de Venta <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="precio_venta"
                      name="precio_venta"
                      type="number"
                      min="0"
                      step="0.01"
                      value={articulo.precio_venta}
                      onChange={handleNumberChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="precio_adquisicion">Costo de Adquisición</Label>
                    <Input
                      id="precio_adquisicion"
                      name="precio_adquisicion"
                      type="number"
                      min="0"
                      step="0.01"
                      value={articulo.precio_adquisicion}
                      onChange={handleNumberChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="stock_actual">
                      Stock Actual <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="stock_actual"
                      name="stock_actual"
                      type="number"
                      min="0"
                      value={articulo.stock_actual}
                      onChange={handleNumberChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="stock_minimo">Stock Mínimo</Label>
                    <Input
                      id="stock_minimo"
                      name="stock_minimo"
                      type="number"
                      min="0"
                      value={articulo.stock_minimo}
                      onChange={handleNumberChange}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Información Adicional</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="proveedor">Proveedor</Label>
                    <Input 
                      id="proveedor" 
                      name="proveedor" 
                      value={articulo.proveedor || ""} 
                      onChange={handleChange} 
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>Imagen del Artículo</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2 mt-4">
                  <Label htmlFor="imagen_url">URL de la imagen</Label>
                  <Input
                    id="imagen_url"
                    name="imagen_url"
                    value={articulo.imagen_url || ""}
                    onChange={handleImageUrlChange}
                    placeholder="https://ejemplo.com/imagen.jpg"
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Resumen</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Nombre:</span>
                    <span className="text-sm">{articulo.nombre}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Categoría:</span>
                    <span className="text-sm">{articulo.categoria}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Precio:</span>
                    <span className="text-sm">${articulo.precio_venta.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Stock:</span>
                    <span className="text-sm">{articulo.stock_actual} unidades</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  type="submit" 
                  className="w-full bg-pink-600 hover:bg-pink-700" 
                  disabled={guardando}
                >
                  {guardando ? (
                    "Guardando..."
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Guardar Cambios
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </form>
    </div>
  )
}