"use client";

import { useState } from "react";
import AggUs from "./AggUs";
import DeleteUs from "./DeleteUs";
import EditUs from "./EditUs";

export default function RegistrerUs() {
  const [activeTab, setActiveTab] = useState<"alta" | "baja" | "editar">("alta");

  return (
    <div className="p-6 rounded-xl border border-gray-300 shadow-sm bg-white">
      {/* Tabs de navegación */}
      <div className="flex flex-wrap gap-4 mb-6">
        {[
          { id: "alta", label: "Registrar Usuario" },
          { id: "baja", label: "Eliminar Usuario" },
          { id: "editar", label: "Editar Usuario" },
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
        {activeTab === "alta" && <AggUs />}
        {activeTab === "baja" && <DeleteUs />}
        {activeTab === "editar" && <EditUs />}
      </div>
    </div>
  );
}
