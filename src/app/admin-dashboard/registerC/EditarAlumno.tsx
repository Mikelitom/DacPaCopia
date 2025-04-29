"use client";

import React, { useState } from "react";
import { supabase } from "../../lib/supabaseClient";

// —— INTERFAZ DEL FORMULARIO —— 
export interface FormData {
  id_alumno: number;
  id_padre: number;
  idMadre?: number;

  // Datos Generales
  apellidoPaterno: string;
  apellidoMaterno: string;
  nombres: string;
  edadAlumno: number;
  fechaNacimiento: string;
  domicilioAlumno: string;
  contactoEmergenciaNombre: string;
  contactoEmergenciaTelefono: string;
  contactoEmergenciaDomicilio: string;

  // Datos de Ingreso
  grado: string;
  grupo: string;
  maestraAlumno: string;

  // Datos del Padre
  padreNombre: string;
  padreEdad: number;
  direccion: string;
  ingreso_economico: string;
  ciudad: string;
  codigo_postal: string;
  escolaridad: string;
  padreOcupacion: string;
  padreCelular: string;
  padreTelefonoOficina: string;

  // Datos de la Madre
  madreNombre: string;
  madreEdad: number;
  madreEscolaridad: string;
  madreOcupacion: string;
  madreCelular: string;
  madreTelefonoOficina: string;

  // Vivienda y Comunidad
  tipoVivienda: string;
  otrosTipoVivienda: string;
  numCuartos: number;
  tipoConstruccion: string;
  serviciosVivienda: string[];
  serviciosComunidad: string[];

  // Antecedentes Prenatales y Postnatales
  embarazo: string;
  parto: string;
  lactancia: string;
  tiempo_lactancia: string;

  // Historia de Desarrollo
  talla: string;
  peso: string;
  tieneMalformacion: "Sí" | "No";
  malformaciones: string;
  enfermedades: string;
  alergias: string;
  vacunas: string[];
  tieneServicioMedico: "Sí" | "No";
  servicio_medico: string;
  control_esfinteres_diurno: string;
  control_esfinteres_nocturno: string;
  horas_sueño: string;
  tipo_sueño: string;
  comparteCama: "Sí" | "No";
  tipo_cama: string;
  desayuno: string;
  comida: string;
  cena: string;
  edad_camino: string;
  edad_hablo: string;
  lateralidad: string;
  lenguaje: string;

