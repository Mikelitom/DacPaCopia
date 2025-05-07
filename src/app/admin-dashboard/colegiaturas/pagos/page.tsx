'use client'

import { useEffect, useState } from 'react'
<<<<<<< HEAD
import { supabase } from '@/app/lib/supabaseclient'
=======
import { supabase } from '@/app/lib/supabaseClient'
>>>>>>> e8228539c0ec718cfe9e3d939363b35f5f760260
import jsPDF from 'jspdf'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/app/components/ui/tabs'
import {
  Label
} from '@/app/components/ui/label'

export default function PagosPage() {
  const [pagos, setPagos] = useState<any[]>([])
  const [mesSeleccionado, setMesSeleccionado] = useState('')
  const [añoSeleccionado, setAñoSeleccionado] = useState('')
  const [estudiantes, setEstudiantes] = useState<any[]>([])

  useEffect(() => {
    const fetchPagos = async () => {
      const { data, error } = await supabase
        .from('PagoColegiatura')
        .select('*')
        .order('fecha_pago', { ascending: false })

      if (!error) setPagos(data || [])
      else console.error('Error fetching pagos:', error)
    }

    const fetchEstudiantes = async () => {
      const { data, error } = await supabase
        .from('Alumno')
        .select('id, nombre')

      if (!error) setEstudiantes(data || [])
      else console.error('Error fetching alumnos:', error)
    }

    fetchPagos()
    fetchEstudiantes()
  }, [])

  const pagosFiltrados = pagos.filter((pago) => {
    const fecha = new Date(pago.fecha_pago)
    const mes = (fecha.getMonth() + 1).toString().padStart(2, '0')
    const año = fecha.getFullYear().toString()
    return (
      (mesSeleccionado === '' || mes === mesSeleccionado) &&
      (añoSeleccionado === '' || año === añoSeleccionado)
    )
  })

  const fechaLimite = new Date();
  fechaLimite.setDate(fechaLimite.getDate() - 60);

  const alumnosDeudores = estudiantes.filter((alumno) => {
    const pagosAlumno = pagos.filter((p) => p.id_alumno === alumno.id && p.estado?.toLowerCase().trim() === 'pagado');

    if (pagosAlumno.length === 0) {
      return true;
    }

    const ultimoPago = pagosAlumno.reduce((ultimo, actual) => {
      return new Date(actual.fecha_pago) > new Date(ultimo.fecha_pago) ? actual : ultimo;
    }, pagosAlumno[0])

    return new Date(ultimoPago.fecha_pago) < fechaLimite;
  });

  const generarPDF = (pago: any) => {
    const doc = new jsPDF()

    doc.setFontSize(16)
    doc.text('Recibo de Pago', 20, 20)

    doc.setFontSize(12)
    doc.text(`Fecha de Pago: ${pago.fecha_pago}`, 20, 40)
    doc.text(`Concepto: ${pago.concepto}`, 20, 50)
    doc.text(`ID Estudiante: ${pago.id_alumno}`, 20, 60)
    doc.text(`Monto: $${pago.monto?.toFixed(2) || '0.00'}`, 20, 70)
    doc.text(`Método de Pago: ${pago.metodo_pago}`, 20, 80)
    doc.text(`Estado: ${pago.estado}`, 20, 90)

    doc.save(`pago_${pago.id_alumno}_${pago.fecha_pago}.pdf`)
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <Tabs defaultValue="recientes">
        <TabsList className="mb-6">
          <TabsTrigger value="recientes">Pagos Recientes</TabsTrigger>
          <TabsTrigger value="deudores">Deudores</TabsTrigger>
        </TabsList>

        {/* Pagos Recientes */}
        <TabsContent value="recientes">
          <h1 className="text-2xl font-bold mb-4">Pagos Recientes de Colegiaturas</h1>
          <div className="mb-6 flex flex-wrap gap-4">
            <div>
              <Label>Mes</Label>
              <select value={mesSeleccionado} onChange={(e) => setMesSeleccionado(e.target.value)} className="border px-3 py-1 rounded">
                <option value="">Todos</option>
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i + 1} value={String(i + 1).padStart(2, '0')}>
                    {new Date(0, i).toLocaleString('es-MX', { month: 'long' })}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label>Año</Label>
              <select value={añoSeleccionado} onChange={(e) => setAñoSeleccionado(e.target.value)} className="border px-3 py-1 rounded">
                <option value="">Todos</option>
                {[2025, 2024, 2023].map((a) => (
                  <option key={a} value={String(a)}>{a}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-300 rounded-md shadow-sm text-sm">
              <thead className="bg-pink-200 text-left font-semibold text-gray-700">
                <tr>
                  <th className="px-4 py-2 border">Fecha de Pago</th>
                  <th className="px-4 py-2 border">Concepto</th>
                  <th className="px-4 py-2 border">ID Estudiante</th>
                  <th className="px-4 py-2 border">Monto</th>
                  <th className="px-4 py-2 border">Método de Pago</th>
                  <th className="px-4 py-2 border">Estado</th>
                  <th className="px-4 py-2 border">Comprobante</th>
                </tr>
              </thead>
              <tbody>
                {pagosFiltrados.length > 0 ? pagosFiltrados.map((pago, index) => (
                  <tr key={index} className="text-gray-800">
                    <td className="px-4 py-2 border">{pago.fecha_pago}</td>
                    <td className="px-4 py-2 border">{pago.concepto}</td>
                    <td className="px-4 py-2 border">{pago.id_alumno}</td>
                    <td className="px-4 py-2 border">${pago.monto?.toFixed(2) || '0.00'}</td>
                    <td className="px-4 py-2 border">{pago.metodo_pago}</td>
                    <td className="px-4 py-2 border text-green-600 font-semibold">{pago.estado}</td>
                    <td className="px-4 py-2 border">
                      <button className="bg-pink-500 hover:bg-pink-600 text-white text-xs px-3 py-1 rounded" onClick={() => generarPDF(pago)}>Descargar PDF</button>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={7} className="text-center py-4 text-gray-500">No hay pagos en este mes y año seleccionados.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </TabsContent>

        {/* Deudores */}
        <TabsContent value="deudores">
          <h1 className="text-2xl font-bold mb-4">Deudores</h1>
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-300 rounded-lg text-sm">
              <thead className="bg-pink-200">
                <tr>
                  <th className="px-4 py-2 border">Nombre</th>
                  <th className="px-4 py-2 border">Último pago</th>
                  <th className="px-4 py-2 border">Acción</th>
                </tr>
              </thead>
              <tbody>
                {alumnosDeudores.map((alumno, index) => {
                  const pagosAlumno = pagos.filter(p => p.id_alumno === alumno.id && p.estado?.toLowerCase() === 'pagado')
                  const ultimoPago = pagosAlumno.sort((a, b) => new Date(b.fecha_pago).getTime() - new Date(a.fecha_pago).getTime())[0]
                  return (
                    <tr key={index}>
                      <td className="px-4 py-2 border">{alumno.nombre}</td>
                      <td className="px-4 py-2 border">{ultimoPago ? ultimoPago.fecha_pago : 'Sin pagos registrados'}</td>
                      <td className="px-4 py-2 border">
                        <button className="bg-pink-500 hover:bg-pink-600 text-white text-xs px-3 py-1 rounded">Enviar correo</button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
