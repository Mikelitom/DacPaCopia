"use client";

import React from "react";
import { useEditarUsuario } from "./hooks/EditarUsuario";

export default function Page() {
  const {
    correoBusqueda,
    setCorreoBusqueda,
    usuario,
    buscarUsuario,
    handleChange,
    actualizarUsuario,
  } = useEditarUsuario();

  return (
    <div className="p-6 rounded-xl border border-gray-300 shadow-sm bg-white max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center text-pink-700">
        Editar Usuario
      </h2>

      <form
        onSubmit={buscarUsuario}
        className="flex gap-2 items-center justify-center mb-6"
      >
        <input
          type="email"
          value={correoBusqueda}
          onChange={(e) => setCorreoBusqueda(e.target.value)}
          placeholder="Correo del usuario"
          required
          className="p-3 border border-gray-300 rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-pink-400"
        />
        <button
          type="submit"
          className="bg-[#FFE0E3] hover:bg-[#ffccd4] text-black font-semibold py-2 px-4 rounded-lg transition"
        >
          Buscar
        </button>
      </form>

      {usuario && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            actualizarUsuario();
          }}
          className="space-y-5"
        >
          <div>
            <label className="block font-medium mb-1 text-gray-700">
              Nombre Completo
            </label>
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
