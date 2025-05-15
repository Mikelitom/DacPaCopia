"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/app/lib/supabaseclient"
import { toast } from "@/app/components/ui/use-toast"
import { useRouter } from "next/navigation"

export type Articulos = {
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

export function useArticulos() {
    const router = useRouter()
    const [valorBusqueda, setBusqueda] = useState("")
    const [filtroCategoria, setFiltro] = useState("todos")
    const [inventario, setInventario] = useState<Articulos[]>([]);
    const [cargando, setCargando] = useState<boolean>(true);

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

    // Filtrar el inventario
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

    const irANuevoArticulo = () => {
        router.push("/admin-dashboard/inventario/articulos/nuevo");
    };

    // Cálculo para el valor total del inventario
    const valorTotalInventario = inventario.reduce(
        (total, item) => total + item.precio_venta * item.stock_actual, 
        0
    );

    return {
        valorBusqueda,
        setBusqueda,
        filtroCategoria,
        setFiltro,
        inventario,
        cargando,
        filtro,
        eliminarArticulo,
        editarArticulo,
        irANuevoArticulo,
        valorTotalInventario
    };
}