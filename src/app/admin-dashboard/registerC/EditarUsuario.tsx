"use client";

import { useState } from "react";
import { supabase } from '@/app/lib/supabaseClient'

interface Usuario {
  id_usuario: number;
  nombre_completo: string;
  correo: string;
  telefono: string;
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
    const nuevo = name === "telefono" ? value.replace(/[^0-9]/g, "") : value;
    setUsuario({ ...usuario, [name]: nuevo });
  };

  const actualizarUsuario = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!usuario) return;

    const { error } = await supabase
      .from("Usuario")
      .update({
        nombre_completo: usuario.nombre_completo,
        correo: usuario.correo,
        telefono: usuario.telefono,
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
    <div className="p-6 rounded-xl border border-gray-300 shadow-sm bg-white max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center text-pink-700">Editar Usuario</h2>

      <form onSubmit={buscarUsuario} className="flex gap-2 items-center justify-center mb-6">
        <input
          type="email"
          value={correoBusqueda}
          onChange={(e) => setCorreoBusqueda(e.target.value)}
          placeholder="Correo del usuario"
          className="p-3 border border-gray-300 rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-pink-400"
          required
        />
        <button
          type="submit"
          className="bg-[#FFE0E3] hover:bg-[#ffccd4] text-black font-semibold py-2 px-4 rounded-lg transition"
        >
          Buscar
        </button>
      </form>

      {usuario && (
        <form onSubmit={actualizarUsuario} className="space-y-5">
          <div>
            <label className="block font-medium mb-1 text-gray-700">Nombre Completo</label>
            <input
              type="text"
              name="nombre_completo"
              value={usuario.nombre_completo}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
            />
          </div>

          <div>
            <label className="block font-medium mb-1 text-gray-700">Correo</label>
            <input
              type="email"
              name="correo"
              value={usuario.correo}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
            />
          </div>

          <div>
            <label className="block font-medium mb-1 text-gray-700">Teléfono</label>
            <input
              type="text"
              name="telefono"
              value={usuario.telefono}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
            />
          </div>

          <div>
            <label className="block font-medium mb-1 text-gray-700">Rol</label>
            <select
              name="rol"
              value={usuario.rol || ""}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
            >
              <option value="">Seleccione</option>
              <option value="Madre">Madre</option>
              <option value="Padre">Padre</option>
              <option value="Tutor">Tutor</option>
            </select>
          </div>

          <div className="flex justify-center pt-4">
            <button
              type="submit"
              className="bg-[#FFE0E3] hover:bg-[#ffccd4] text-black font-semibold py-2 px-4 rounded-lg transition"
            >
              Actualizar Usuario
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
