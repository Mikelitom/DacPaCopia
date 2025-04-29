"use client";

import { useEffect, useState } from "react";
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
    if (!confirm("¿Seguro que deseas eliminar este alumno y sus datos relacionados en el orden correcto?")) return;

    try {
      // 0) Obtener referencias de padre y madre antes de borrar anything
      const { data: ref, error: refError } = await supabase
        .from("Alumno")
        .select("id_padre, idMadre")
        .eq("id_alumno", id_alumno)
        .single();
      if (refError || !ref) throw refError || new Error("Alumno no encontrado");
      const { id_padre, idMadre } = ref;

      // 1) Eliminar antecedentes (HistoriaDesarrollo)
      let res = await supabase
        .from("HistoriaDesarrollo")
        .delete()
        .eq("id_alumno", id_alumno);
      if (res.error) throw res.error;

      // 2) Eliminar historial de pagos
      res = await supabase
        .from("HistorialPago")
        .delete()
        .eq("id_alumno", id_alumno);
      if (res.error) throw res.error;

      // 3) Eliminar pagos de colegiatura
      res = await supabase
        .from("PagoColegiatura")
        .delete()
        .eq("id_alumno", id_alumno);
      if (res.error) throw res.error;

      // 4) Eliminar pedidos
      res = await supabase
        .from("Pedido")
        .delete()
        .eq("id_alumno", id_alumno);
      if (res.error) throw res.error;

      // 5) Eliminar convenios
      res = await supabase
        .from("Convenio")
        .delete()
        .eq("id_alumno", id_alumno);
      if (res.error) throw res.error;

      // 6) Eliminar deudores
      res = await supabase
        .from("Deudor")
        .delete()
        .eq("id_alumno", id_alumno);
      if (res.error) throw res.error;

      // 7) Aquí podrías eliminar otras tablas relacionadas si es necesario

      // 8) Eliminar registro del alumno (padre de todas las anteriores)
      res = await supabase
        .from("Alumno")
        .delete()
        .eq("id_alumno", id_alumno);
      if (res.error) throw res.error;

      // 9) Finalmente, eliminar madre y padre
      if (idMadre) {
        res = await supabase
          .from("MadreDf")
          .delete()
          .eq("idMadre", idMadre);
        if (res.error) throw res.error;
      }
      if (id_padre) {
        res = await supabase
          .from("PadreFamilia")
          .delete()
          .eq("id_padre", id_padre);
        if (res.error) throw res.error;
      }

      alert("✅ Todos los datos se eliminaron en el orden correcto.");
      fetchAlumnos();
    } catch (err: any) {
      console.error("❌ Error al eliminar alumno:", err.message);
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
              {alumnos.map(al => (
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
