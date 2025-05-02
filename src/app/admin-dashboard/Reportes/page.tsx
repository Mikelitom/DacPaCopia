"use client";

import React, { useState } from "react";
import AlumnosTable from "../Reportes/alumnos";
import ArticulosTable from "../Reportes/articulos";
import ReportesMensualesColegiaturas from "../Reportes/ReporteMes";
export default function Page() {
  const [activeTab, setActiveTab] = useState("alumnos");

  return (
    <div className="p-6">
      <div className="flex justify-start items-center space-x-4 mb-6">
        {[
          { id: "alumnos", label: "Alumnos" },
          { id: "articulos", label: "Productos" },
          { id: "ReporteMes", label: "Reporte Mes" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
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

      {/* Contenido de cada pestaña */}
      <div>
        {activeTab === "alumnos" && (
          <div>
            <AlumnosTable />
          </div>
        )}
        {activeTab === "articulos" && (
          <div>
            <ArticulosTable />
          </div>
        )}
        {activeTab === "ReporteMes" && (
          <div>
            <ReportesMensualesColegiaturas />
          </div>
        )}
      </div>
    </div>
  );
}
