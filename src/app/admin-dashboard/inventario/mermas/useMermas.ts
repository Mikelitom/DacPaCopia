"use client"

import { useState, useEffect } from "react"
import { useToast } from "@/app/components/ui/use-toast"
import { supabase } from "@/app/lib/supabaseclient"

export type Merma = {
  id_merma: number;
  id_articulo: number;
  cantidad: number;
  motivo: string;
  fecha: string;
  id_usuario: number;
  Articulo?: {
    nombre: string;
    id_articulo: number;
    precio_adquisicion: number;
  };
  Usuario?: {
    nombre: string;
    id_usuario: number;
  };
};

export type FormDataMerma = {
  id_articulo: string;
  cantidad: string;
  motivo: string;
  id_usuario: string;
};

export function useMermas() {
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(false)
  const [mermas, setMermas] = useState<Merma[]>([])
  const [cargando, setCargando] = useState(true)
  const [articulos, setArticulos] = useState<any[]>([])
  const [usuarios, setUsuarios] = useState<any[]>([])

  const [formData, setFormData] = useState<FormDataMerma>({
    id_articulo: "",
    cantidad: "1",
    motivo: "",
    id_usuario: "",
  })

  // Cargar datos iniciales
  useEffect(() => {
    const fetchData = async () => {
      try {
        setCargando(true)
        
        // Cargar mermas con relaciones
        const { data: mermasData, error: mermasError } = await supabase
          .from("Merma")
          .select(`
            *,
            Articulo:Articulo (nombre, id_articulo, precio_adquisicion),
            Usuario:Usuario (nombre_completo, id_usuario)
          `)
          .order('fecha', { ascending: false })

        if (mermasError) throw mermasError

        // Cargar artículos disponibles
        const { data: articulosData, error: articulosError } = await supabase
          .from("Articulo")
          .select("id_articulo, nombre")

        if (articulosError) throw articulosError

        // Cargar usuarios disponibles
        const { data: usuariosData, error: usuariosError } = await supabase
          .from("Usuario")
          .select("id_usuario, nombre_completo")

        if (usuariosError) throw usuariosError

        setMermas(mermasData || [])
        setArticulos(articulosData || [])
        setUsuarios(usuariosData || [])

      } catch (error) {
        console.error("Error cargando datos:", error)
        toast({
          title: "Error",
          description: "No se pudieron cargar los datos",
          variant: "destructive"
        })
      } finally {
        setCargando(false)
      }
    }

    fetchData()
  }, [])

  // Filtrar mermas
  const filtroMermas = mermas.filter((item) =>
    item.id_merma.toString().includes(searchTerm.toLowerCase()) ||
    (item.Articulo?.nombre?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
    (item.Usuario?.nombre?.toLowerCase() || "").includes(searchTerm.toLowerCase())
  )

  // Manejar cambios en el formulario
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  // Enviar nueva merma
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Validar campos requeridos
      if (!formData.id_articulo || !formData.cantidad || !formData.id_usuario) {
        throw new Error("Todos los campos marcados con * son obligatorios")
      }

      const { data, error } = await supabase
        .from('Merma')
        .insert([{
          id_articulo: Number(formData.id_articulo),
          cantidad: Number(formData.cantidad),
          motivo: formData.motivo,
          id_usuario: Number(formData.id_usuario),
          fecha: new Date().toISOString(),
        }])
        .select()

      if (error) throw error
      if (!data || data.length === 0) throw new Error("No se recibieron datos de la inserción")

      toast({
        title: "✅ Merma registrada",
        description: "La merma ha sido registrada correctamente",
      })

      // Actualizar lista de mermas
      const { data: newData } = await supabase
        .from("Merma")
        .select(`
          *,
          Articulo:Articulo (nombre, id_articulo, precio_adquisicion),
          Usuario:Usuario (nombre_completo, id_usuario)
        `)
        .order('fecha', { ascending: false })

      setMermas(newData || [])

      // Resetear formulario
      setFormData({
        id_articulo: "",
        cantidad: "1",
        motivo: "",
        id_usuario: "",
      })

    } catch (error: any) {
      console.error("Error registrando merma:", error)
      toast({
        title: "❌ Error",
        description: error.message || "Ocurrió un error al registrar la merma",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  // Eliminar merma
  const handleDelete = async (id: number) => {
    try {
      const { error } = await supabase
        .from('Merma')
        .delete()
        .eq('id_merma', id)

      if (error) throw error

      toast({
        title: "✅ Merma eliminada",
        description: "La merma ha sido eliminada correctamente",
      })

      setMermas(mermas.filter(m => m.id_merma !== id))
    } catch (error) {
      toast({
        title: "❌ Error",
        description: "No se pudo eliminar la merma",
        variant: "destructive"
      })
    }
  }

  // Calcular valor total
  const valorTotal = filtroMermas.reduce((sum, merma) => {
    return sum + (merma.Articulo?.precio_adquisicion || 0) * merma.cantidad
  }, 0)

  // Resetear formulario
  const resetForm = () => {
    setFormData({
      id_articulo: "",
      cantidad: "1",
      motivo: "",
      id_usuario: "",
    })
  }

  return {
    searchTerm,
    setSearchTerm,
    loading,
    mermas,
    cargando,
    articulos,
    usuarios,
    formData,
    setFormData,
    filtroMermas,
    handleChange,
    handleSubmit,
    handleDelete,
    valorTotal,
    resetForm
  }
}