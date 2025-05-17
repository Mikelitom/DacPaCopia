"use client";

import React from "react";
import { useBajaAlumno } from "./hooks/useBajaAlumno";

export default function Page() {
  const { alumnos, loading, eliminarAlumno } = useBajaAlumno();

  return (
    <div className="p-6 rounded-xl border border-gray-300 shadow-sm bg-white max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-pink-700 mb-6 text-center">
        Baja de Alumnos
      </h1>

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
              {alumnos.map((a) => (
                <tr key={a.id_alumno} className="hover:bg-gray-50">
                  <td className="px-6 py-3">
                    {a.nombre} {a.apellido_paterno} {a.apellido_materno}
                  </td>
                  <td className="px-6 py-3">{a.grado}</td>
                  <td className="px-6 py-3">{a.grupo}</td>
                  <td className="px-6 py-3">
                    <button
                      onClick={() =>
                        eliminarAlumno(a.id_alumno, a.id_padre, a.idMadre)
                      }
                      className="bg-[#FFE0E3] hover:bg-[#ffccd4] font-semibold px-4 py-1 rounded-lg transition"
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
