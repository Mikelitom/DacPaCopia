"use client";
import { useRouter } from "next/navigation";
<<<<<<< HEAD
import { useState } from "react";
import { supabase } from "@/app/lib/supabaseClient";
=======
import { useEffect, useState } from "react";
import { supabase } from "@/app/lib/supabaseClient";
import { toast } from "@/app/components/ui/use-toast";
>>>>>>> e8228539c0ec718cfe9e3d939363b35f5f760260

export default function Login() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
<<<<<<< HEAD
  const [form, setForm] = useState({ username: "", password: "" });

  const handleLogin = async (dashboardPath: string, role: string) => {
    setLoading(true);
    document.cookie = "token=valid-token; path=/";
    localStorage.setItem("role", role);
    router.push(dashboardPath);
  };


const loginUser = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);

  const { username, password } = form;

  const { data, error } = await supabase.auth.signInWithPassword({
    email: username,
    password: password,
  });

  if (error) {
    alert("Usuario o contraseña incorrectos");
    setLoading(false);
    return;
  }

  // Puedes obtener rol desde el perfil si lo guardas aparte en una tabla
  // Aquí rediriges genéricamente
  handleLogin("/dashboard", "usuario"); 
};


    // Validación correcta → redirigir según su rol
    const rol = user.rol?.toLowerCase() || "";
    switch (rol) {
      case "secretario":
      case "contador":
      case "director":
        handleLogin("/admin-dashboard", rol);
        break;
      case "alumno":
        handleLogin("/dashboard", rol);
        break;
      default:
        alert("Rol no reconocido");
        setLoading(false);
    }
  

  return (
    <div className="flex h-screen w-full bg-gradient-to-br from-purple-50 to-purple-100">
      {/* Left side */}
      <div className="hidden md:flex md:w-2/5 flex-col bg-gradient-to-b from-pink-400 to-pink-500 text-white p-10 relative overflow-hidden">
        {/* Content */}
=======
  const [form, setForm] = useState({ email: "", password: "" }); // Cambiado a email para Supabase


  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Botón presionado - Iniciando proceso");
  
    if (!form.email || !form.password) {
      toast({
        title: "Error",
        description: "Ambos campos son requeridos",
        variant: "destructive"
      });
      return;
    }
  
    setLoading(true);
    console.log("Credenciales ingresadas:", { email: form.email, password: '••••••' });
  
    try {
      // 1. Autenticación
      console.log("Iniciando autenticación...");
      const { data, error } = await supabase.auth.signInWithPassword({
        email: form.email,
        password: form.password
      });
  
      console.log("Respuesta de Supabase:", { data, error });
  
      if (error) {
        throw new Error(error.message || "Error de autenticación");
      }
  
      if (!data?.session) {
        throw new Error("No se recibió la sesión del usuario");
      }
  
      // Establecer el cookie "token" una vez exitosamente autenticados
      const accessToken = data.session.access_token;
      if (accessToken) {
        document.cookie = `token=${accessToken}; path=/; max-age=3600; samesite=strict;`;
        console.log("Cookie de token establecido");
      } else {
        throw new Error("El token de acceso es indefinido");
      }
  
      // 2. Obtener perfil (ejemplo)
      console.log("Obteniendo perfil para:", data.session.user.email);
      const { data: profile, error: profileError } = await supabase
        .from('Usuario')
        .select('*')
        .eq('correo', data.session.user.email)
        .single();
  
      console.log("Perfil obtenido:", profile);
  
      if (profileError || !profile) {
        throw new Error(profileError?.message || "Perfil no encontrado");
      }
  
      // 3. Redirección según el rol
      console.log("Redirigiendo según rol:", profile.rol);
      if (profile.rol === 'admin') {
        await router.push("/admin-dashboard");
      } else if (profile.rol === 'padre') {
        await router.push("/dashboard");
      } else {
        throw new Error("Rol no reconocido");
      }
  
    } catch (error: any) {
      console.error("Error completo:", error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
      console.log("Proceso de login finalizado");
    }
  };
  

  return (
    <div className="flex h-screen w-full bg-gradient-to-br from-purple-50 to-purple-100">
      {/* Left side - Diseño original */}
      <div className="hidden md:flex md:w-2/5 flex-col bg-gradient-to-b from-pink-400 to-pink-500 text-white p-10 relative overflow-hidden">
>>>>>>> e8228539c0ec718cfe9e3d939363b35f5f760260
        <div className="relative z-10">
          <div className="font-bold text-2xl mb-16">COLEGIO DAC</div>
          <h1 className="text-4xl font-bold mb-4">Bienvenidos</h1>
          <div className="mt-auto pt-40">
            <p className="opacity-90">Despertar al Conocimiento</p>
          </div>
        </div>
      </div>

<<<<<<< HEAD
      {/* Right side */}
      <div className="w-full md:w-3/5 flex justify-center items-center p-6">
        <div className="w-full max-w-md">
          <div className="text-center md:text-left">
            <h2 className="text-3xl font-bold text-pink-500 mb-2">
              Iniciar Sesión
            </h2>
          </div>

          <form onSubmit={loginUser}>
            <div className="mb-6">
              <label htmlFor="username" className="block text-gray-500 mb-2">
                Usuario
              </label>
              <input
                type="text"
                id="username"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
=======
      {/* Right side - Formulario */}
      <div className="w-full md:w-3/5 flex justify-center items-center p-6">
        <div className="w-full max-w-md">
          <div className="text-center md:text-left">
            <h2 className="text-3xl font-bold text-pink-500 mb-2">Iniciar Sesión</h2>
          </div>

          <form onSubmit={handleLogin}>
            <div className="mb-6">
              <label htmlFor="email" className="block text-gray-500 mb-2">Correo Electrónico</label>
              <input 
                type="email" 
                id="email" 
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
>>>>>>> e8228539c0ec718cfe9e3d939363b35f5f760260
              />
            </div>

            <div className="mb-6">
<<<<<<< HEAD
              <label htmlFor="password" className="block text-gray-500 mb-2">
                Contraseña
              </label>
              <input
                type="password"
                id="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-pink-300 text-white py-3 rounded-md font-medium hover:bg-pink-400 transition duration-300"
            >
              {loading ? "Cargando..." : "LOGIN"}
=======
              <label htmlFor="password" className="block text-gray-500 mb-2">Contraseña</label>
              <input 
                type="password" 
                id="password" 
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <button 
                type="submit" 
                disabled={loading}
                className={`w-full bg-pink-300 text-white py-3 rounded-md font-medium hover:bg-pink-400 transition duration-300 ${
                  loading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
              {loading ? "Iniciando sesión..." : "INICIAR SESIÓN"}
>>>>>>> e8228539c0ec718cfe9e3d939363b35f5f760260
            </button>

            <div className="flex justify-between mt-6 text-sm">
              <div>
                <span className="text-gray-500">¿Nuevo usuario?</span>{" "}
<<<<<<< HEAD
                <a href="#" className="text-blue-500 hover:underline">
                  Registrarse
                </a>
              </div>
              <a href="#" className="text-gray-400 hover:underline">
                ¿Olvidaste tu contraseña?
              </a>
=======
                <a href="/registro" className="text-blue-500 hover:underline">Registrarse</a>
              </div>
              <a href="/recuperar-contrasena" className="text-gray-400 hover:underline">¿Olvidaste tu contraseña?</a>
>>>>>>> e8228539c0ec718cfe9e3d939363b35f5f760260
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}