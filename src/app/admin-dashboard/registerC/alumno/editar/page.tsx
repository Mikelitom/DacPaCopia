// editar/page.tsx
"use client";

import React from "react";
import { useEditarAlumno } from "./hooks/useEditarAlumno";

export default function EditarAlumnoPage() {
  const { idAlumno, setIdAlumno, datos, error, buscarAlumno } = useEditarAlumno();

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-bold text-pink-600 mb-6 text-center">
        Consulta de Alumno
      </h1>

      <div className="flex gap-4 mb-6">
        <input
          type="text"
          placeholder="ID del alumno"
          className="border px-4 py-2 rounded w-full"
          value={idAlumno}
          onChange={(e) => setIdAlumno(e.target.value)}
        />
        <button
          onClick={buscarAlumno}
          className="bg-pink-500 text-white px-4 py-2 rounded hover:bg-pink-600"
        >
          Buscar
        </button>
      </div>

      {error && <p className="text-red-500 text-center">{error}</p>}

      {datos && (
        <div className="space-y-6">
          <Seccion titulo="👧 Datos Generales">
            <Linea label="Nombre" valor={`${datos.alumno.nombre} ${datos.alumno.apellido_paterno} ${datos.alumno.apellido_materno}`} />
            {/* ...resto de líneas... */}
          </Seccion>
          {/* Repite Seccion/Linea para Contacto, Padre, Madre, Vivienda y Desarrollo */}
        </div>
      )}
    </div>
  );
}

function Seccion({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <div className="border-l-4 border-pink-400 bg-pink-50 p-4 rounded-md shadow-sm">
      <h2 className="text-xl font-bold text-pink-700 mb-2">{titulo}</h2>
      <div className="space-y-1">{children}</div>
    </div>
  );
}

function Linea({ label, valor }: { label: string; valor: string | number | null }) {
  return (
    <p>
      <span className="font-semibold text-gray-700">{label}:</span>{" "}
      <span className="text-gray-900">{valor ?? "No disponible"}</span>
    </p>
  );
}
