"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/app/lib/supabaseclient";
import { toast } from "@/app/components/ui/use-toast";

export default function Login() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
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
        <div className="relative z-10">
          <div className="font-bold text-2xl mb-16">COLEGIO DAC</div>
          <h1 className="text-4xl font-bold mb-4">Bienvenidos</h1>
          <div className="mt-auto pt-40">
            <p className="opacity-90">Despertar al Conocimiento</p>
          </div>
        </div>
      </div>

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
              />
            </div>

            <div className="mb-6">
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
            </button>

            <div className="flex justify-between mt-6 text-sm">
              <div>
                <span className="text-gray-500">¿Nuevo usuario?</span>{" "}
                <a href="/registro" className="text-blue-500 hover:underline">Registrarse</a>
              </div>
              <a href="/recuperar-contrasena" className="text-gray-400 hover:underline">¿Olvidaste tu contraseña?</a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}