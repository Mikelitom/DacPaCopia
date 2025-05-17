import { useState } from "react";
import { supabase } from "@/app/lib/supabaseclient";

export interface Usuario {
  id_usuario: number;
  nombre_completo: string;
  correo: string;
  telefono: string;
  rol: string | null;
  estado: string;
}

export function useEditarUsuario() {
  const [correoBusqueda, setCorreoBusqueda] = useState("");
  const [usuario, setUsuario] = useState<Usuario | null>(null);

  const buscarUsuario = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!correoBusqueda) return;

    const { data, error } = await supabase
      .from("Usuario")
      .select("*")
      .eq("correo", correoBusqueda)
      .single();

    if (error || !data) {
      alert("❌ Usuario no encontrado.");
      setUsuario(null);
      console.error(error);
    } else {
      setUsuario(data);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    if (!usuario) return;
    const { name, value } = e.target;
    const nuevo = name === "telefono" ? value.replace(/[^0-9]/g, "") : value;
    setUsuario({ ...usuario, [name]: nuevo });
  };

  const actualizarUsuario = async () => {
    if (!usuario) return;

    const { error } = await supabase
      .from("Usuario")
      .update({
        nombre_completo: usuario.nombre_completo,
        correo: usuario.correo,
        telefono: usuario.telefono,
        rol: usuario.rol,
      })
      .eq("id_usuario", usuario.id_usuario);

    if (error) {
      console.error("❌ Error actualizando:", error.message);
      alert(`❌ Error: ${error.message}`);
    } else {
      alert("✅ Usuario actualizado correctamente.");
      setUsuario(null);
      setCorreoBusqueda("");
    }
  };

  return {
    correoBusqueda,
    setCorreoBusqueda,
    usuario,
    buscarUsuario,
    handleChange,
    actualizarUsuario,
  };
}
