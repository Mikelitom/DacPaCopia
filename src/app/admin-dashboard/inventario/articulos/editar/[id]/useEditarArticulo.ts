"use client"

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/app/components/ui/use-toast";
import { supabase } from "@/app/lib/supabaseclient";

export type Articulo = {
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

export function useEditarArticulo(articuloId: string) {
  const router = useRouter();
  const { toast } = useToast();
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [articulo, setArticulo] = useState<Articulo | null>(null);

  // Cargar artículo seleccionado al iniciar
  useEffect(() => {
    const cargarArticulo = async () => {
      try {
        const { data, error } = await supabase
          .from('Articulo')
          .select('*')
          .eq('id_articulo', articuloId)
          .single();

        if (error) throw error;
        if (!data) throw new Error("Artículo no encontrado");

        setArticulo(data);
      } catch (error) {
        console.error("Error cargando artículo:", error);
        toast({
          title: "Error",
          description: "No se pudo cargar el artículo",
          variant: "destructive"
        });
        router.push("/admin-dashboard/inventario/articulos");
      } finally {
        setCargando(false);
      }
    };

    cargarArticulo();
  }, [articuloId, router, toast]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!articulo) return;
    const { name, value } = e.target;
    setArticulo({ ...articulo, [name]: value });
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!articulo) return;
    const { name, value } = e.target;
    setArticulo({ ...articulo, [name]: Number(value) });
  };

  const handleSelectChange = (name: string, value: string) => {
    if (!articulo) return;
    setArticulo({ ...articulo, [name]: value });
  };

  const handleImageUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!articulo) return;
    setArticulo({ ...articulo, imagen_url: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!articulo) return;

    setGuardando(true);

    try {
      const { error } = await supabase
        .from('Articulo')
        .update({
          ...articulo,
          ultima_actualizacion: new Date().toISOString()
        })
        .eq('id_articulo', articulo.id_articulo);

      if (error) throw error;

      toast({
        title: "✅ Artículo actualizado",
        description: "Los cambios se guardaron correctamente",
      });
      router.push("/admin-dashboard/inventario/articulos");
      
    } catch (error) {
      console.error("Error guardando cambios:", error);
      toast({
        title: "❌ Error",
        description: "No se pudieron guardar los cambios",
        variant: "destructive"
      });
    } finally {
      setGuardando(false);
    }
  };

  const navegarAtras = () => {
    router.push("/admin-dashboard/inventario/articulos");
  };

  return {
    articulo,
    cargando,
    guardando,
    handleChange,
    handleNumberChange,
    handleSelectChange,
    handleImageUrlChange,
    handleSubmit,
    navegarAtras
  };
}