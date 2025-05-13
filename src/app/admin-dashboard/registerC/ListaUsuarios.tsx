"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseclient";

interface Usuario {
  id_usuario: number;
  nombre_completo: string;
  correo: string;
  telefono: string;
  departamento: string | null;
  rol: string | null;
  estado: string;
}

export default function ListaUsuarios() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const fetchUsuarios = async () => {
    const { data, error } = await supabase.from("Usuario").select("*");

    if (error) {
      console.error("❌ Error al obtener usuarios:", error.message);
    } else {
      setUsuarios(data || []);
    }
  };

  const eliminarUsuario = async (id_usuario: number) => {
    const confirmacion = confirm("¿Seguro que deseas eliminar este usuario?");
    if (!confirmacion) return;

    const { error } = await supabase
      .from("Usuario")
      .delete()
      .eq("id_usuario", id_usuario);

    if (error) {
      console.error("❌ Error al eliminar usuario:", error.message);
      alert(`❌ Error al eliminar: ${error.message}`);
    } else {
      alert("✅ Usuario eliminado correctamente.");
      fetchUsuarios();
    }
  };

  return (
    <div className="p-6 rounded-xl border border-gray-300 shadow-sm bg-white max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold text-center text-pink-700 mb-6">
        Lista de Usuarios Registrados
      </h2>

      {usuarios.length === 0 ? (
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
              {usuarios.map((usuario) => (
                <tr key={usuario.id_usuario} className="hover:bg-gray-50">
                  <td className="px-6 py-3">{usuario.nombre_completo}</td>
                  <td className="px-6 py-3">{usuario.correo}</td>
                  <td className="px-6 py-3">{usuario.telefono}</td>
                  <td className="px-6 py-3">{usuario.rol || "-"}</td>
                  <td className="px-6 py-3">{usuario.estado}</td>
                  <td className="px-6 py-3">
                    <button
                      onClick={() => eliminarUsuario(usuario.id_usuario)}
                      className="bg-[#FFE0E3] hover:bg-[#ffccd4] text-black font-semibold px-4 py-1 rounded-lg transition"
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
