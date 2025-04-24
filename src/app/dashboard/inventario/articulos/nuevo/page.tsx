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

export default function NuevoArticuloPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    description: "",
    sku: "",
    barcode: "",
    price: "",
    cost: "",
    stock: "",
    minStock: "",
    supplier: "",
    location: "",
    image: null as File | null,
    imagePreview: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setFormData((prev) => ({
        ...prev,
        image: file,
        imagePreview: URL.createObjectURL(file),
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Simulación de envío de datos
    await new Promise((resolve) => setTimeout(resolve, 1500))

    toast({
      title: "Artículo agregado",
      description: "El artículo ha sido agregado al inventario correctamente.",
    })

    setLoading(false)
    router.push("/inventario")
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" onClick={() => router.push("/inventario")}>
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
                    <Label htmlFor="name">
                      Nombre del Artículo <span className="text-destructive">*</span>
                    </Label>
                    <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">
                      Categoría <span className="text-destructive">*</span>
                    </Label>
                    <Select
                      name="category"
                      value={formData.category}
                      onValueChange={(value) => handleSelectChange("category", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar categoría" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Uniformes">Uniformes</SelectItem>
                        <SelectItem value="Libros">Libros</SelectItem>
                        <SelectItem value="Útiles">Útiles</SelectItem>
                        <SelectItem value="Electrónica">Electrónica</SelectItem>
                        <SelectItem value="Deportes">Deportes</SelectItem>
                        <SelectItem value="Otros">Otros</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="description">Descripción</Label>
                    <Textarea 
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows={3}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sku">SKU / Código</Label>
                    <Input id="sku" name="sku" value={formData.sku} onChange={handleChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="barcode">Código de Barras</Label>
                    <Input id="barcode" name="barcode" value={formData.barcode} onChange={handleChange} />
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
                    <Label htmlFor="price">
                      Precio de Venta <span className="text-destructive">*</span>
                    </Label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5">$</span>
                      <Input
                        id="price"
                        name="price"
                        type="number"
                        min="0"
                        step="0.01"
                        className="pl-7"
                        value={formData.price}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cost">Costo de Adquisición</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5">$</span>
                      <Input
                        id="cost"
                        name="cost"
                        type="number"
                        min="0"
                        step="0.01"
                        className="pl-7"
                        value={formData.cost}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="stock">
                      Stock Inicial <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="stock"
                      name="stock"
                      type="number"
                      min="0"
                      value={formData.stock}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="minStock">Stock Mínimo</Label>
                    <Input
                      id="minStock"
                      name="minStock"
                      type="number"
                      min="0"
                      value={formData.minStock}
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
                    <Label htmlFor="supplier">Proveedor</Label>
                    <Input id="supplier" name="supplier" value={formData.supplier} onChange={handleChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Ubicación en Almacén</Label>
                    <Input id="location" name="location" value={formData.location} onChange={handleChange} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>Imagen del Artículo</CardTitle>
                <CardDescription>Sube una imagen del artículo (opcional)</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border-2 border-dashed rounded-lg p-4 text-center">
                  {formData.imagePreview ? (
                    <div className="relative">
                      <img
                        src={formData.imagePreview || "/placeholder.svg"}
                        alt="Vista previa"
                        className="mx-auto max-h-[200px] rounded-md"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="absolute top-2 right-2 bg-white"
                        onClick={() => setFormData((prev) => ({ ...prev, image: null, imagePreview: "" }))}
                      >
                        Eliminar
                      </Button>
                    </div>
                  ) : (
                    <div className="py-8">
                      <Package className="mx-auto h-12 w-12 text-muted-foreground" />
                      <div className="mt-4">
                        <Label
                          htmlFor="image"
                          className="cursor-pointer inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
                        >
                          <Upload className="mr-2 h-4 w-4" />
                          Subir imagen
                        </Label>
                        <Input
                          id="image"
                          name="image"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleImageChange}
                        />
                      </div>
                      <p className="mt-2 text-xs text-muted-foreground">PNG, JPG o GIF hasta 5MB</p>
                    </div>
                  )}
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
                    <span className="text-sm font-medium">Categoría:</span>
                    <span className="text-sm">{formData.category || "No seleccionada"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Precio:</span>
                    <span className="text-sm">{formData.price ? `$${formData.price}` : "$0.00"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Stock Inicial:</span>
                    <span className="text-sm">{formData.stock || "0"} unidades</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full bg-pink-600 hover:bg-pink-700" disabled={loading}>
                  {loading ? (
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
