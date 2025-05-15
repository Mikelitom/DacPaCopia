"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/app/components/ui/use-toast"
import { supabase } from '@/app/lib/supabaseclient';

export type ArticuloForm = {
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

export function useArticuloForm() {
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
  
  // Valida los campos obligatorios
  const validateForm = () => {
    const requiredFields = ['nombre', 'categoria', 'precio_venta', 'stock_inicial'];
    return requiredFields.every(field => Boolean(formData[field as keyof typeof formData]));
  };

  return {
    formData,
    cargando,
    setFormData,
    handleChange,
    handleSelectChange,
    handleSubmit,
    validateForm
  };
}