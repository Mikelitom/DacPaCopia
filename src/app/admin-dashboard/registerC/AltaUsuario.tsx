import { useState } from "react";
import { supabase } from "../../lib/supabaseClient"; 
export default function AltaUsuario() {
    const [formData, setFormData] = useState({
        nombre_completo: "",
        correo: "",
        teléfono: "",
        departamento: "", 
        contraseña: "",
        rol: "", 
      });
      
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    console.log("🚀 Registrando usuario:", formData);
  
    try {
      const { error } = await supabase
        .from("Usuario")
        .insert([{
            nombre_completo: formData.nombre_completo,
            correo: formData.correo,
            teléfono: formData.teléfono,
            departamento: formData.departamento, 
            contraseña: formData.contraseña,
            rol: formData.rol,                  
            estado: "Activo",
            id_padre: 2,
          }]);
            
      if (error) throw error;
  
      alert("✅ Usuario registrado correctamente.");
      setFormData({
        nombre_completo: "",
        correo: "",
        teléfono: "",
        departamento: "",
        contraseña: "",
        rol: "", 
      });
      
    } catch (err: any) {
      console.error("❌ Error al registrar:", err.message || err);
      alert(`❌ Error al registrar usuario: ${err.message}`);
    }
  };
  
  

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
  <Input name="nombre_completo" placeholder="Nombre Completo" value={formData.nombre_completo} onChange={handleChange} />
  <Input name="correo" placeholder="Correo Electrónico" type="email" value={formData.correo} onChange={handleChange} />
  <Input name="teléfono" placeholder="Teléfono" value={formData.teléfono} onChange={handleChange} />

  {/* Rol (Administrador o Colaborador) */}
<div>
  <label htmlFor="rol" className="block font-medium mb-1">Rol</label>
  <select
    name="rol"
    id="rol"
    value={formData.rol}
    onChange={handleChange}
    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-pink-400"
  >
    <option value="">Seleccione un rol</option>
    <option value="Administrador">Administrador</option>
    <option value="Padre">Padre</option>
  </select>
</div>

{/* Departamento (Secretario, Tesorero, Director) */}
<div>
  <label htmlFor="departamento" className="block font-medium mb-1">Departamento</label>
  <select
    name="departamento"
    id="departamento"
    value={formData.departamento}
    onChange={handleChange}
    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-pink-400"
  >
    <option value="">Seleccione un departamento</option>
    <option value="Secretario">Secretario</option>
    <option value="Tesorero">Tesorero</option>
    <option value="Director">Director</option>
  </select>
</div>


  <Input name="contraseña" placeholder="Contraseña" type="password" value={formData.contraseña} onChange={handleChange} />

  <div className="text-center mt-6">
    <button type="submit" className="bg-green-600 text-white font-bold px-6 py-2 rounded hover:bg-green-700 transition">
      Registrar Usuario
    </button>
  </div>
</form>

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
        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-pink-400"
      />
    </div>
  );
}
