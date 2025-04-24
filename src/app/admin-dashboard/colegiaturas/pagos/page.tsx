'use client';


import { useState } from 'react';

export default function colegiaturasPage() {
  const pagos = [
    {
      fecha: '2025-04-05',
      concepto: 'Pago de Abril',
      estudiante: 'Juan Pérez',
      monto: '$1,200.00',
      estado: 'Pagado',
      referencia: 'ABC12345',
    },
    {
      fecha: '2025-03-05',
      concepto: 'Pago de Marzo',
      estudiante: 'Lucía González',
      monto: '$1,200.00',
      estado: 'Pagado',
      referencia: 'XYZ67890',
    },
    // Agrega más pagos aquí
  ];

  const [mesSeleccionado, setMesSeleccionado] = useState('');
  const [añoSeleccionado, setAñoSeleccionado] = useState('');

  const pagosFiltrados = pagos.filter((pago) => {
    const fecha = new Date(pago.fecha);
    const mes = (fecha.getMonth() + 1).toString().padStart(2, '0'); // Mes en formato '01', '02'...
    const año = fecha.getFullYear().toString();

    return (
      (mesSeleccionado === '' || mes === mesSeleccionado) &&
      (añoSeleccionado === '' || año === añoSeleccionado)
    );
  });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">PAGOS RECIENTES DE COLEGIATURAS</h1>

      {/* Filtros */}
      <div className="mb-6 flex flex-wrap gap-4">
        <div>
          <label className="block text-sm font-medium">Mes</label>
          <select
            value={mesSeleccionado}
            onChange={(e) => setMesSeleccionado(e.target.value)}
            className="border px-3 py-1 rounded"
          >
            <option value="">Todos</option>
            <option value="01">Enero</option>
            <option value="02">Febrero</option>
            <option value="03">Marzo</option>
            <option value="04">Abril</option>
            <option value="05">Mayo</option>
            <option value="06">Junio</option>
            <option value="07">Julio</option>
            <option value="08">Agosto</option>
            <option value="09">Septiembre</option>
            <option value="10">Octubre</option>
            <option value="11">Noviembre</option>
            <option value="12">Diciembre</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium">Año</label>
          <select
            value={añoSeleccionado}
            onChange={(e) => setAñoSeleccionado(e.target.value)}
            className="border px-3 py-1 rounded"
          >
            <option value="">Todos</option>
            <option value="2025">2025</option>
            <option value="2024">2024</option>
            <option value="2023">2023</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300 rounded-md shadow-sm">
          <thead>
            <tr className="bg-pink-200 text-left text-sm font-semibold text-gray-700">
              <th className="px-4 py-2 border">Fecha</th>
              <th className="px-4 py-2 border">Concepto</th>
              <th className="px-4 py-2 border">Estudiante</th>
              <th className="px-4 py-2 border">Monto</th>
              <th className="px-4 py-2 border">Estado</th>
              <th className="px-4 py-2 border">Referencia</th>
              <th className="px-4 py-2 border">Comprobante</th>
            </tr>
          </thead>
          <tbody>
            {pagosFiltrados.map((pago, index) => (
              <tr key={index} className="text-sm text-gray-800">
                <td className="px-4 py-2 border">{pago.fecha}</td>
                <td className="px-4 py-2 border">{pago.concepto}</td>
                <td className="px-4 py-2 border">{pago.estudiante}</td>
                <td className="px-4 py-2 border">{pago.monto}</td>
                <td className="px-4 py-2 border text-green-600 font-semibold">{pago.estado}</td>
                <td className="px-4 py-2 border">{pago.referencia}</td>
                <td className="px-4 py-2 border">
                  <button className="bg-pink-500 hover:bg-pink-600 text-white text-xs px-3 py-1 rounded">
                    Descargar PDF
                  </button>
                </td>
              </tr>
            ))}
            {pagosFiltrados.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center py-4 text-gray-500">
                  No hay pagos en este mes y año seleccionados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
