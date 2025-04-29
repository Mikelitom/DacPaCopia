// src/components/BajaAlumno.tsx
"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";

interface Alumno {
  id_alumno: number;
  nombre: string;
  apellido_paterno: string;
  apellido_materno: string;
}

export default function BajaAlumno() {
  const [alumnos, setAlumnos] = useState<Alumno[]>([]);

  useEffect(() => {
    fetchAlumnos();
  }, []);

  const fetchAlumnos = async () => {
    const { data, error } = await supabase
      .from("Alumno")
      .select("id_alumno, nombre, apellido_paterno, apellido_materno");
    if (error) console.error("❌ Error al cargar alumnos:", error.message);
    else setAlumnos(data as Alumno[]);
  };

  const eliminarAlumno = async (id_alumno: number) => {
  if (!confirm("¿Seguro que deseas eliminar este alumno y todos sus datos relacionados?")) return;

  try {
    // Obtener referencias del padre y madre
    const { data: ref, error: refError } = await supabase
      .from("Alumno")
      .select("id_padre, idMadre")
      .eq("id_alumno", id_alumno)
      .single();
    if (refError || !ref) throw refError || new Error("Alumno no encontrado");
    const { id_padre, idMadre } = ref;

    // Borrar TODOS los datos dependientes
    const tablasDependientes = [
      { tabla: "HistoriaDesarrollo", campo: "id_alumno" },
      { tabla: "DatosPersonasConLasQueVIveElNiño", campo: "id_alumno" },
      { tabla: "HistorialPago", campo: "id_alumno" },
      { tabla: "PagoColegiatura", campo: "id_alumno" },
      { tabla: "Pedido", campo: "id_alumno" },
      { tabla: "Convenio", campo: "id_alumno" },
      { tabla: "Deudor", campo: "id_alumno" },
      { tabla: "ViviendayComunidad", campo: "id_alumno" },
    ];

    for (const { tabla, campo } of tablasDependientes) {
      const { error } = await supabase
        .from(tabla)
        .delete()
        .eq(campo, id_alumno);
      if (error) console.warn(`⚠️ No se encontró o no se pudo borrar en ${tabla}:`, error.message);
    }

    // Luego eliminar el alumno
    const { error: alumnoError } = await supabase
      .from("Alumno")
      .delete()
      .eq("id_alumno", id_alumno);
    if (alumnoError) throw alumnoError;

    // Luego eliminar registros de padre y madre
    if (idMadre) {
      const { error: madreError } = await supabase
        .from("MadreDf")
        .delete()
        .eq("idMadre", idMadre);
      if (madreError) console.warn(`⚠️ No se encontró madre:`, madreError.message);
    }
    if (id_padre) {
      const { error: padreError } = await supabase
        .from("PadreFamilia")
        .delete()
        .eq("id_padre", id_padre);
      if (padreError) console.warn(`⚠️ No se encontró padre:`, padreError.message);
    }

    alert("✅ Alumno y todos sus datos relacionados eliminados correctamente");
    fetchAlumnos();
  } catch (err: any) {
    console.error("❌ Error al eliminar alumno:", err);
    alert(`❌ Error al eliminar: ${err.message}`);
  }
};


  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-center">Eliminar Alumno</h2>
      {alumnos.length === 0 ? (
        <p className="text-center text-gray-600">No hay alumnos registrados.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300 rounded">
            <thead>
              <tr className="bg-pink-600 text-white">
                <th className="py-2 px-4 border">Nombre completo</th>
                <th className="py-2 px-4 border">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {alumnos.map((al) => (
                <tr key={al.id_alumno} className="text-center border-t">
                  <td className="py-2 px-4">
                    {al.nombre} {al.apellido_paterno} {al.apellido_materno}
                  </td>
                  <td className="py-2 px-4">
                    <button
                      onClick={() => eliminarAlumno(al.id_alumno)}
                      className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition"
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
