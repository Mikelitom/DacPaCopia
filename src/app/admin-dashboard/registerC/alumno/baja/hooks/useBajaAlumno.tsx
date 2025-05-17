import { useState, useEffect } from "react";
import { supabase } from "@/app/lib/supabaseclient";

export interface Alumno {
  id_alumno: number;
  nombre: string;
  apellido_paterno: string;
  apellido_materno: string;
  grado: string;
  grupo: string;
  id_padre: number;
  idMadre: number | null;
}

export function useBajaAlumno() {
  const [alumnos, setAlumnos] = useState<Alumno[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAlumnos = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("Alumno")
      .select("id_alumno, nombre, apellido_paterno, apellido_materno, grado, grupo, id_padre, idMadre")
      .order("nombre", { ascending: true });

    if (error) {
      console.error(error);
      setAlumnos([]);
    } else {
      setAlumnos(data || []);
    }
    setLoading(false);
  };

  const eliminarAlumno = async (id_alumno: number, id_padre: number, idMadre: number | null) => {
    if (!confirm("¿Eliminar este alumno?")) return;
    try {
      await supabase.from("HistoriaDesarrollo").delete().eq("id_alumno", id_alumno);
      await supabase.from("ViviendayComunidad").delete().eq("id_alumno", id_alumno);
      await supabase.from("ContactoEmergencia").delete().eq("id_alumno", id_alumno);
      await supabase.from("Usuario").delete().eq("id_alumno", id_alumno);
      await supabase.from("Alumno").delete().eq("id_alumno", id_alumno);

      // Si un padre o madre ya no tiene hijos, también borra
      const hijosPadre = await supabase.from("Alumno").select().eq("id_padre", id_padre);
      if ((hijosPadre.data?.length || 0) === 0)
        await supabase.from("PadreFamilia").delete().eq("id_padre", id_padre);

      if (idMadre) {
        const hijosMadre = await supabase.from("Alumno").select().eq("idMadre", idMadre);
        if ((hijosMadre.data?.length || 0) === 0)
          await supabase.from("MadreDf").delete().eq("idMadre", idMadre);
      }

      fetchAlumnos();
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchAlumnos();
  }, []);

  return { alumnos, loading, eliminarAlumno };
}
