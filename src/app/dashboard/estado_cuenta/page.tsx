// Importa componentes necesarios para la interfaz de usuario
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card"; // Componentes de tarjeta
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs"; // Componentes de pestañas
import { Badge } from "@/app/components/ui/badge"; // Componente para mostrar etiquetas
import { Download, FileText, ShoppingBag } from "lucide-react"; // Importa íconos de lucide-react

// Componente principal para la página de estado de cuenta
export default function EstadoCuentaPage() {
  // Datos de ejemplo para pagos de colegiaturas
  const pagosColegiaturas = [
    {
      id: 1,
      fecha: "05/01/2024",
      concepto: "Colegiatura Enero 2024",
      estudiante: "Ana Pérez González",
      monto: 1500.0,
      estado: "Pagado",
      referencia: "PAG-2024-001",
    },
    {
      id: 2,
      fecha: "03/02/2024",
      concepto: "Colegiatura Febrero 2024",
      estudiante: "Ana Pérez González",
      monto: 1500.0,
      estado: "Pagado",
      referencia: "PAG-2024-015",
    },
    {
      id: 3,
      fecha: "05/02/2024",
      concepto: "Colegiatura Febrero 2024",
      estudiante: "Carlos Pérez González",
      monto: 1500.0,
      estado: "Pagado",
      referencia: "PAG-2024-016",
    },
    {
      id: 4,
      fecha: "02/03/2024",
      concepto: "Colegiatura Marzo 2024",
      estudiante: "Ana Pérez González",
      monto: 1500.0,
      estado: "Pagado",
      referencia: "PAG-2024-032",
    },
    {
      id: 5,
      fecha: "04/03/2024",
      concepto: "Colegiatura Marzo 2024",
      estudiante: "Carlos Pérez González",
      monto: 1500.0,
      estado: "Pagado",
      referencia: "PAG-2024-033",
    },
    {
      id: 6,
      fecha: "03/04/2024",
      concepto: "Colegiatura Abril 2024",
      estudiante: "Ana Pérez González",
      monto: 1500.0,
      estado: "Pagado",
      referencia: "PAG-2024-045",
    },
    {
      id: 7,
      fecha: "05/04/2024",
      concepto: "Colegiatura Abril 2024",
      estudiante: "Carlos Pérez González",
      monto: 1500.0,
      estado: "Pagado",
      referencia: "PAG-2024-046",
    },
  ]

  const comprasProductos = [
    {
      id: 1,
      fecha: "15/01/2024",
      concepto: "Paquete de Libros 1er Grado",
      estudiante: "Ana Pérez González",
      monto: 2500.0,
      estado: "Entregado",
      referencia: "PROD-2024-001",
    },
    {
      id: 2,
      fecha: "15/01/2024",
      concepto: "Paquete de Libros 3er Grado",
      estudiante: "Carlos Pérez González",
      monto: 2800.0,
      estado: "Entregado",
      referencia: "PROD-2024-002",
    },
    {
      id: 3,
      fecha: "20/01/2024",
      concepto: "Uniforme Deportivo",
      estudiante: "Ana Pérez González",
      monto: 850.0,
      estado: "Entregado",
      referencia: "PROD-2024-015",
    },
    {
      id: 4,
      fecha: "20/01/2024",
      concepto: "Uniforme Deportivo",
      estudiante: "Carlos Pérez González",
      monto: 950.0,
      estado: "Entregado",
      referencia: "PROD-2024-016",
    },
    {
      id: 5,
      fecha: "10/02/2024",
      concepto: "Uniforme de Gala",
      estudiante: "Ana Pérez González",
      monto: 1200.0,
      estado: "Entregado",
      referencia: "PROD-2024-030",
    },
    {
      id: 6,
      fecha: "10/02/2024",
      concepto: "Uniforme de Gala",
      estudiante: "Carlos Pérez González",
      monto: 1300.0,
      estado: "Entregado",
      referencia: "PROD-2024-031",
    },
  ]

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Estado de Cuenta</h1>

      <Tabs defaultValue="colegiaturas">
        <TabsList className="mb-4">
          <TabsTrigger value="colegiaturas" className="flex items-center">
            <FileText className="mr-2 h-4 w-4" />
            Colegiaturas
          </TabsTrigger>
          <TabsTrigger value="productos" className="flex items-center">
            <ShoppingBag className="mr-2 h-4 w-4" />
            Productos
          </TabsTrigger>
        </TabsList>

        <TabsContent value="colegiaturas">
          <Card>
            <CardHeader>
              <CardTitle>Historial de Pagos de Colegiatura</CardTitle>
              <CardDescription>Registro de todos los pagos de colegiatura realizados</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-100 text-left">
                      <th className="p-3 border-b">Fecha</th>
                      <th className="p-3 border-b">Concepto</th>
                      <th className="p-3 border-b">Estudiante</th>
                      <th className="p-3 border-b">Monto</th>
                      <th className="p-3 border-b">Estado</th>
                      <th className="p-3 border-b">Referencia</th>
                      <th className="p-3 border-b">Comprobante</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pagosColegiaturas.map((pago) => (
                      <tr key={pago.id} className="border-b hover:bg-gray-50">
                        <td className="p-3">{pago.fecha}</td>
                        <td className="p-3">{pago.concepto}</td>
                        <td className="p-3">{pago.estudiante}</td>
                        <td className="p-3">${pago.monto.toFixed(2)}</td>
                        <td className="p-3">
                          <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">
                            {pago.estado}
                          </Badge>
                        </td>
                        <td className="p-3">{pago.referencia}</td>
                        <td className="p-3">
                          <button className="text-blue-600 hover:text-blue-800 flex items-center">
                            <Download className="h-4 w-4 mr-1" />
                            PDF
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="productos">
          <Card>
            <CardHeader>
              <CardTitle>Historial de Compras de Productos</CardTitle>
              <CardDescription>Registro de todas las compras de uniformes y libros</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-100 text-left">
                      <th className="p-3 border-b">Fecha</th>
                      <th className="p-3 border-b">Concepto</th>
                      <th className="p-3 border-b">Estudiante</th>
                      <th className="p-3 border-b">Monto</th>
                      <th className="p-3 border-b">Estado</th>
                      <th className="p-3 border-b">Referencia</th>
                      <th className="p-3 border-b">Factura</th>
                    </tr>
                  </thead>
                  <tbody>
                    {comprasProductos.map((compra) => (
                      <tr key={compra.id} className="border-b hover:bg-gray-50">
                        <td className="p-3">{compra.fecha}</td>
                        <td className="p-3">{compra.concepto}</td>
                        <td className="p-3">{compra.estudiante}</td>
                        <td className="p-3">${compra.monto.toFixed(2)}</td>
                        <td className="p-3">
                          <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">
                            {compra.estado}
                          </Badge>
                        </td>
                        <td className="p-3">{compra.referencia}</td>
                        <td className="p-3">
                          <button className="text-blue-600 hover:text-blue-800 flex items-center">
                            <Download className="h-4 w-4 mr-1" />
                            PDF
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
