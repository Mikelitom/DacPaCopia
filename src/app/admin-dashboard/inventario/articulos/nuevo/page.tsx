"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ChevronLeft, Package, Save, Upload } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/app/components/ui/card"
import { Button } from "@/app/components/ui/button"
import { Input } from "@/app/components/ui/input"
import { Label } from "@/app/components/ui/label"
import { Textarea } from "@/app/components/ui/textarea"
import { useToast } from "@/app/components/ui/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select"
import { supabase } from '@/app/lib/supabaseClient';

type ArticuloForm = {
  nombre: string;
  categoria: string;
  descripcion: string;
  sku: string;
  codigo_barras: string;
  precio_venta: string;
  precio_adquisicion: string;
  stock_actual: string;
  stock_minimo: string;
  stock_inicial: string;
  proveedor: string;
  imagen_url: string;
  imagePreview: string;
};

export default function NuevoArticuloPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [cargando, setCargando] = useState(false)
  const [formData, setFormData] = useState<ArticuloForm>({
    nombre: "",
    categoria: "",
    descripcion: "",
    sku: "",
    codigo_barras: "",
    precio_venta: "",
    precio_adquisicion: "",
    stock_actual: "",
    stock_minimo: "",
    stock_inicial: "",
    proveedor: "",
    imagen_url: "",
    imagePreview: "",
  });


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCargando(true);
  
    try {
      const articuloData = {
        nombre: formData.nombre,
        categoria: formData.categoria,
        descripcion: formData.descripcion,
        sku: formData.sku,
        codigo_barras: formData.codigo_barras,
        precio_venta: parseFloat(formData.precio_venta),
        precio_adquisicion: parseFloat(formData.precio_adquisicion),
        stock_actual: parseInt(formData.stock_inicial),
        stock_minimo: parseInt(formData.stock_minimo),
        stock_inicial: parseInt(formData.stock_inicial),
        proveedor: formData.proveedor,
        imagen_url: formData.imagen_url, 
        ultima_actualizacion: new Date().toISOString(),
      };
  
      const { error } = await supabase
        .from('Articulo')
        .insert([articuloData]);
  
      if (error) throw error;
  
      toast({
        title: "✅ Artículo agregado",
        description: "El artículo ha sido agregado al inventario correctamente.",
      });
  
      router.push("/admin-dashboard/inventario/articulos");
      
    } catch (error) {
      console.error("Error al guardar artículo:", error);
      toast({
        title: "❌ Error",
        description: "No se pudo guardar el artículo. Por favor intenta nuevamente.",
        variant: "destructive",
      });
    } finally {
      setCargando(false);
    }
  };
  
  //Valida los campos obligatorios
  const validateForm = () => {
    const requiredFields = ['nombre', 'categoria', 'precio_venta', 'stock_inicial'];
    return requiredFields.every(field => Boolean(formData[field as keyof typeof formData]));
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" onClick={() => router.push("/admin-dashboard/inventario/articulos")}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-3xl font-bold">Nuevo Artículo</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Información del Artículo</CardTitle>
                <CardDescription>Ingresa los detalles del nuevo artículo para el inventario</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nombre">
                      Nombre del Artículo <span className="text-destructive">*</span>
                    </Label>
                    <Input id="nombre" name="nombre" value={formData.nombre} onChange={handleChange} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="categoria">
                      Categoría <span className="text-destructive">*</span>
                    </Label>
                    <Select
                      name="categoria"
                      value={formData.categoria}
                      onValueChange={(value) => handleSelectChange("categoria", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar categoría" />
                      </SelectTrigger>
                      <SelectContent className="bg-stone-50">
                        <SelectItem value="Uniformes">Uniformes</SelectItem>
                        <SelectItem value="Libros">Paquete de Libros</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="descripcion">Descripción</Label>
                    <Textarea 
                      id="descripcion"
                      name="descripcion"
                      value={formData.descripcion}
                      onChange={handleChange}
                      rows={3}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sku">SKU</Label>
                    <Input id="sku" name="sku" value={formData.sku} onChange={handleChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="codigo_barras">Código de Barras</Label>
                    <Input id="codigo_barras" name="codigo_barras" value={formData.codigo_barras} onChange={handleChange} />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Precios e Inventario</CardTitle>
                <CardDescription>Configura los precios y niveles de inventario</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="precio_venta">
                      Precio de Venta <span className="text-destructive">*</span>
                    </Label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5">$</span>
                      <Input
                        id="precio_venta"
                        name="precio_venta"
                        type="number"
                        min="0"
                        step="0.01"
                        className="pl-7"
                        value={formData.precio_venta}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="precio_adquisicion">Costo de Adquisición</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5">$</span>
                      <Input
                        id="precio_adquisicion"
                        name="precio_adquisicion"
                        type="number"
                        min="0"
                        step="0.01"
                        className="pl-7"
                        value={formData.precio_adquisicion}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="stock_inicial">
                      Stock Inicial <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="stock_inicial"
                      name="stock_inicial"
                      type="number"
                      min="0"
                      value={formData.stock_inicial}
                      onChange={handleChange}
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
                      value={formData.stock_minimo}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Información Adicional</CardTitle>
                <CardDescription>Detalles adicionales del artículo</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="proveedor">Proveedor</Label>
                    <Input id="proveedor" name="proveedor" value={formData.proveedor} onChange={handleChange} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>Imagen del Artículo</CardTitle>
                <CardDescription>Sube una URL de la imagen del articulo (opcional)</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="mt-4 space-y-2">
                  <Label htmlFor="imagen_url_input">URL de la imagen</Label>
                  <Input
                    id="imagen_url_input"
                    name="imagen_url"
                    value={formData.imagen_url}
                    onChange={(e) => setFormData(prev => ({ ...prev, imagen_url: e.target.value }))}
                    placeholder="https://ejemplo.com/imagen.jpg"
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="mt-6 bg-pink-50 border-pink-200">
              <CardHeader>
                <CardTitle>Resumen</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                      <span className="text-sm font-medium">Nombre:</span>
                      <span className="text-sm">{formData.nombre || "Vacio"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Categoría:</span>
                    <span className="text-sm">{formData.categoria || "No seleccionada"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">SKU:</span>
                    <span className="text-sm">{formData.sku || "Vacio"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Código de Barras:</span>
                    <span className="text-sm">{formData.codigo_barras || "Vacio"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Precio:</span>
                    <span className="text-sm">{formData.precio_venta ? `$${formData.precio_venta}` : "$0.00"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Stock Inicial:</span>
                    <span className="text-sm">{formData.stock_inicial || "0"} unidades</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Proveedor:</span>
                    <span className="text-sm">{formData.proveedor || "No seleccionado"}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                    type="submit" 
                    className="w-full bg-pink-600 hover:bg-pink-700" 
                    disabled={cargando || !validateForm()}
                  >
                  {cargando ? (
                    "Guardando..."
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Guardar Artículo
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
