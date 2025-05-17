import { useState, useEffect } from "react";
import { supabase } from "@/app/lib/supabaseclient";

export interface Usuario {
  id_usuario: number;
  nombre_completo: string;
  correo: string;
  telefono: string;
  departamento: string | null;
  rol: string | null;
  estado: string;
}

export function useListaUsuarios() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsuarios = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("Usuario").select("*");

    if (error) {
      console.error("❌ Error al obtener usuarios:", error.message);
      setUsuarios([]);
    } else {
      setUsuarios(data || []);
    }
    setLoading(false);
  };

  const eliminarUsuario = async (id_usuario: number) => {
    if (!confirm("¿Seguro que deseas eliminar este usuario?")) return;

    setLoading(true);
    const { error } = await supabase
      .from("Usuario")
      .delete()
      .eq("id_usuario", id_usuario);

    if (error) {
      console.error("❌ Error al eliminar usuario:", error.message);
      alert(`❌ Error al eliminar: ${error.message}`);
    } else {
      alert("✅ Usuario eliminado correctamente.");
      await fetchUsuarios();
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  return { usuarios, loading, eliminarUsuario };
}
