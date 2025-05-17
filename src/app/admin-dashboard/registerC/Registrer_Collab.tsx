"use client";

import { useState } from "react";
import AltaUsuario from "./usuarios/alta/page";
import ListaUsuarios from "./usuarios/listayeliminar/page";
import BajaAlumno from "./alumno/baja/page";
import EditarUsuario from "./alumno/editar/page";
import EditarAlumno from "./alumno/editar/page";

export default function RegistrerCollab() {
  const [activeTab, setActiveTab] = useState<"alta" | "baja" | "bajaAlumno" | "editar" | "editarAlumno">("alta");

  return (
    <div className="p-6 rounded-xl border border-gray-300 shadow-sm bg-white">
      {/* Tabs de navegación */}
      <div className="flex flex-wrap gap-4 mb-6">
        {[
          { id: "alta", label: "Registrar Usuario" },
          { id: "baja", label: "Eliminar Usuario" },
          { id: "bajaAlumno", label: "Eliminar Alumno" },
          { id: "editar", label: "Editar Usuario" },
          { id: "editarAlumno", label: "Datos Alumno" }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-6 py-2 rounded-full border transition-colors duration-200 ${
              activeTab === tab.id
                ? "bg-[#FFE0E3] border-[#ffccd4] text-black font-semibold"
                : "bg-white border-gray-300 text-gray-700 hover:bg-gray-100"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Contenido dinámico */}
      <div className="mt-6">
        {activeTab === "alta" && <AltaUsuario />}
        {activeTab === "baja" && <ListaUsuarios />}
        {activeTab === "bajaAlumno" && <BajaAlumno />}
        {activeTab === "editar" && <EditarUsuario />}
        {activeTab === "editarAlumno" && <EditarAlumno />}
      </div>
    </div>
  );
}
