"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "../../../lib/supabase";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const meses = [
  { nombre: "Enero", numero: 1 },
  { nombre: "Febrero", numero: 2 },
  { nombre: "Marzo", numero: 3 },
  { nombre: "Abril", numero: 4 },
  { nombre: "Mayo", numero: 5 },
  { nombre: "Junio", numero: 6 },
  { nombre: "Julio", numero: 7 },
  { nombre: "Agosto", numero: 8 },
  { nombre: "Septiembre", numero: 9 },
  { nombre: "Octubre", numero: 10 },
  { nombre: "Noviembre", numero: 11 },
  { nombre: "Diciembre", numero: 12 },
];

const ReportesMensualesColegiaturas = () => {
  const [mesSeleccionado, setMesSeleccionado] = useState(4); // Por defecto Abril
  const [pagos, setPagos] = useState<any[]>([]);

  useEffect(() => {
    obtenerPagos();
  }, []);

  const obtenerPagos = async () => {
    const { data, error } = await supabase
      .from("PagoColegiatura")
      .select(`
        id_alumno,
        monto,
        fecha_pago,
        Alumno (
          nombre,
          apellido_paterno,
          apellido_materno,
          estado
        )
      `);

    if (error) {
      console.error("Error al cargar pagos", error);
    } else {
      setPagos(data || []);
    }
  };

  const pagosFiltrados = pagos.filter((pago) => {
    if (!pago.fecha_pago) return false;
    const fecha = new Date(pago.fecha_pago);
    return fecha.getMonth() + 1 === mesSeleccionado;
  });

  // Generar PDF
  const generarPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.setTextColor("#000000");
    const nombreMes = meses.find((mes) => mes.numero === mesSeleccionado)?.nombre || "";
    doc.text(`Reporte de Colegiaturas - ${nombreMes}`, 10, 20);

    const rows = pagosFiltrados.map((pago) => [
      `${pago.Alumno?.nombre || ""} ${pago.Alumno?.apellido_paterno || ""} ${pago.Alumno?.apellido_materno || ""}`,
      pago.id_alumno,
      pago.Alumno?.estado || "No registrado",
      `$${pago.monto}`,
      pago.fecha_pago,
    ]);

    autoTable(doc, {
      startY: 30,
      head: [["Nombre Completo", "ID Alumno", "Estado", "Monto", "Fecha de Pago"]],
      body: rows,
      headStyles: {
        fillColor: [255, 224, 227],
        textColor: 0,
        fontStyle: 'bold',
        halign: 'center',
      },
      bodyStyles: {
        textColor: 0,
        halign: 'center',
      },
      styles: {
        lineColor: [255, 224, 227],
        fontSize: 11,
      },
      theme: 'striped',
      tableLineColor: [255, 224, 227],
      tableLineWidth: 0.1,
    });

    const pdfBlob = doc.output("blob");
    const url = URL.createObjectURL(pdfBlob);
    window.open(url);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Reportes Mensuales de Colegiaturas</h1>

      {/* Selector de Mes */}
      <div className="flex items-center justify-between mb-6">
        <select
          value={mesSeleccionado}
          onChange={(e) => setMesSeleccionado(parseInt(e.target.value))}
          className="border border-gray-300 rounded-md px-4 py-2"
        >
          {meses.map((mes) => (
            <option key={mes.numero} value={mes.numero}>
              {mes.nombre}
            </option>
          ))}
        </select>

        {/* Botón Generar PDF */}
        <button
          onClick={generarPDF}
          className="ml-4 bg-[#FFE0E3] hover:bg-[#FFE0E3] text-black font-bold py-2 px-4 rounded"
        >
          Generar PDF
        </button>
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto rounded-lg shadow-md">
        <table className="min-w-full bg-white rounded-lg overflow-hidden">
          <thead className="bg-gray-200">
            <tr>
              <th className="border px-4 py-2">Nombre Completo</th>
              <th className="border px-4 py-2">ID Alumno</th>
              <th className="border px-4 py-2">Estado</th>
              <th className="border px-4 py-2">Monto</th>
              <th className="border px-4 py-2">Fecha de Pago</th>
            </tr>
          </thead>
          <tbody>
            {pagosFiltrados.map((pago) => (
              <tr key={`${pago.id_alumno}-${pago.fecha_pago}`}>
                <td className="border px-4 py-2">
                  {`${pago.Alumno?.nombre || ""} ${pago.Alumno?.apellido_paterno || ""} ${pago.Alumno?.apellido_materno || ""}`}
                </td>
                <td className="border px-4 py-2">{pago.id_alumno}</td>
                <td className="border px-4 py-2">{pago.Alumno?.estado || "No registrado"}</td>
                <td className="border px-4 py-2">${pago.monto}</td>
                <td className="border px-4 py-2">{pago.fecha_pago}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReportesMensualesColegiaturas;
