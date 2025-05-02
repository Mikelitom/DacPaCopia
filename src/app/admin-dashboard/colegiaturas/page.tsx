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
      // Puedes agregar más pagos aquí
    ];
  
    return (
      <div>
        <h1 className="text-2xl font-bold mb-4">PAGOS RECIENTES DE COLEGIATURAS</h1>
        <p className="mb-6">AQUI VA LA VISTA DE PAGOS REALIZADOS.</p>
  
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
              {pagos.map((pago, index) => (
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
            </tbody>
          </table>
        </div>
      </div>
    );
  }