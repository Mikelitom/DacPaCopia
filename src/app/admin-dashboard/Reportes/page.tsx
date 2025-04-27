"use client";

import React, { useState } from "react";
import AlumnosTable from "../Reportes/alumnos";
import ArticulosTable from "../Reportes/articulos";
import ReportesMensualesColegiaturas from "../Reportes/ReporteMes";
export default function Page() {
  const [activeTab, setActiveTab] = useState("alumnos");

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Reportes</h1>

      {/* Menú de Tabs */}
      <div className="flex mb-6 space-x-4">
        <button
          onClick={() => setActiveTab("alumnos")}
          className={`px-4 py-2 rounded ${
            activeTab === "alumnos"
              ? "bg-[#FFE0E3] text-black"
              : "bg-gray-200 text-black"
          }`}
        >
          Alumnos
        </button>
        <button
          onClick={() => setActiveTab("articulos")}
          className={`px-4 py-2 rounded ${
            activeTab === "articulos"
              ? "bg-[#FFE0E3] text-black"
              : "bg-gray-200 text-black"
          }`}
        >
          Produtos
        </button>
        <button
          onClick={() => setActiveTab("ReporteMes")}
          className={`px-4 py-2 rounded ${
            activeTab === "ReporteMes"
              ? "bg-[#FFE0E3] text-black"
              : "bg-gray-200 text-black"
          }`}
        >
          ReprteMes
        </button>
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
            <ArticulosTable/>
          </div>
        )}
        {activeTab === "ReporteMes" && (
          <div>
            <ReportesMensualesColegiaturas/>
          </div>
        )}
      </div>
    </div>
  );
}
