"use client";

import React from "react";
import { useBajaUsuario } from "./hooks/BajaUsuario";

export default function Page() {
  const { usuarios, loading, eliminarUsuario } = useBajaUsuario();

  return (
    <div className="p-6 max-w-6xl mx-auto bg-white rounded-xl shadow-sm border">
      <h1 className="text-2xl font-bold text-pink-700 mb-6 text-center">
        Baja de Usuarios
      </h1>

      {loading ? (
        <p className="text-center">Cargando usuarios...</p>
      ) : usuarios.length === 0 ? (
        <p className="text-center text-gray-600">No hay usuarios registrados.</p>
      ) : (
        <div className="overflow-x-auto rounded-lg shadow-md">
          <table className="min-w-full text-sm text-left border rounded-xl overflow-hidden">
            <thead className="bg-[#f9f9f9] border-b">
              <tr>
                <th className="px-6 py-4 font-semibold">Nombre</th>
                <th className="px-6 py-4 font-semibold">Correo</th>
                <th className="px-6 py-4 font-semibold">Teléfono</th>
                <th className="px-6 py-4 font-semibold">Rol</th>
                <th className="px-6 py-4 font-semibold">Estado</th>
                <th className="px-6 py-4 font-semibold">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {usuarios.map((u) => (
                <tr key={u.id_usuario} className="hover:bg-gray-50">
                  <td className="px-6 py-3">{u.nombre_completo}</td>
                  <td className="px-6 py-3">{u.correo}</td>
                  <td className="px-6 py-3">{u.telefono}</td>
                  <td className="px-6 py-3">{u.rol}</td>
                  <td className="px-6 py-3">{u.estado}</td>
                  <td className="px-6 py-3">
                    <button
                      onClick={() => eliminarUsuario(u.id_usuario)}
                      className="bg-[#FFE0E3] hover:bg-[#ffccd4] font-semibold px-4 py-1 rounded-lg transition"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
