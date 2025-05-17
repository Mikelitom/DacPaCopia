"use client";
import React, { useEffect, useState } from "react";
import { supabase } from "@/app/lib/supabaseclient";

interface Pedido {
    id_pedido: number;
    id_alumno: number;
    fecha: string;
    total: number;
    estado: string;
    Alumno?: {
      nombre: string;
    };
    articulos?: {
      cantidad: number;
      Articulo?: {
        nombre: string;
        descripcion: string;
      };
    }[];
  }
  
  

const opcionesEstado = [
  "Recibido",
  "En proceso",
  "Listo para entrega",
  "Entregado",
];

const tabs = [
  { id: "Recibido", label: "Recibidos" },
  { id: "En proceso", label: "En Proceso" },
  { id: "Listo para entrega", label: "Listos para Entrega" },
  { id: "Entregado", label: "Entregados" },
];

export default function Pedidos() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [actualizado, setActualizado] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<string>("Recibido");

  useEffect(() => {
    const fetchPedidos = async () => {
        const { data, error } = await supabase
        .from("Pedido")
        .select(`
            id_pedido,
            id_alumno,
            fecha,
            total,
            estado,
            Alumno (
            nombre
            ),
            articulos:PedidoArticulo (
            cantidad,
            Articulo (
                nombre,
                descripcion
            )
            )
        `);
        //const { data, error } = await supabase.from("Pedido").select("*");
      if (error) {
        console.error("Error al obtener pedidos:", error);
        return;
      }
      // 🛠️ Convertir PadreFamilia de array a objeto si es necesario
      const pedidosFormateados = data.map((pedido: any) => ({
        ...pedido,
        Alumno: Array.isArray(pedido.Alumno) ? pedido.Alumno[0] : pedido.Alumno,
        articulos: Array.isArray(pedido.articulos)
        ? pedido.articulos.map((pa: any) => ({
            cantidad: pa.cantidad,
            Articulo: Array.isArray(pa.Articulo) ? pa.Articulo[0] : pa.Articulo,
            }))
        : [],
      }));
      
  
      setPedidos(pedidosFormateados);
    };
  
    fetchPedidos();
  }, []);
  const actualizarEstado = async (id_pedido: number, nuevoEstado: string) => {
    const { error } = await supabase
      .from("Pedido")
      .update({ estado: nuevoEstado })
      .eq("id_pedido", id_pedido);

    if (error) {
      console.error("Error al actualizar estado:", error);
      alert("Ocurrió un error al actualizar el estado.");
      return;
    }

    setPedidos((prev) =>
      prev.map((p) =>
        p.id_pedido === id_pedido ? { ...p, estado: nuevoEstado } : p
      )
    );

    alert(`✅ Estado del pedido #${id_pedido} actualizado a "${nuevoEstado}".`);
    setActualizado(id_pedido);
    setTimeout(() => setActualizado(null), 2000);
  };

  const renderTabla = (pedidosFiltrados: Pedido[]) => (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-[#FFE0E3] text-pink-800 text-sm font-semibold">
            <tr>
              <th className="px-6 py-3 text-left">ID Pedido</th>
              <th className="px-6 py-3 text-left">Alumno</th>
              <th className="px-6 py-3 text-left">Fecha</th>
              <th className="px-6 py-3 text-left">Articulo</th>
              <th className="px-6 py-3 text-left">Total</th>
              <th className="px-6 py-3 text-left">Estado</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100 text-sm">
            {pedidosFiltrados.map((pedido) => (
              <tr
                key={pedido.id_pedido}
                className="hover:bg-pink-50 transition duration-200"
              >
                <td className="px-6 py-4">{pedido.id_pedido}</td>
                <td className="px-6 py-4">{pedido.Alumno?.nombre || "Sin nombre"}</td>
                <td className="px-6 py-4">{pedido.fecha}</td>
                <td className="px-6 py-4">
                {(pedido.articulos ?? []).length > 0
                    ? pedido.articulos!.map((pa: any) =>
                    `${pa.Articulo?.nombre || "?"} x${pa.cantidad}${
                            pa.Articulo?.descripcion ? ` (${pa.Articulo.descripcion})` : ""
                            }`
                    ).join(", ")
                    : "Sin artículos"}
                </td>
                <td className="px-6 py-4">${pedido.total}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <select
                      value={pedido.estado}
                      onChange={(e) =>
                        actualizarEstado(pedido.id_pedido, e.target.value)
                      }
                      className={`border rounded-md px-2 py-1 text-sm bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-300 ${
                        actualizado === pedido.id_pedido
                          ? "bg-green-100 border-green-500"
                          : "border-gray-300"
                      }`}
                    >
                      {opcionesEstado.map((estado) => (
                        <option key={estado} value={estado}>
                          {estado}
                        </option>
                      ))}
                    </select>
                    {actualizado === pedido.id_pedido && (
                      <span className="text-green-600 font-medium">✓</span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {pedidosFiltrados.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center text-gray-400 py-6">
                  No hay pedidos en esta sección.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
  

  const pedidosFiltrados = pedidos.filter((p) => p.estado === activeTab);

  return (
    <div className="p-6 rounded-xl border border-gray-300 shadow-sm bg-white">
      <h2 className="text-3xl font-bold text-pink-700 mb-6 text-center">
        Gestión de Pedidos
      </h2>

      <div className="flex flex-wrap gap-4 justify-center mb-6">
        {tabs.map((tab) => (
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

      {renderTabla(pedidosFiltrados)}
    </div>
  );
}
