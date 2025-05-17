// altaUsuario/hooks/useAltaUsuario.ts
import { useState } from "react";
import { supabase } from "@/app/lib/supabaseclient";

export interface FormData {
  nombre_completo: string;
  correo: string;
  telefono: string;
  contraseña: string;
  rol: string;
  id_alumno: string;
}

export function useAltaUsuario() {
  const [formData, setFormData] = useState<FormData>({
    nombre_completo: "",
    correo: "",
    telefono: "",
    contraseña: "",
    rol: "",
    id_alumno: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    let nuevo = value;
    if (name === "telefono" || name === "id_alumno") {
      nuevo = value.replace(/[^0-9]/g, "");
    }
    setFormData((prev) => ({ ...prev, [name]: nuevo }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // 1️⃣ Validar existencia del alumno
    const id = parseInt(formData.id_alumno, 10);
    const { data: alumno, error: errA } = await supabase
      .from("Alumno")
      .select("id_alumno")
      .eq("id_alumno", id)
      .single();
    if (errA || !alumno) {
      alert("❌ El ID del alumno no existe.");
      setLoading(false);
      return;
    }

    // 2️⃣ Registrar usuario
    const { error } = await supabase.from("Usuario").insert([
      {
        nombre_completo: formData.nombre_completo,
        correo: formData.correo,
        telefono: formData.telefono,
        contraseña: formData.contraseña,
        rol: formData.rol,
        estado: "Activo",
        id_alumno: id,
      },
    ]);

    if (error) {
      alert(`❌ Error al registrar: ${error.message}`);
    } else {
      alert("✅ Usuario registrado.");
      setFormData({
        nombre_completo: "",
        correo: "",
        telefono: "",
        contraseña: "",
        rol: "",
        id_alumno: "",
      });
    }

    setLoading(false);
  };

  return { formData, loading, handleChange, handleSubmit };
}
