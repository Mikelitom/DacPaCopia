import { useState, useEffect } from "react";
import { supabase } from "@/app/lib/supabaseclient";

export interface Usuario {
  id_usuario: number;
  nombre_completo: string;
  correo: string;
  telefono: string;
  rol: string;
  estado: string;
  id_alumno: number;
}

export function useBajaUsuario() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsuarios = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("Usuario")
      .select(
        "id_usuario, nombre_completo, correo, telefono, rol, estado, id_alumno"
      )
      .order("nombre_completo", { ascending: true });

    if (error) {
      console.error("Error cargando usuarios:", error);
      setUsuarios([]);
    } else {
      setUsuarios(data || []);
    }
    setLoading(false);
  };

  const eliminarUsuario = async (id_usuario: number) => {
    if (!confirm("¿Estás seguro de eliminar este usuario?")) return;
    setLoading(true);
    const { error } = await supabase
      .from("Usuario")
      .delete()
      .eq("id_usuario", id_usuario);

    if (error) {
      console.error("Error eliminando usuario:", error);
      alert("❌ No se pudo eliminar el usuario.");
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
