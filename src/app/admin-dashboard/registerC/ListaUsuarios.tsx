"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";

interface Usuario {
  id_usuario: number;
  nombre_completo: string;
  correo: string;
  teléfono: string;
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
    const { data, error } = await supabase
      .from("Usuario")
      .select("*");

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
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-center mb-6">Lista de Usuarios Registrados</h2>
      {usuarios.length === 0 ? (
        <p className="text-center text-gray-600">No hay usuarios registrados.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300 rounded">
            <thead>
              <tr className="bg-pink-600 text-white">
                <th className="py-2 px-4 border">Nombre</th>
                <th className="py-2 px-4 border">Correo</th>
                <th className="py-2 px-4 border">Teléfono</th>
                <th className="py-2 px-4 border">Departamento</th>
                <th className="py-2 px-4 border">Rol</th>
                <th className="py-2 px-4 border">Estado</th>
                <th className="py-2 px-4 border">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((usuario) => (
                <tr key={usuario.id_usuario} className="text-center border-t">
                  <td className="py-2 px-4">{usuario.nombre_completo}</td>
                  <td className="py-2 px-4">{usuario.correo}</td>
                  <td className="py-2 px-4">{usuario.teléfono}</td>
                  <td className="py-2 px-4">{usuario.departamento || "-"}</td>
                  <td className="py-2 px-4">{usuario.rol || "-"}</td>
                  <td className="py-2 px-4">{usuario.estado}</td>
                  <td className="py-2 px-4">
                    <button
                      onClick={() => eliminarUsuario(usuario.id_usuario)}
                      className="bg-pink-600 text-white px-3 py-1 rounded hover:bg-red-700 transition"
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
