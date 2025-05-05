"use client";

import React, { useState, useEffect } from "react";
import { supabase } from '@/app/lib/supabaseClient'
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Library } from "lucide-react";
declare module "jspdf" {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}
const AlumnosTable = () => {
  const [alumnos, setAlumnos] = useState<any[]>([]);
  const [pagos, setPagos] = useState<any[]>([]);

  useEffect(() => {
    obtenerDatos();
  }, []);

  const obtenerDatos = async () => {
    const { data: alumnosData } = await supabase.from("Alumno").select(`
        id_alumno,
        nombre,
        apellido_paterno,
        apellido_materno,
        estado
      `);

    setAlumnos(alumnosData || []);

    const { data: pagosData } = await supabase.from("PagoColegiatura").select(`
        id_alumno,
        monto,
        fecha_pago
      `);

    setPagos(pagosData || []);
  };

  // Buscar todos los pagos de un alumno
  const buscarPagosAlumno = (idAlumno: number) => {
    return pagos.filter((pago) => pago.id_alumno === idAlumno);
  };

  // Generar PDF de pagos
  const generarPDF = (alumno: any) => {
    const pagosAlumno = buscarPagosAlumno(alumno.id_alumno);

    const doc = new jsPDF();

    // Título
    doc.setFontSize(18);
    doc.setTextColor("#000000"); // Cambiar color del texto a FFE0E3
    doc.text(
      `Reporte de Pagos - ${alumno.nombre} ${alumno.apellido_paterno} ${alumno.apellido_materno}`,
      10,
      20
    );

    // Info general
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0); // Regresar a negro para el texto normal
    doc.text(`ID Alumno: ${alumno.id_alumno}`, 10, 30);
    doc.text(`Estado: ${alumno.estado}`, 10, 40);
    doc.text(
      `Fecha de reporte: ${new Date().toLocaleDateString("es-MX")}`,
      10,
      50
    );

    // Tabla de pagos
    const rows = pagosAlumno.map((pago: any) => [
      `$${pago.monto}`,
      pago.fecha_pago,
    ]);

    autoTable(doc, {
      startY: 60,
      head: [["Monto", "Fecha de Pago"]],
      body: rows,
      headStyles: {
        fillColor: [255, 224, 227], // Color FFE0E3 en formato RGB
        textColor: 0, // Texto negro en cabecera
      },
      styles: {
        lineColor: [255, 224, 227], // Color FFE0E3 para líneas
        textColor: 0, // Texto negro en el cuerpo
      },
    });

    // Abrir el PDF en nueva pestaña
    const pdfBlob = doc.output("blob");
    const url = URL.createObjectURL(pdfBlob);
    window.open(url);
  };

  return (
    <div className="overflow-x-auto p-6 rounded-xl border border-gray-300 shadow-sm bg-white-lg shadow-md">
      <table className="min-w-full bg-min-w-full text-sm text-left border rounded-xl overflow-hidden rounded-lg overflow-hidden">
        <thead className="bg-bg-[#f9f9f9] border-b-1">
          <tr>
            <th className="px-6 py-4 font-semibold">Nombre Completo</th>
            <th className="px-6 py-4 font-semibold">ID Alumno</th>
            <th className="px-6 py-4 font-semibold">Estado</th>
            <th className="px-6 py-4 font-semibold">Monto Último</th>
            <th className="px-6 py-4 font-semibold2">Último Pago</th>
            <th className="px-6 py-4 font-semibold">Reporte</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {alumnos.map((alumno) => {
            const pagosAlumno = buscarPagosAlumno(alumno.id_alumno);
            const pagoReciente = pagosAlumno.reduce(
              (a: any, b: any) =>
                new Date(a.fecha_pago) > new Date(b.fecha_pago) ? a : b,
              pagosAlumno[0]
            );

            return (
              <tr key={alumno.id_alumno}  className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  {`${alumno.nombre} ${alumno.apellido_paterno} ${alumno.apellido_materno}`}
                </td>
                <td className="px-6 py-4">{alumno.id_alumno}</td>
                <td className="px-6 py-4"> {alumno.estado}</td>
                <td className="px-6 py-4">
                  {pagoReciente ? `$${pagoReciente.monto}` : "No registrado"}
                </td>
                <td className="px-6 py-4">
                  {pagoReciente ? pagoReciente.fecha_pago : "No registrado"}
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => generarPDF(alumno)}
                    className="bg-[#FFE0E3] hover:bg-[#ffccd4] text-black font-semibold px-4 py-1 rounded-lg"
                  >
                    PDF
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default AlumnosTable;
