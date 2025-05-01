import { useState } from "react";
import { supabase } from "../../lib/supabaseclient"; 

export default function AltaUsuario() {
  const [formData, setFormData] = useState({
    nombre_completo: "",
    correo: "",
    telefono: "",
    contraseña: "",
    rol: "", 
    id_alumno: "", // nuevo campo para conexión automática
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    let nuevo = value;

    // Validación para permitir solo números en el campo telefono y id_alumno
    if (name === "telefono" || name === "id_alumno") {
      nuevo = value.replace(/[^0-9]/g, "");
    }

    setFormData(prev => ({ ...prev, [name]: nuevo }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    console.log("Registrando usuario:", formData);
  
    try {
      // 🔍 Validar que el alumno exista en la BD
      const { data: alumnoExiste, error: errorAlumno } = await supabase
        .from("Alumno")
        .select("id_alumno")
        .eq("id_alumno", parseInt(formData.id_alumno))
        .single();

      if (errorAlumno || !alumnoExiste) {
        alert("❌ El ID del alumno no existe. Por favor verifica.");
        return;
      }

      // ✅ Si existe, registrar el usuario
      const { error } = await supabase.from("Usuario").insert([{
        nombre_completo: formData.nombre_completo,
        correo: formData.correo,
        telefono: formData.telefono,
        contraseña: formData.contraseña,
        rol: formData.rol,
        estado: "Activo",
        id_alumno: parseInt(formData.id_alumno),
      }]);

      if (error) throw error;

      alert("✅ Usuario registrado correctamente.");
      setFormData({
        nombre_completo: "",
        correo: "",
        telefono: "",
        contraseña: "",
        rol: "", 
        id_alumno: "",
      });

    } catch (err: any) {
      alert(`❌ Error al registrar usuario: ${err.message}`);
    }
  };

  return (
    <div className="p-6 rounded-xl border border-gray-300 shadow-sm bg-white max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center text-pink-700">Registro de Usuario</h2>
      <form onSubmit={handleSubmit} className="space-y-5">

        <Input name="nombre_completo" placeholder="Nombre Completo" value={formData.nombre_completo} onChange={handleChange} />
        <Input name="correo" type="email" placeholder="Correo Electrónico" value={formData.correo} onChange={handleChange} />
        <Input name="telefono" placeholder="Teléfono" value={formData.telefono} onChange={handleChange} />

        <div>
          <label htmlFor="rol" className="block font-medium mb-1 text-gray-700">Rol</label>
          <select
            name="rol"
            id="rol"
            value={formData.rol}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
            required
          >
            <option value="">Seleccione un rol</option>
            <option value="Madre">Madre</option>
            <option value="Padre">Padre</option>
            <option value="Tutor">Tutor</option>
          </select>
        </div>

        <Input name="contraseña" placeholder="Contraseña" type="password" value={formData.contraseña} onChange={handleChange} />

        <Input name="id_alumno" placeholder="ID del Alumno" value={formData.id_alumno} onChange={handleChange} />

        <div className="flex justify-center pt-4">
          <button
            type="submit"
            className="bg-[#FFE0E3] hover:bg-[#ffccd4] text-black font-semibold py-2 px-6 rounded-lg transition"
          >
            Registrar Usuario
          </button>
        </div>
      </form>
    </div>
  );
}

function Input({ name, value, onChange, placeholder, type = "text" }: { name: string, value: string, onChange: (e: any) => void, placeholder: string, type?: string }) {
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
