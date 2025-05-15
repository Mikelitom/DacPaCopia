"use client";

import React, { useEffect, useState } from "react";
import { supabase } from '@/app/lib/supabaseClient'

interface Alumno {
  id_alumno: number;
  nombre: string;
  apellido_paterno: string;
  apellido_materno: string;
  grado: string;
  grupo: string;
  id_padre: number;
  idMadre: number | null;
}

export default function BajaAlumno() {
  const [alumnos, setAlumnos] = useState<Alumno[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAlumnos = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("Alumno")
      .select("id_alumno, nombre, apellido_paterno, apellido_materno, grado, grupo, id_padre, idMadre")
      .order("nombre", { ascending: true });

    console.log("🧪 Supabase error:", error);
    console.log("🧪 Supabase data:", data);

    if (error) {
      console.error("Error al cargar alumnos:", error);
      alert("❌ Error al cargar alumnos");
    } else {
      setAlumnos(data || []);
    }
    setLoading(false);
  };

  const eliminarAlumno = async (id_alumno: number, id_padre: number, idMadre: number | null) => {
    if (!confirm("¿Estás seguro de eliminar este alumno y todos sus datos relacionados?")) return;

    try {
      await supabase.from("HistoriaDesarrollo").delete().eq("id_alumno", id_alumno);
      await supabase.from("ViviendayComunidad").delete().eq("id_alumno", id_alumno);
      await supabase.from("ContactoEmergencia").delete().eq("id_alumno", id_alumno);
      await supabase.from("Usuario").delete().eq("id_alumno", id_alumno);
      await supabase.from("Alumno").delete().eq("id_alumno", id_alumno);

      if (id_padre) {
        const { data: hijosPadre } = await supabase
          .from("Alumno")
          .select("id_alumno")
          .eq("id_padre", id_padre);

        if ((hijosPadre?.length || 0) === 0) {
          await supabase.from("PadreFamilia").delete().eq("id_padre", id_padre);
        }
      }

      if (idMadre) {
        const { data: hijosMadre } = await supabase
          .from("Alumno")
          .select("id_alumno")
          .eq("idMadre", idMadre);

        if ((hijosMadre?.length || 0) === 0) {
          await supabase.from("MadreDf").delete().eq("idMadre", idMadre);
        }
      }

      alert("✅ Alumno eliminado correctamente.");
      fetchAlumnos();

    } catch (err: any) {
      console.error("Error al eliminar:", err);
      alert("❌ Error al eliminar. Revisa consola para detalles.");
    }
  };

  useEffect(() => {
    fetchAlumnos();
  }, []);

  return (
    <div className="p-6 rounded-xl border border-gray-300 shadow-sm bg-white max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-pink-700 mb-6 text-center">Baja de Alumnos</h1>

      {loading ? (
        <p className="text-center">Cargando alumnos...</p>
      ) : alumnos.length === 0 ? (
        <p className="text-center text-gray-600">No hay alumnos registrados.</p>
      ) : (
        <div className="overflow-x-auto rounded-lg shadow-md">
          <table className="min-w-full text-sm text-left border rounded-xl overflow-hidden">
            <thead className="bg-[#f9f9f9] border-b">
              <tr>
                <th className="px-6 py-4 font-semibold">Nombre Completo</th>
                <th className="px-6 py-4 font-semibold">Grado</th>
                <th className="px-6 py-4 font-semibold">Grupo</th>
                <th className="px-6 py-4 font-semibold">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {alumnos.map((alumno) => (
                <tr key={alumno.id_alumno} className="hover:bg-gray-50">
                  <td className="px-6 py-3">
                    {alumno.nombre} {alumno.apellido_paterno} {alumno.apellido_materno}
                  </td>
                  <td className="px-6 py-3">{alumno.grado}</td>
                  <td className="px-6 py-3">{alumno.grupo}</td>
                  <td className="px-6 py-3">
                    <button
                      onClick={() => eliminarAlumno(alumno.id_alumno, alumno.id_padre, alumno.idMadre)}
                      className="bg-[#FFE0E3] hover:bg-[#ffccd4] text-black font-semibold px-4 py-1 rounded-lg transition"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
