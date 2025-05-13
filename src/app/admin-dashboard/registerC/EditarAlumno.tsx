"use client";
import { useState } from "react";
import { supabase } from "../../lib/supabaseclient";

export default function EditarAlumno() {
  const [idAlumno, setIdAlumno] = useState("");
  const [datos, setDatos] = useState<any>(null);
  const [error, setError] = useState("");

  const buscarAlumno = async () => {
    setError("");
    setDatos(null);
    if (!idAlumno.trim()) {
      setError("Debes ingresar un ID de alumno");
      return;
    }

    try {
      const { data: alumno, error: alumnoError } = await supabase
        .from("Alumno")
        .select("*")
        .eq("id_alumno", idAlumno)
        .single();
      if (alumnoError || !alumno) throw alumnoError;

      const { data: padre } = await supabase.from("PadreFamilia").select("*").eq("id_padre", alumno.id_padre).single();
      const { data: madre } = await supabase.from("MadreDf").select("*").eq("idMadre", alumno.idMadre).single();
      const { data: contacto } = await supabase.from("ContactoEmergencia").select("*").eq("id_alumno", idAlumno).single();
      const { data: desarrollo } = await supabase.from("HistoriaDesarrollo").select("*").eq("id_alumno", idAlumno).single();
      const { data: vivienda } = await supabase.from("ViviendayComunidad").select("*").eq("id_alumno", idAlumno).single();

      setDatos({ alumno, padre, madre, contacto, desarrollo, vivienda });
    } catch {
      setError("No se encontró información para el ID proporcionado.");
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-bold text-pink-600 mb-6 text-center">Consulta de Alumno</h1>

      <div className="flex gap-4 mb-6">
        <input
          type="text"
          placeholder="ID del alumno"
          className="border px-4 py-2 rounded w-full"
          value={idAlumno}
          onChange={(e) => setIdAlumno(e.target.value)}
        />
        <button
          onClick={buscarAlumno}
          className="bg-pink-500 text-white px-4 py-2 rounded hover:bg-pink-600"
        >
          Buscar
        </button>
      </div>

      {error && <p className="text-red-500 text-center">{error}</p>}

      {datos && (
        <div className="space-y-6">
          <Seccion titulo="👧 Datos Generales">
            <Linea label="Nombre" valor={`${datos.alumno.nombre} ${datos.alumno.apellido_paterno} ${datos.alumno.apellido_materno}`} />
            <Linea label="Edad" valor={datos.alumno.edadAlumno} />
            <Linea label="Fecha de Nacimiento" valor={datos.alumno.fecha_nacimiento} />
            <Linea label="Domicilio" valor={datos.alumno.domicilioAlumno} />
            <Linea label="Grado y Grupo" valor={`${datos.alumno.grado} - ${datos.alumno.grupo}`} />
            <Linea label="Maestra" valor={datos.alumno.maestraAlumno} />
          </Seccion>

          <Seccion titulo="📞 Contacto de Emergencia">
            <Linea label="Nombre" valor={datos.contacto?.nombre} />
            <Linea label="Teléfono" valor={datos.contacto?.telefono} />
            <Linea label="Domicilio" valor={datos.contacto?.domicilio} />
          </Seccion>

          <Seccion titulo="👨 Padre">
            <Linea label="Nombre" valor={datos.padre?.nombre} />
            <Linea label="Edad" valor={datos.padre?.edad} />
            <Linea label="Escolaridad" valor={datos.padre?.escolaridad} />
            <Linea label="Ocupación" valor={datos.padre?.ocupacion} />
            <Linea label="Celular" valor={datos.padre?.celular} />
            <Linea label="Tel. Oficina" valor={datos.padre?.telefono_oficina} />
          </Seccion>

          <Seccion titulo="👩 Madre">
            <Linea label="Nombre" valor={datos.madre?.madreNombre} />
            <Linea label="Edad" valor={datos.madre?.madreEdad} />
            <Linea label="Escolaridad" valor={datos.madre?.madreEscolaridad} />
            <Linea label="Ocupación" valor={datos.madre?.madreOcupacion} />
            <Linea label="Celular" valor={datos.madre?.madreCelular} />
            <Linea label="Tel. Oficina" valor={datos.madre?.madreTelefonoOficina} />
          </Seccion>

          <Seccion titulo="🏠 Características de Vivienda">
            <Linea label="Tipo de Vivienda" valor={datos.vivienda?.tipoVivienda} />
            <Linea label="Número de Cuartos" valor={datos.vivienda?.numCuartos} />
            <Linea label="Tipo de Construcción" valor={datos.vivienda?.tipoConstruccion} />
            <Linea
              label="Servicios de Vivienda"
              valor={Array.isArray(datos.vivienda?.serviciosVivienda)
                ? datos.vivienda.serviciosVivienda.join(", ")
                : datos.vivienda?.serviciosVivienda || "N/A"}
            />
            <Linea
              label="Servicios de Comunidad"
              valor={Array.isArray(datos.vivienda?.serviciosComunidad)
                ? datos.vivienda.serviciosComunidad.join(", ")
                : datos.vivienda?.serviciosComunidad || "N/A"}
            />
          </Seccion>

          <Seccion titulo="🧠 Historia de Desarrollo">
            <Linea label="Embarazo" valor={datos.desarrollo?.embarazo} />
            <Linea label="Parto" valor={datos.desarrollo?.parto} />
            <Linea label="Lactancia" valor={datos.desarrollo?.lactancia} />
            <Linea label="Tiempo de lactancia" valor={datos.desarrollo?.tiempo_lactancia} />
            <Linea label="Talla " valor={`${datos.desarrollo?.talla} años`} />
            <Linea label="Peso" valor={`${datos.desarrollo?.peso} kg`} />
            <Linea label="Malformaciones" valor={datos.desarrollo?.malformaciones || "Ninguna"} />
            <Linea label="Enfermedades" valor={datos.desarrollo?.enfermedades} />
            <Linea label="Alergias" valor={datos.desarrollo?.alergias} />
            <Linea label="Vacunas" valor={datos.desarrollo?.vacunas} />
            <Linea label="Servicio Médico" valor={datos.desarrollo?.servicio_medico || "No cuenta"} />
            <Linea label="Control de esfínteres" valor={`Diurno: ${datos.desarrollo?.control_esfinteres_diurno}, Nocturno: ${datos.desarrollo?.control_esfinteres_nocturno}`} />
            <Linea label="Sueño" valor={`${datos.desarrollo?.horas_sueño}h - ${datos.desarrollo?.tipo_sueño}`} />
            <Linea label="Cama" valor={datos.desarrollo?.tipo_cama} />
            <Linea label="Alimentación" valor={`Desayuno: ${datos.desarrollo?.desayuno}, Comida: ${datos.desarrollo?.comida}, Cena: ${datos.desarrollo?.cena}`} />
            <Linea label="Edad caminó / habló" valor={`${datos.desarrollo?.edad_camino} / ${datos.desarrollo?.edad_hablo}`} />
            <Linea label="Lateridad" valor={datos.desarrollo?.lateralidad} />
            <Linea label="Lenguaje" valor={datos.desarrollo?.lenguaje} />
            <Linea label="Observaciones" valor={datos.desarrollo?.observacionesAlumno} />
          </Seccion>
        </div>
      )}
    </div>
  );
}

function Seccion({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <div className="border-l-4 border-pink-400 bg-pink-50 p-4 rounded-md shadow-sm">
      <h2 className="text-xl font-bold text-pink-700 mb-2">{titulo}</h2>
      <div className="space-y-1">{children}</div>
    </div>
  );
}

function Linea({ label, valor }: { label: string; valor: string | number | null }) {
  return (
    <p>
      <span className="font-semibold text-gray-700">{label}:</span>{" "}
      <span className="text-gray-900">{valor || "No disponible"}</span>
    </p>
  );
}
