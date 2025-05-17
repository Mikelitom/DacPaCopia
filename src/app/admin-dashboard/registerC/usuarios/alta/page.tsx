"use client";

import React from "react";
import { useAltaUsuario } from "./hooks/useAltaUsuario";

export default function Page() {
  const { formData, loading, handleChange, handleSubmit } =
    useAltaUsuario();

  return (
    <div className="p-6 rounded-xl border border-gray-300 shadow-sm bg-white max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center text-pink-700">
        Registro de Usuario
      </h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        <Input
          name="nombre_completo"
          placeholder="Nombre Completo"
          value={formData.nombre_completo}
          onChange={handleChange}
        />
        <Input
          name="correo"
          type="email"
          placeholder="Correo Electrónico"
          value={formData.correo}
          onChange={handleChange}
        />
        <Input
          name="telefono"
          placeholder="Teléfono"
          value={formData.telefono}
          onChange={handleChange}
        />

        <div>
          <label
            htmlFor="rol"
            className="block font-medium mb-1 text-gray-700"
          >
            Rol
          </label>
          <select
            id="rol"
            name="rol"
            value={formData.rol}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
          >
            <option value="">Seleccione un rol</option>
            <option value="Madre">Madre</option>
            <option value="Padre">Padre</option>
            <option value="Tutor">Tutor</option>
          </select>
        </div>

        <Input
          name="contraseña"
          type="password"
          placeholder="Contraseña"
          value={formData.contraseña}
          onChange={handleChange}
        />
        <Input
          name="id_alumno"
          placeholder="ID del Alumno"
          value={formData.id_alumno}
          onChange={handleChange}
        />

        <div className="flex justify-center pt-4">
          <button
            type="submit"
            disabled={loading}
            className="bg-[#FFE0E3] hover:bg-[#ffccd4] text-black font-semibold py-2 px-6 rounded-lg transition disabled:opacity-50"
          >
            {loading ? "Registrando..." : "Registrar Usuario"}
          </button>
        </div>
      </form>
    </div>
  );
}

function Input({
  name,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  name: string;
  value: string;
  onChange: (e: any) => void;
  placeholder: string;
  type?: string;
}) {
  return (
    <div>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required
        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
      />
    </div>
  );
}
