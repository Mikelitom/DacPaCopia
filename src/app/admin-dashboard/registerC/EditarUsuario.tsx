"use client";

import { useState } from "react";
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

export default function EditarUsuario() {
  const [correoBusqueda, setCorreoBusqueda] = useState("");
  const [usuario, setUsuario] = useState<Usuario | null>(null);

  const buscarUsuario = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!correoBusqueda) return;

    const { data, error } = await supabase
      .from("Usuario")
      .select("*")
      .eq("correo", correoBusqueda)
      .single();

    if (error) {
      alert("❌ Usuario no encontrado.");
      setUsuario(null);
      console.error(error);
    } else {
      setUsuario(data);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (!usuario) return;
    const { name, value } = e.target;
    setUsuario({ ...usuario, [name]: value });
  };

  const actualizarUsuario = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!usuario) return;

    const { error } = await supabase
      .from("Usuario")
      .update({
        nombre_completo: usuario.nombre_completo,
        teléfono: usuario.teléfono,
        departamento: usuario.departamento,
        rol: usuario.rol,
      })
      .eq("id_usuario", usuario.id_usuario);

    if (error) {
      console.error("❌ Error actualizando:", error.message);
      alert(`❌ Error: ${error.message}`);
    } else {
      alert("✅ Usuario actualizado correctamente.");
      setUsuario(null);
      setCorreoBusqueda("");
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-center">Editar Usuario</h2>

      {/* Buscar Usuario */}
      <form onSubmit={buscarUsuario} className="flex gap-2 items-center justify-center">
        <input
          type="email"
          value={correoBusqueda}
          onChange={(e) => setCorreoBusqueda(e.target.value)}
          placeholder="Correo del usuario"
          className="p-2 border border-gray-300 rounded w-64"
        />
        <button type="submit" className="bg-pink-600 text-white px-4 py-2 rounded hover:bg-pink-700 transition">
          Buscar
        </button>
      </form>

      {/* Editar Usuario */}
      {usuario && (
        <form onSubmit={actualizarUsuario} className="space-y-4 max-w-md mx-auto">
          <div>
            <label className="block font-medium mb-1">Nombre Completo</label>
            <input
              type="text"
              name="nombre_completo"
              value={usuario.nombre_completo}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Teléfono</label>
            <input
              type="text"
              name="teléfono"
              value={usuario.teléfono}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Departamento</label>
            <select
              name="departamento"
              value={usuario.departamento || ""}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            >
              <option value="">Seleccione</option>
              <option value="Secretario">Secretario</option>
              <option value="Tesorero">Tesorero</option>
              <option value="Director">Director</option>
            </select>
          </div>

          <div>
            <label className="block font-medium mb-1">Rol</label>
            <select
              name="rol"
              value={usuario.rol || ""}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            >
              <option value="">Seleccione</option>
              <option value="Administrador">Administrador</option>
              <option value="Padre">Padre</option>
            </select>
          </div>

          <div className="text-center">
            <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition">
              Actualizar Usuario
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