  // Observaciones
  observacionesAlumno: string;
}
// —— FUNCIÓN buscarAlumno —— 
export const buscarAlumno = async (
  idBusqueda: number,
  setFormData: React.Dispatch<React.SetStateAction<FormData | null>>,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
  setLoading(true);
  try {
    // 1. Buscar alumno
    const { data: alum, error: errAl } = await supabase
      .from("Alumno")
      .select("*")
      .eq("id_alumno", idBusqueda)
      .single();
    if (errAl || !alum) throw errAl || new Error("Alumno no encontrado");

    // 2. Buscar padre
    const { data: pad } = await supabase
      .from("PadreFamilia")
      .select("*")
      .eq("id_padre", alum.id_padre)
      .single();

    // 3. Buscar madre
    const { data: mad } = await supabase
      .from("MadreDf")
      .select("*")
      .eq("idMadre", alum.idMadre)
      .single();

    // 4. Buscar vivienda
    const { data: viv } = await supabase
      .from("ViviendayComunidad")
      .select("*")
      .eq("id_alumno", idBusqueda)
      .single();


    // 5. Buscar historia de desarrollo
    const { data: his } = await supabase
      .from("HistoriaDesarrollo")
      .select("*")
      .eq("id_alumno", idBusqueda)
      .single();
      console.log("HistoriaDesarrollo encontrada:", his);


    // 6. Cargar todo en el formData
    setFormData({
      id_alumno: alum.id_alumno,
      id_padre: alum.id_padre,
      idMadre: alum.idMadre,

      apellidoPaterno: alum.apellido_paterno || "",
      apellidoMaterno: alum.apellido_materno || "",
      nombres: alum.nombre || "",
      edadAlumno: alum.edadAlumno ?? 0,
      fechaNacimiento: alum.fecha_nacimiento || "",
      domicilioAlumno: alum.domicilioAlumno || "",
      contactoEmergenciaNombre: alum.contactoEmergenciaNombre || "",
      contactoEmergenciaTelefono: alum.contactoEmergenciaTelefono || "",
      contactoEmergenciaDomicilio: alum.contactoEmergenciaDomicilio || "",

      grado: alum.grado || "",
      grupo: alum.grupo || "",
      maestraAlumno: alum.maestraAlumno || "",

      padreNombre: pad?.nombre || "",
      padreEdad: pad?.edad ?? 0,
      direccion: pad?.direccion || "",
      ingreso_economico: pad?.ingreso_economico || "",
      ciudad: pad?.ciudad || "",
      codigo_postal: pad?.codigo_postal?.toString() || "",
      escolaridad: pad?.escolaridad || "",
      padreOcupacion: pad?.ocupacion || "",
      padreCelular: pad?.celular || "",
      padreTelefonoOficina: pad?.telefono_oficina?.toString() || "",

      madreNombre: mad?.madreNombre || "",
      madreEdad: mad?.madreEdad ?? 0,
      madreEscolaridad: mad?.madreEscolaridad || "",
      madreOcupacion: mad?.madreOcupacion || "",
      madreCelular: mad?.madreCelular || "",
      madreTelefonoOficina: mad?.madreTelefonoOficina || "",

      tipoVivienda: viv?.tipoVivienda || "",
      otrosTipoVivienda: "", // si tuvieras campo extra para otros
      numCuartos: parseInt(viv?.numCuartos || "0", 10),
      tipoConstruccion: viv?.tipoConstruccion || "",
      serviciosVivienda: viv?.serviciosVivienda?.split(", ") || [],
      serviciosComunidad: viv?.serviciosComunidad?.split(", ") || [],           

      embarazo: his?.embarazo || "",
      parto: his?.parto || "",
      lactancia: his?.lactancia || "",
      tiempo_lactancia: his?.tiempo_lactancia || "",
      talla: his?.talla || "",
      peso: his?.peso || "",
      tieneMalformacion: his?.malformaciones ? "Sí" : "No",
      malformaciones: his?.malformaciones || "",
      enfermedades: his?.enfermedades || "",
      alergias: his?.alergias || "",
      vacunas: his?.vacunas?.split(", ") || [],
      tieneServicioMedico: his?.servicio_medico ? "Sí" : "No",
      servicio_medico: his?.servicio_medico || "",
      control_esfinteres_diurno: his?.control_esfinteres_diurno || "",
      control_esfinteres_nocturno: his?.control_esfinteres_nocturno || "",
      horas_sueño: his?.horas_sueño?.toString() || "",
      tipo_sueño: his?.tipo_sueño || "",
      comparteCama: his?.tipo_cama && his.tipo_cama !== "Duerme solo" ? "Sí" : "No",
      tipo_cama: his?.tipo_cama || "",
      desayuno: his?.desayuno || "",
      comida: his?.comida || "",
      cena: his?.cena || "",
      edad_camino: his?.edad_camino || "",
      edad_hablo: his?.edad_hablo || "",
      lateralidad: his?.lateralidad || "",
      lenguaje: his?.lenguaje || "",
      observacionesAlumno: his?.observacionesAlumno || "",
    });
  } catch (error: any) {
    console.error("Error al buscar alumno:", error);
    alert(`❌ No se pudo cargar el alumno:\n${error.message}`);
  } finally {
    setLoading(false);
  }
};
// —— FUNCIÓN actualizarAlumno —— 
export const actualizarAlumno = async (
  formData: FormData,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setFormData: React.Dispatch<React.SetStateAction<FormData | null>>,
  setIdBusqueda: React.Dispatch<React.SetStateAction<number | "">>
) => {
  setLoading(true);
  try {
    // 1. Actualizar Alumno
    await supabase
      .from("Alumno")
      .update({
        apellido_paterno: formData.apellidoPaterno,
        apellido_materno: formData.apellidoMaterno,
        nombre: formData.nombres,
        edadAlumno: formData.edadAlumno,
        fecha_nacimiento: formData.fechaNacimiento,
        domicilioAlumno: formData.domicilioAlumno,
        contactoEmergenciaNombre: formData.contactoEmergenciaNombre,
        contactoEmergenciaTelefono: formData.contactoEmergenciaTelefono,
        contactoEmergenciaDomicilio: formData.contactoEmergenciaDomicilio,
        grado: formData.grado,
        grupo: formData.grupo,
        maestraAlumno: formData.maestraAlumno,
      })
      .eq("id_alumno", formData.id_alumno);

    // 2. Actualizar PadreFamilia
    // 2. Actualizar datos del Padre
const { data: padreActualizado, error: errorPadre } = await supabase
.from("PadreFamilia")
.update({
  nombre: formData.padreNombre,
  edad: formData.padreEdad,
  direccion: formData.direccion,
  ingreso_economico: formData.ingreso_economico,
  ciudad: formData.ciudad,
  codigo_postal: Number(formData.codigo_postal) || null,
  escolaridad: formData.escolaridad,
  ocupacion: formData.padreOcupacion,
  celular: formData.padreCelular,
  telefono_oficina: Number(formData.padreTelefonoOficina) || null,
})
.eq("id_padre", formData.id_padre);

console.log("Resultado update PadreFamilia:", { padreActualizado, errorPadre });


    // 3. Actualizar MadreDf (si existe)
    const { data, error } = await supabase
      .from("MadreDf")
      .update({
      madreNombre: formData.madreNombre,
      madreEdad: formData.madreEdad,
      madreEscolaridad: formData.madreEscolaridad,
      madreOcupacion: formData.madreOcupacion,
      madreCelular: formData.madreCelular,
      madreTelefonoOficina: formData.madreTelefonoOficina,
    })
    .eq("idMadre", formData.idMadre);
    console.log("Resultado update MadreDf:", { data, error });


    // 4. Actualizar Características de la Vivienda
    await supabase
    .from("ViviendayComunidad")
    .update({
      tipoVivienda: formData.tipoVivienda === "otros" ? formData.otrosTipoVivienda : formData.tipoVivienda,
      numCuartos: formData.numCuartos,
      tipoConstruccion: formData.tipoConstruccion,
      serviciosVivienda: formData.serviciosVivienda.join(", "),
      serviciosComunidad: formData.serviciosComunidad.join(", "),
    })
    .eq("id_alumno", formData.id_alumno);


    // 5. Actualizar Historia de Desarrollo
    await supabase
      .from("HistoriaDesarrollo")
      .update({
        embarazo: formData.embarazo,
        parto: formData.parto,
        lactancia: formData.lactancia,
        tiempo_lactancia: formData.tiempo_lactancia,
        talla: formData.talla,
        peso: formData.peso,
        tieneMalformacion: formData.tieneMalformacion,
        malformaciones: formData.malformaciones,
        enfermedades: formData.enfermedades,
        alergias: formData.alergias,
        vacunas: formData.vacunas.join(", "),
        servicio_medico: formData.tieneServicioMedico === "Sí" ? formData.servicio_medico : "",
        control_esfinteres_diurno: formData.control_esfinteres_diurno,
        control_esfinteres_nocturno: formData.control_esfinteres_nocturno,
        horas_sueño: Number(formData.horas_sueño) || null,
        tipo_sueño: formData.tipo_sueño,
        tipo_cama: formData.comparteCama === "Sí" ? formData.tipo_cama : "Duerme solo",
        desayuno: formData.desayuno,
        comida: formData.comida,
        cena: formData.cena,
        edad_camino: formData.edad_camino,
        edad_hablo: formData.edad_hablo,
        lateralidad: formData.lateralidad,
        lenguaje: formData.lenguaje,
        observacionesAlumno: formData.observacionesAlumno,
      })
      .eq("id_alumno", formData.id_alumno);

    // Éxito
    alert("✅ Todos los datos se actualizaron correctamente.");
    setFormData(null);
    setIdBusqueda("");
  } catch (err: any) {
    console.error("Error al actualizar:", err);
    alert(`❌ Error al actualizar:\n${err.message}`);
  } finally {
    setLoading(false);
  }
};
export default function EditarAlumno() {
  const [loading, setLoading] = useState(false);
  const [idBusqueda, setIdBusqueda] = useState<number | "">("");
  const [formData, setFormData] = useState<FormData | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    if (!formData) return;
    const { name, value, type, checked } = e.target as HTMLInputElement;
    setFormData(prev => {
      if (!prev) return prev;
      let newVal: any = value;
      if (type === "number") newVal = Number(value);
      if (type === "checkbox") {
        const arr = new Set((prev as any)[name] as string[]);
        if (checked) arr.add(value);
        else arr.delete(value);
        newVal = Array.from(arr);
      }
      return { ...prev, [name]: newVal };
    });
  };

  const handleRadio = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev =>
      prev
        ? {
            ...prev,
            [name]: value,
            ...(name === "tipoVivienda" && value !== "otros"
              ? { otrosTipoVivienda: "" }
              : {}),
          }
        : prev
    );
  };

  if (loading) return <p>Cargando…</p>;

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-6">
      <h2 className="text-2xl font-bold text-center">Modificar Alumno</h2>

      {/* Buscador de alumno */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (idBusqueda !== "") {
            buscarAlumno(Number(idBusqueda), setFormData, setLoading);
          }
        }}
        className="flex gap-2 justify-center mb-6"
      >
        <input
          type="number"
          placeholder="ID del alumno"
          value={idBusqueda}
          onChange={(e) => setIdBusqueda(e.target.value === "" ? "" : Number(e.target.value))}
          className="border p-2 rounded"
          required
        />
        <button type="submit" className="bg-pink-600 text-white px-4 py-2 rounded">
          Buscar
        </button>
      </form>

      {/* Formulario completo para editar */}
      {formData && (
      <form
        onSubmit={(e) => {
          e.preventDefault();
          actualizarAlumno(formData, setLoading, setFormData, setIdBusqueda);
        }}
        className="space-y-8"
      >
    
        {/* DATOS GENERALES */}
        <Section title="Datos Generales">
          <Grid2>
            <Input name="apellidoPaterno" label="Apellido Paterno" value={formData.apellidoPaterno} onChange={handleChange} />
            <Input name="apellidoMaterno" label="Apellido Materno" value={formData.apellidoMaterno} onChange={handleChange} />
            <Input name="nombres" label="Nombre(s)" value={formData.nombres} onChange={handleChange} />
            <Input name="edadAlumno" label="Edad" type="number" value={formData.edadAlumno.toString()} onChange={handleChange} />
            <Input name="fechaNacimiento" label="Fecha de Nacimiento" type="date" value={formData.fechaNacimiento} onChange={handleChange} />
            <Input name="domicilioAlumno" label="Domicilio" value={formData.domicilioAlumno} onChange={handleChange} />
          </Grid2>
        </Section>
    
        {/* CONTACTO DE EMERGENCIA */}
        <Section title="Contacto de Emergencia">
          <Grid2>
            <Input name="contactoEmergenciaNombre" label="Nombre" value={formData.contactoEmergenciaNombre} onChange={handleChange} />
            <Input name="contactoEmergenciaTelefono" label="Teléfono" value={formData.contactoEmergenciaTelefono} onChange={handleChange} />
            <Input name="contactoEmergenciaDomicilio" label="Domicilio" value={formData.contactoEmergenciaDomicilio} onChange={handleChange} />
          </Grid2>
        </Section>
    
        {/* DATOS DE INGRESO */}
        <Section title="Datos de Ingreso">
          <Grid3>
            <Input name="grado" label="Grado" value={formData.grado} onChange={handleChange} />
            <Input name="grupo" label="Grupo" value={formData.grupo} onChange={handleChange} />
            <Input name="maestraAlumno" label="Maestra" value={formData.maestraAlumno} onChange={handleChange} />
          </Grid3>
        </Section>
    
        {/* DATOS DEL PADRE */}
        <Section title="Datos del Padre">
          <Grid2>
            <Input name="padreNombre" label="Nombre del Padre" value={formData.padreNombre} onChange={handleChange} />
            <Input name="padreEdad" label="Edad" type="number" value={formData.padreEdad.toString()} onChange={handleChange} />
            <Input name="direccion" label="Dirección" value={formData.direccion} onChange={handleChange} />
            <Input name="ingreso_economico" label="Ingreso Económico" value={formData.ingreso_economico} onChange={handleChange} />
            <Input name="ciudad" label="Ciudad" value={formData.ciudad} onChange={handleChange} />
            <Input name="codigo_postal" label="Código Postal" value={formData.codigo_postal} onChange={handleChange} />
            <Input name="escolaridad" label="Escolaridad" value={formData.escolaridad} onChange={handleChange} />
            <Input name="padreOcupacion" label="Ocupación" value={formData.padreOcupacion} onChange={handleChange} />
            <Input name="padreCelular" label="Celular" value={formData.padreCelular} onChange={handleChange} />
            <Input name="padreTelefonoOficina" label="Teléfono Oficina" value={formData.padreTelefonoOficina} onChange={handleChange} />
          </Grid2>
        </Section>
    
        {/* DATOS DE LA MADRE */}
        <Section title="Datos de la Madre">
          <Grid2>
            <Input name="madreNombre" label="Nombre de la Madre" value={formData.madreNombre} onChange={handleChange} />
            <Input name="madreEdad" label="Edad" type="number" value={formData.madreEdad.toString()} onChange={handleChange} />
            <Input name="madreEscolaridad" label="Escolaridad" value={formData.madreEscolaridad} onChange={handleChange} />
            <Input name="madreOcupacion" label="Ocupación" value={formData.madreOcupacion} onChange={handleChange} />
            <Input name="madreCelular" label="Celular" value={formData.madreCelular} onChange={handleChange} />
            <Input name="madreTelefonoOficina" label="Teléfono Oficina" value={formData.madreTelefonoOficina} onChange={handleChange} />
          </Grid2>
        </Section>
    
        {/* VIVIENDA Y COMUNIDAD */}
        <Section title="Vivienda y Comunidad">
          <Grid2>
            <Input name="tipoVivienda" label="Tipo de Vivienda" value={formData.tipoVivienda} onChange={handleChange} />
            {formData.tipoVivienda === "otros" && (
              <Input name="otrosTipoVivienda" label="Especificar Vivienda" value={formData.otrosTipoVivienda} onChange={handleChange} />
            )}
            <Input name="numCuartos" label="Número de Cuartos" type="number" value={formData.numCuartos.toString()} onChange={handleChange} />
            <Input name="tipoConstruccion" label="Tipo de Construcción" value={formData.tipoConstruccion} onChange={handleChange} />
          </Grid2>
        </Section>
    
        {/* ANTECEDENTES PRENATALES */}
        <Section title="Antecedentes Prenatales y Postnatales">
          <Grid2>
            <Input name="embarazo" label="Embarazo" value={formData.embarazo} onChange={handleChange} />
            <Input name="parto" label="Parto" value={formData.parto} onChange={handleChange} />
            <Input name="lactancia" label="Lactancia" value={formData.lactancia} onChange={handleChange} />
            <Input name="tiempo_lactancia" label="Tiempo de Lactancia" value={formData.tiempo_lactancia} onChange={handleChange} />
          </Grid2>
        </Section>
    
        {/* HISTORIA DE DESARROLLO */}
        <Section title="Historia de Desarrollo">
          <Grid2>
            <Input name="talla" label="Talla" value={formData.talla} onChange={handleChange} />
            <Input name="peso" label="Peso" value={formData.peso} onChange={handleChange} />
            <Input name="malformaciones" label="Malformaciones" value={formData.malformaciones} onChange={handleChange} />
            <Input name="enfermedades" label="Enfermedades" value={formData.enfermedades} onChange={handleChange} />
            <Input name="alergias" label="Alergias" value={formData.alergias} onChange={handleChange} />
            <Input name="servicio_medico" label="Servicio Médico" value={formData.servicio_medico} onChange={handleChange} />
            <Input name="control_esfinteres_diurno" label="Control esfínteres Diurno" value={formData.control_esfinteres_diurno} onChange={handleChange} />
            <Input name="control_esfinteres_nocturno" label="Control esfínteres Nocturno" value={formData.control_esfinteres_nocturno} onChange={handleChange} />
            <Input name="horas_sueño" label="Horas de Sueño" value={formData.horas_sueño} onChange={handleChange} />
            <Input name="tipo_sueño" label="Tipo de Sueño" value={formData.tipo_sueño} onChange={handleChange} />
            <Input name="tipo_cama" label="Tipo de Cama" value={formData.tipo_cama} onChange={handleChange} />
          </Grid2>
          <Grid2>
            <Input name="desayuno" label="Desayuno" value={formData.desayuno} onChange={handleChange} />
            <Input name="comida" label="Comida" value={formData.comida} onChange={handleChange} />
            <Input name="cena" label="Cena" value={formData.cena} onChange={handleChange} />
            <Input name="edad_camino" label="Edad cuando Caminó" value={formData.edad_camino} onChange={handleChange} />
            <Input name="edad_hablo" label="Edad cuando Habló" value={formData.edad_hablo} onChange={handleChange} />
            <Input name="lateralidad" label="Lateralidad" value={formData.lateralidad} onChange={handleChange} />
            <Input name="lenguaje" label="Lenguaje" value={formData.lenguaje} onChange={handleChange} />
          </Grid2>
        </Section>
    
        {/* OBSERVACIONES */}
        <Section title="Observaciones Generales">
          <textarea
            name="observacionesAlumno"
            value={formData.observacionesAlumno}
            onChange={handleChange}
            rows={4}
            className="border p-2 rounded w-full"
            placeholder="Observaciones sobre el alumno"
          />
        </Section>
    
        {/* BOTÓN GUARDAR */}
        <div className="text-center mt-6">
          <button type="submit" className="bg-green-600 text-white font-bold px-6 py-2 rounded hover:bg-green-700">
            Guardar Cambios
          </button>
        </div>
    
      </form>
    )}
    </div>
  );
}
function Section({ children, title }: { children: React.ReactNode; title: string; }) {
  return (
    <div>
      <h2 className="text-xl font-semibold mt-8 mb-4 text-pink-700">{title}</h2>
      {children}
    </div>
  );
}

function Grid2({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{children}</div>;
}

function Grid3({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-1 md:grid-cols-3 gap-4">{children}</div>;
}

interface InputProps {
  name: keyof FormData;
  label: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<any>) => void;
}

function Input({ name, label, type = "text", value, onChange }: InputProps) {
  return (
    <div className="flex flex-col">
      <label htmlFor={name} className="mb-1 font-medium">{label}</label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        className="border p-2 rounded w-full"
        required
      />
    </div>
  );
}
