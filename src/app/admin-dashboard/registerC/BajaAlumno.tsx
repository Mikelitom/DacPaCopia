"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";

interface Alumno {
  id_alumno: number;
  nombre: string;
  apellido_paterno: string;
  apellido_materno: string;
  grado: string;
  grupo: string;
  id_padre: number;
  idMadre: number;
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
  
    if (error) {
      console.error("Error al cargar alumnos:", error);
      alert("❌ Error al cargar alumnos");
    } else {
      console.log("🎯 Alumnos obtenidos:", data);
      setAlumnos(data || []);
    }
    setLoading(false);
  };
  

  const eliminarAlumno = async (id_alumno: number, id_padre: number, id_madre: number | null) => {
    if (!confirm("¿Estás seguro de eliminar este alumno y todos sus datos relacionados?")) return;
  
    try {
      console.log("id_alumno:", id_alumno);
      console.log("id_padre:", id_padre);
      console.log("id_madre:", id_madre);
  
      // 1. Eliminar HistoriaDesarrollo
      const { error: historiaError } = await supabase
        .from("HistoriaDesarrollo")
        .delete()
        .eq("id_alumno", id_alumno);
      if (historiaError) throw historiaError;
  
      // 2. Eliminar ViviendayComunidad
      const { error: viviendaError } = await supabase
        .from("ViviendayComunidad")
        .delete()
        .eq("id_alumno", id_alumno);
      if (viviendaError) throw viviendaError;
  
      // 3. Eliminar Alumno
      const { error: alumnoError } = await supabase
        .from("Alumno")
        .delete()
        .eq("id_alumno", id_alumno);
      if (alumnoError) throw alumnoError;
  
      console.log("Alumno eliminado correctamente, ahora validamos padres/madres.");
  
      // 4. Verificar Padre
      if (id_padre) {
        const { data: hijosPadre, error: padreError } = await supabase
          .from("Alumno")
          .select("id_alumno")
          .eq("id_padre", id_padre);
  
        if (padreError) throw padreError;
  
        if (hijosPadre.length === 0) {
          await supabase
            .from("PadreFamilia")
            .delete()
            .eq("id_padre", id_padre);
        }
      }
  
      // 5. Verificar Madre SOLO SI existe
      if (id_madre) {
        const { data: hijosMadre, error: madreError } = await supabase
          .from("Alumno")
          .select("id_alumno")
          .eq("idMadre", id_madre);
  
        if (madreError) throw madreError;
  
        if (hijosMadre.length === 0) {
          await supabase
            .from("MadreDf")
            .delete()
            .eq("idMadre", id_madre);
        }
      }
  
      alert("✅ Alumno y datos relacionados eliminados correctamente");
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
    <div className="max-w-5xl mx-auto p-6 bg-white rounded-lg shadow">
      <h1 className="text-2xl font-bold text-pink-700 mb-6 text-center">
        Baja de Alumnos
      </h1>

      {loading ? (
        <p className="text-center">Cargando alumnos...</p>
      ) : alumnos.length === 0 ? (
        <p className="text-center">No hay alumnos registrados.</p>
      ) : (
        <table className="min-w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-pink-100">
              <th className="border border-gray-300 px-4 py-2">Nombre</th>
              <th className="border border-gray-300 px-4 py-2">Grado</th>
              <th className="border border-gray-300 px-4 py-2">Grupo</th>
              <th className="border border-gray-300 px-4 py-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {alumnos.map((alumno) => (
              <tr key={alumno.id_alumno} className="text-center">
                <td className="border border-gray-300 px-4 py-2">
                  {alumno.nombre} {alumno.apellido_paterno} {alumno.apellido_materno}
                </td>
                <td className="border border-gray-300 px-4 py-2">{alumno.grado}</td>
                <td className="border border-gray-300 px-4 py-2">{alumno.grupo}</td>
                <td className="border border-gray-300 px-4 py-2">
                  <button
                    onClick={() => eliminarAlumno(alumno.id_alumno, alumno.id_padre, alumno.idMadre)}
                    className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
