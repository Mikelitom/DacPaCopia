'use client'

import { useState } from 'react'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/app/components/ui/tabs'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/app/components/ui/card'
import { Button } from '@/app/components/ui/button'
import { Input } from '@/app/components/ui/input'
import { Label } from '@/app/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select'
import { CreditCard, CheckCircle2 } from 'lucide-react'


export default function PagosPage() {
  const [estudiante, setEstudiante] = useState('')
  const [metodo, setMetodo] = useState('tarjeta')
  const [monto, setMonto] = useState('1500.00')
  const [pagando, setPagando] = useState(false)
  const [pagado, setPagado] = useState(false)
  const [mesSeleccionado, setMesSeleccionado] = useState('')
  const [añoSeleccionado, setAñoSeleccionado] = useState('')

  const estudiantes = [
    { id: 'est1', nombre: 'Ana Pérez González', grado: '1°A', monto: '1500.00' },
    { id: 'est2', nombre: 'Carlos Pérez González', grado: '3°B', monto: '1500.00' },
  ]

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
  ]

  const pagosFiltrados = pagos.filter((pago) => {
    const fecha = new Date(pago.fecha)
    const mes = (fecha.getMonth() + 1).toString().padStart(2, '0')
    const año = fecha.getFullYear().toString()
    return (
      (mesSeleccionado === '' || mes === mesSeleccionado) &&
      (añoSeleccionado === '' || año === añoSeleccionado)
    )
  })

  const handlePagar = () => {
    setPagando(true)
    setTimeout(() => {
      setPagando(false)
      setPagado(true)
      setTimeout(() => {
        setPagado(false)
      }, 3000)
    }, 2000)
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <Tabs defaultValue="pago">
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
                <option value="2025">2025</option>
                <option value="2024">2024</option>
                <option value="2023">2023</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-300 rounded-md shadow-sm text-sm">
              <thead className="bg-pink-200 text-left font-semibold text-gray-700">
                <tr>
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
                {pagosFiltrados.length > 0 ? pagosFiltrados.map((pago, index) => (
                  <tr key={index} className="text-gray-800">
                    <td className="px-4 py-2 border">{pago.fecha}</td>
                    <td className="px-4 py-2 border">{pago.concepto}</td>
                    <td className="px-4 py-2 border">{pago.estudiante}</td>
                    <td className="px-4 py-2 border">{pago.monto}</td>
                    <td className="px-4 py-2 border text-green-600 font-semibold">{pago.estado}</td>
                    <td className="px-4 py-2 border">{pago.referencia}</td>
                    <td className="px-4 py-2 border">
                      <button className="bg-pink-500 hover:bg-pink-600 text-white text-xs px-3 py-1 rounded">Descargar PDF</button>
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
                  <th className="px-4 py-2 border">Fecha del Adeudo</th>
                  <th className="px-4 py-2 border">Monto</th>
                  <th className="px-4 py-2 border">Referencia</th>
                  <th className="px-4 py-2 border">Enviar Mensaje</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="px-4 py-2 border">Juan Pérez</td>
                  <td className="px-4 py-2 border">2025-04-01</td>
                  <td className="px-4 py-2 border">$1,200</td>
                  <td className="px-4 py-2 border">REF12345</td>
                  <td className="px-4 py-2 border">
                    <button className="bg-pink-500 hover:bg-pink-600 text-white text-xs px-3 py-1 rounded">Enviar correo</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

