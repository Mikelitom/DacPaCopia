// editar/hooks/useEditarAlumno.ts
import { useState } from "react";
import { supabase } from "@/app/lib/supabaseclient";

export interface DatosAlumno {
  alumno: any;
  padre: any;
  madre: any;
  contacto: any;
  desarrollo: any;
  vivienda: any;
}

export function useEditarAlumno() {
  const [idAlumno, setIdAlumno] = useState<string>("");
  const [datos, setDatos] = useState<DatosAlumno | null>(null);
  const [error, setError] = useState<string>("");

  const buscarAlumno = async () => {
    setError("");
    setDatos(null);
    if (!idAlumno.trim()) {
      setError("Debes ingresar un ID de alumno");
      return;
    }
    try {
      // Traer alumno
      const { data: alumno, error: errA } = await supabase
        .from("Alumno")
        .select("*")
        .eq("id_alumno", idAlumno)
        .single();
      if (errA || !alumno) throw errA;

      // Traer datos relacionados
      const [{ data: padre }, { data: madre }, { data: contacto }, { data: desarrollo }, { data: vivienda }] =
        await Promise.all([
          supabase.from("PadreFamilia").select("*").eq("id_padre", alumno.id_padre).single(),
          supabase.from("MadreDf").select("*").eq("idMadre", alumno.idMadre).single(),
          supabase.from("ContactoEmergencia").select("*").eq("id_alumno", idAlumno).single(),
          supabase.from("HistoriaDesarrollo").select("*").eq("id_alumno", idAlumno).single(),
          supabase.from("ViviendayComunidad").select("*").eq("id_alumno", idAlumno).single(),
        ]);

      setDatos({ alumno, padre, madre, contacto, desarrollo, vivienda });
    } catch {
      setError("No se encontró información para el ID proporcionado.");
    }
  };

  return { idAlumno, setIdAlumno, datos, error, buscarAlumno };
}
