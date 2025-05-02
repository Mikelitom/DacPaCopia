"use client";

import { useState } from "react";
import { createClient } from "@supabase/supabase-js";

// Inicializa Supabase
const supabase = createClient(
  "https://TU-PROYECTO.supabase.co", // Reemplaza con tu URL
  "TU-CLAVE-PUBLICA"                 // Reemplaza con tu clave pública
);

export default function AggUs() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setMessage(`❌ Error: ${error.message}`);
    } else {
      setMessage("✅ Usuario registrado exitosamente. Revisa tu correo.");
      setEmail("");
      setPassword("");
    }
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-md border border-gray-200 max-w-lg mx-auto">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
        Registrar Nuevo Usuario
      </h2>

      <form onSubmit={handleRegister} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Correo electrónico
          </label>
          <input
            type="email"
            required
            placeholder="ejemplo@correo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Contraseña
          </label>
          <input
            type="password"
            required
            placeholder="Mínimo 6 caracteres"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-pink-500 hover:bg-pink-600 text-white font-semibold py-3 rounded-lg transition duration-200"
        >
          Registrar Usuario
        </button>
      </form>

      {message && (
        <p className="mt-4 text-center text-sm font-medium text-gray-700">
          {message}
        </p>
      )}
    </div>
  );
}
