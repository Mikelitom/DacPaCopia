"use client";

import { useState } from "react";
import AltaUsuario from "./AltaUsuario";
import EditarUsuario from "./EditarUsuario";
import ListaUsuarios from "./ListaUsuarios";

export default function RegistrerCollab() {
  const [activeTab, setActiveTab] = useState<"alta" | "baja" | "editar">("alta");

  return (
    <div className="max-w-5xl mx-auto p-6">
      {/* Tabs de navegación */}
      <div className="flex space-x-4 mb-6">
  <button
    onClick={() => setActiveTab("alta")}
    className={`px-4 py-2 font-bold rounded ${
      activeTab === "alta"
        ? "bg-pink-600 text-white"
        : "bg-pink-300 text-pink-900"
    }`}
  >
    Registrar Usuario
  </button>

  <button
    onClick={() => setActiveTab("baja")}
    className={`px-4 py-2 font-bold rounded ${
      activeTab === "baja"
        ? "bg-pink-600 text-white"
        : "bg-pink-300 text-pink-900"
    }`}
  >
    Eliminar Usuario
  </button>

  <button
    onClick={() => setActiveTab("editar")}
    className={`px-4 py-2 font-bold rounded ${
      activeTab === "editar"
        ? "bg-pink-600 text-white"
        : "bg-pink-300 text-pink-900"
    }`}
  >
    Editar Usuario
  </button>
</div>


      {/* Contenido de cada tab */}
      <div className="bg-white p-6 rounded-lg shadow">
        {activeTab === "alta" && <AltaUsuario />}
        {activeTab === "baja" && <ListaUsuarios />}
        {activeTab === "editar" && <EditarUsuario />}
      </div>
    </div>
  );
}
