"use client";

import React, { useState } from "react";
import { supabase } from "@/app/lib/supabaseClient";

// Estructura de datos del formulario incluyendo datos familiares
interface FormData {
  
  // Datos generales del niño
  apellidoPaterno: string;
  apellidoMaterno: string;
  nombres: string;
  edadAlumno: number;
  fechaNacimiento: string; 
  domicilioAlumno: string;

  // Datos de contacto de emergencia
  contactoEmergenciaNombre: string;
  contactoEmergenciaTelefono: string;
  contactoEmergenciaDomicilio: string;

  // Datos de ingreso
  grado: string;
  grupo: string;
  maestraAlumno: string;

  // Datos del padre
  padreNombre: string;
  padreEdad: number;
  padreEscolaridad: string;
  padreOcupacion: string;
  padreCelular: number;
  padreTelefonoOficina: number;

  // Datos de la madre
  madreNombre: string;
  madreEdad: number;
  madreEscolaridad: string;
  madreOcupacion: string;
  madreCelular: number;
  madreTelefonoOficina: number;

  // Vivienda y Comunidad
  tipoVivienda: string;                  
  otrosTipoVivienda: string;             
  numCuartos: number;
  tipoConstruccion: string;
  serviciosVivienda: string[];          
  serviciosComunidad: string[];        

  // Antecedentes prenatales y postnatales
  embarazo: string; 
  parto: "",
  lactancia: "",
  tiempo_lactancia: "",
  
  // Desarrollo del niño
  talla: number; 
  peso: number,
  tieneMalformacion: "" | "Sí" | "No",
  malformaciones: "",
  enfermedades: "",
  alergias: "",
  vacunas: string[],
  tieneServicioMedico: "" | "Sí" | "No",
  servicio_medico: "",
  control_esfinteres_diurno: "",
  control_esfinteres_nocturno: "",
  horas_sueño: number,
  tipo_sueño: "",
  comparteCama: "" | "Sí" | "No",
  tipo_cama: "", 
  desayuno: "",
  comida: "",
  cena: "",
  edad_camino: number,
  edad_hablo: number,
  lateralidad: "",
  lenguaje: "",
//Observaciones
  observacionesAlumno: "",
}
const initialFormData: FormData = {
  apellidoPaterno: "",
  apellidoMaterno: "",
  nombres: "",
  edadAlumno: 0,
  fechaNacimiento: "",
  domicilioAlumno: "",
  contactoEmergenciaNombre: "",
  contactoEmergenciaTelefono: "",
  contactoEmergenciaDomicilio: "",
  grado: "",
  grupo: "",
  maestraAlumno: "",
  padreNombre: "",
  padreEdad: 0,
  padreEscolaridad: "",
  padreOcupacion: "",
  padreCelular: 0,
  padreTelefonoOficina: 0,
  madreNombre: "",
  madreEdad: 0,
  madreEscolaridad: "",
  madreOcupacion: "",
  madreCelular: 0,
  madreTelefonoOficina: 0,
  tipoVivienda: "",
  otrosTipoVivienda: "",
  numCuartos: 0,
  tipoConstruccion: "",
  serviciosVivienda: [],
  serviciosComunidad: [],
  embarazo: "",
  parto: "",
  lactancia: "",
  tiempo_lactancia: "",
  talla: 0,
  peso: 0,
  tieneMalformacion: "",
  malformaciones: "",
  enfermedades: "",
  alergias: "",
  vacunas: [],
  tieneServicioMedico: "",
  servicio_medico: "",
  control_esfinteres_diurno: "",
  control_esfinteres_nocturno: "",
  horas_sueño: 0,
  tipo_sueño: "",
  comparteCama: "",
  tipo_cama: "",
  desayuno: "",
  comida: "",
  cena: "",
  edad_camino: 0,
  edad_hablo: 0,
  lateralidad: "",
  lenguaje: "",
  observacionesAlumno: "",
};
export default function RegistrerStudent() {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [loading, setLoading] = useState(false);

  // Maneja cambios de todos los inputs
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    if (name === "vacunas") {
      setFormData((prev) => {
        const setVac = new Set(prev.vacunas);
        if (checked) setVac.add(value);
        else setVac.delete(value);
        return { ...prev, vacunas: Array.from(setVac) };
      });
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "number" ? Number(value) : value,
      }));
    }
  };  

   // Manejador para radio (tipo de vivienda)
   const handleRadio = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
      ...(name === "tipoVivienda" && value !== "otros" ? { otrosTipoVivienda: "" } : {}),
    }));
  };
  
  // Manejador multi-checkbox para servicios
  const handleCheckboxArray = (
    field: "serviciosVivienda" | "serviciosComunidad",
    value: string,
    checked: boolean
  ) => {
    setFormData(prev => {
      const arr = new Set(prev[field]);
      if (checked) arr.add(value);
      else arr.delete(value);
      return { ...prev, [field]: Array.from(arr) } as any;
    });
  };

  // Envío del formulario: primero padre, luego madre, luego alumno
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // 1) Insertar padre
      const { data: padreData, error: padreError } = await supabase
      .from("PadreFamilia")
      .insert([{ 
        nombre: formData.nombres, 
        edad: formData.padreEdad, 
        escolaridad: formData.padreEscolaridad,
        ocupacion: formData.padreOcupacion,
        celular: formData.padreCelular, 
        telefono_oficina: formData.padreTelefonoOficina 
      }])
      .select("id_padre");

      if (padreError || !padreData) throw padreError;
      const id_padre = padreData[0].id_padre;

      // 2) Insertar madre
      const { data: madreData, error: madreError } = await supabase
        .from("MadreDf")
        .insert([{ 
          madreNombre: formData.madreNombre,
          madreEdad: formData.madreEdad,
          madreEscolaridad: formData.madreEscolaridad,
          madreOcupacion: formData.madreOcupacion,
          madreCelular: formData.madreCelular,
          madreTelefonoOficina: formData.madreTelefonoOficina
        }])
        .select("idMadre");
      if (madreError || !madreData) throw madreError;
      const idMadre = madreData[0].idMadre;

      // 3) Insertar alumno enlazado al padre recién creado
      const { data: alumnoData, error: alumnoError } = await supabase
        .from("Alumno")
        .insert([{ 
          id_padre,
          idMadre,
          apellido_paterno: formData.apellidoPaterno,
          apellido_materno: formData.apellidoMaterno,
          nombre: formData.nombres,
          edadAlumno: formData.edadAlumno,
          fecha_nacimiento: formData.fechaNacimiento,
          domicilioAlumno: formData.domicilioAlumno,
          grado: formData.grado,
          grupo: formData.grupo,
          maestraAlumno: formData.maestraAlumno,
          fecha_inscripción: new Date().toISOString().split('T')[0],
          estado: 'activo',
          convenio: false
        }])
        .select("id_alumno");
      if (alumnoError || !alumnoData) throw alumnoError;
      const newId = alumnoData[0].id_alumno;

      // 4) Insertar contacto de emergencia
      const { error: contactoError } = await supabase
        .from("ContactoEmergencia")
        .insert([
          {
            id_alumno: newId,
            nombre: formData.contactoEmergenciaNombre,
            telefono: formData.contactoEmergenciaTelefono,
            domicilio: formData.contactoEmergenciaDomicilio,
          },
        ]);
      if (contactoError) throw contactoError;
      
      // 4) características de vivienda y comunidad
      const tipo = formData.tipoVivienda === "otros"
        ? formData.otrosTipoVivienda
        : formData.tipoVivienda;
        const { error: viviendaError } = await supabase
        .from("ViviendayComunidad")
        .insert([{
          id_alumno: newId,
          tipoVivienda: tipo,
          numCuartos: formData.numCuartos,
          tipoConstruccion: formData.tipoConstruccion,
          serviciosVivienda: formData.serviciosVivienda,
          serviciosComunidad: formData.serviciosComunidad
        }]);
    
        if (viviendaError) throw viviendaError;

        // 5) Insertar antecedentes prenatales y postnatales
        const { error } = await supabase
        .from("HistoriaDesarrollo")
        .insert([{
          id_alumno: newId, 
          embarazo: formData.embarazo,
          parto: formData.parto,
          lactancia: formData.lactancia,
          tiempo_lactancia: formData.tiempo_lactancia,
          talla: formData.talla,
          peso: formData.peso,
          malformaciones: formData.tieneMalformacion === "Sí" ? formData.malformaciones : "",
          enfermedades: formData.enfermedades,
          alergias: formData.alergias,
          vacunas: formData.vacunas.join(", "),
          servicio_medico: formData.tieneServicioMedico === "Sí" ? formData.servicio_medico : "",
          control_esfinteres_diurno: formData.control_esfinteres_diurno,
          control_esfinteres_nocturno: formData.control_esfinteres_nocturno,
          horas_sueño: formData.horas_sueño,
          tipo_sueño: formData.tipo_sueño,
          tipo_cama: formData.comparteCama === "Sí" ? formData.tipo_cama : "Duerme solo",
          desayuno: formData.desayuno,
          comida: formData.comida,
          cena: formData.cena,
          edad_camino: formData.edad_camino,
          edad_hablo: formData.edad_hablo,
          lateralidad: formData.lateralidad,
          lenguaje: formData.lenguaje,
          // 7) Insertar Observaciones
          observacionesAlumno: formData.observacionesAlumno,
        }]);

      if (error) throw error;
        

      alert(`✅ Alumno registrado con éxito (ID: ${newId})`);
      // sólo en caso de éxito reseteamos el formulario
      setFormData(initialFormData);

    } catch (err: any) {
      console.error("ERROR COMPLETO:", err);
      const msg = err?.message ?? err?.error ?? JSON.stringify(err);
      alert(`❌ Error al registrar estudiante: ${msg}`);
    } finally{
      // reactivamos el botón siempre
      setLoading(false);
    }
    
  };

  return (
    <div className="p-6 rounded-xl border border-gray-300 shadow-sm bg-white">
      <h1 className="text-2xl font-bold mb-6 text-center text-pink-700">
        Registro de Alumno
      </h1>
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Sección: Datos Generales */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Datos Generales</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input name="apellidoPaterno" label="Apellido Paterno" value={formData.apellidoPaterno} onChange={handleChange} />
            <Input name="apellidoMaterno" label="Apellido Materno" value={formData.apellidoMaterno} onChange={handleChange} />
            <Input name="nombres" label="Nombre(s)" value={formData.nombres} onChange={handleChange} />
            <Input name="edadAlumno" type="number" label="Edad" value={String(formData.edadAlumno)} onChange={handleChange} />
            <Input name="fechaNacimiento" type="date" label="Fecha de Nacimiento" value={formData.fechaNacimiento} onChange={handleChange} />
            <Input name="domicilioAlumno" label="Domicilio" value={formData.domicilioAlumno} onChange={handleChange} />
          </div>
        </div>
        {/* Sección: Contacto de Emergencia */}
        <div className="p-6 rounded-xl border border-gray-300 shadow-sm bg-white">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Contacto de Emergencia</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input name="contactoEmergenciaNombre" label="Nombre" value={formData.contactoEmergenciaNombre} onChange={handleChange} />
            <Input name="contactoEmergenciaTelefono" type="tel" label="Teléfono" value={formData.contactoEmergenciaTelefono} onChange={handleChange} />
            <Input name="contactoEmergenciaDomicilio" label="Domicilio" value={formData.contactoEmergenciaDomicilio} onChange={handleChange} />
          </div>
        </div>
        {/* Sección: Datos del Ingreso */}
        <div className="p-6 rounded-xl border border-gray-300 shadow-sm bg-white">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Datos del Ingreso</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input name="grado" label="Grado" value={formData.grado} onChange={handleChange} />
            <Input name="grupo" label="Grupo" value={formData.grupo} onChange={handleChange} />
            <Input name="maestraAlumno" label="Maestra" value={formData.maestraAlumno} onChange={handleChange} />
          </div>
        </div>
        {/* Sección: Datos Familiares */}
        <div className="p-6 rounded-xl border border-gray-300 shadow-sm bg-white">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Datos Familiares</h2>
            {/* Padre */}
            <Input name="padreNombre" label="Nombre del Padre" value={formData.padreNombre} onChange={handleChange} />
            <Input name="padreEdad" type="number" label="Edad del Padre" value={String(formData.padreEdad)} onChange={handleChange} />
            <Input name="padreEscolaridad" label="Escolaridad Padre" value={formData.padreEscolaridad} onChange={handleChange} />
            <Input name="padreOcupacion" label="Ocupación Padre" value={formData.padreOcupacion} onChange={handleChange} />
            <Input name="padreCelular" type="tel" label="Celular Padre" value={String(formData.padreCelular)} onChange={handleChange} />
            <Input name="padreTelefonoOficina" type="tel" label="Teléfono Oficina Padre" value={String(formData.padreTelefonoOficina)} onChange={handleChange} />
            {/* Madre */}
            <Input name="madreNombre" label="Nombre de la Madre" value={formData.madreNombre} onChange={handleChange} />
            <Input name="madreEdad" type="number" label="Edad de la Madre" value={String(formData.madreEdad)} onChange={handleChange} />
            <Input name="madreEscolaridad" label="Escolaridad Madre" value={formData.madreEscolaridad} onChange={handleChange} />
            <Input name="madreOcupacion" label="Ocupación Madre" value={formData.madreOcupacion} onChange={handleChange} />
            <Input name="madreCelular" type="tel" label="Celular Madre" value={String(formData.madreCelular)} onChange={handleChange} />
            <Input name="madreTelefonoOficina" type="tel" label="Teléfono Oficina Madre" value={String(formData.madreTelefonoOficina)} onChange={handleChange} />
          </div>
           {/* Características de Vivienda y Comunidad */}
        <div className="p-6 rounded-xl border border-gray-300 shadow-sm bg-white">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Características de la vivienda y la comunidad
          </h2>

          {/* Tipo de vivienda (selección única) */}
          <fieldset className="mb-4">
            <legend className="font-medium mb-2">Tipo de vivienda</legend>
            {[
              "casa sola",
              "departamento",
              "cuarto",
              "propio",
              "rentada",
              "otros"
            ].map(opt => (
              <label key={opt} className="inline-flex items-center mr-4">
                <input
                  type="radio"
                  name="tipoVivienda"
                  value={opt}
                  checked={formData.tipoVivienda === opt}
                  onChange={handleRadio}
                  className="form-radio"
                  required
                />
                <span className="ml-2">{opt}</span>
              </label>
            ))}
            {formData.tipoVivienda === "otros" && (
              <input
                type="text"
                name="otrosTipoVivienda"
                placeholder="Especifique..."
                value={formData.otrosTipoVivienda}
                onChange={handleChange}
                className="mt-2 border border-gray-300 rounded px-2 py-1 w-full"
                required
              />
            )}
          </fieldset>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            {/* Número de cuartos */}
            <Input
              name="numCuartos"
              label="Número de cuartos"
              type="number"
              value={String(formData.numCuartos)}
              onChange={handleChange}
            />
            {/* Tipo de construcción */}
            <Input
              name="tipoConstruccion"
              label="Tipo de construcción"
              value={formData.tipoConstruccion}
              onChange={handleChange}
            />
          </div>

          {/* Servicios de la vivienda (múltiple) */}
          <div className="mb-4">
            <span className="font-medium">Servicios de la vivienda</span>
            <div className="mt-2 flex flex-wrap gap-4">
              {["agua", "drenaje", "electricidad", "telefono", "gas"].map(opt => (
                <label key={opt} className="inline-flex items-center">
                  <input
                    type="checkbox"
                    onChange={e =>
                      handleCheckboxArray(
                        "serviciosVivienda",
                        opt,
                        e.target.checked
                      )
                    }
                    checked={formData.serviciosVivienda.includes(opt)}
                    className="form-checkbox"
                  />
                  <span className="ml-2">{opt}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Servicios de la comunidad (múltiple) */}
          <div >
            <span className="font-medium">Servicios de la comunidad</span>
            <div className="mt-2 flex flex-wrap gap-4">
              {[
                "alumbrado público",
                "calles pavimentadas",
                "alcantarillado",
                "telefono",
                "transporte público"
              ].map(opt => (
                <label key={opt} className="inline-flex items-center">
                  <input
                    type="checkbox"
                    onChange={e =>
                      handleCheckboxArray(
                        "serviciosComunidad",
                        opt,
                        e.target.checked
                      )
                    }
                    checked={formData.serviciosComunidad.includes(opt)}
                    className="form-checkbox"
                  />
                  <span className="ml-2">{opt}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
        {/*  Antecedentes Prenatales y Postnatales */}
        <div className="p-6 rounded-xl border border-gray-300 shadow-sm bg-white">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Registro de Antecedentes Prenatales y Postnatales
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Embarazo */}
            <fieldset>
              <legend className="font-medium mb-2">¿Cómo fue el embarazo?</legend>
              {["Normal", "Prematuro"].map(opt => (
                <label key={opt} className="block mb-2">
                  <input
                    type="radio"
                    name="embarazo"
                    value={opt}
                    checked={formData.embarazo === opt}
                    onChange={handleChange}
                    required
                    className="form-radio mr-2"
                  />
                  {opt}
                </label>
              ))}
            </fieldset>
            <fieldset>
          <legend className="font-medium mb-2">¿Cómo fue el parto?</legend>
          {["Normal", "Complicaciones"].map(opt => (
            <label key={opt} className="block mb-2">
              <input
                type="radio"
                name="parto"
                value={opt}
                checked={formData.parto === opt}
                onChange={handleChange}
                required
                className="form-radio mr-2"
              />
              {opt}
            </label>
          ))}
        </fieldset>

        {/* Lactancia */}
        <fieldset>
          <legend className="font-medium mb-2">Tipo de lactancia</legend>
          {["Pecho", "Mamila"].map(opt => (
            <label key={opt} className="block mb-2">
              <input
                type="radio"
                name="lactancia"
                value={opt}
                checked={formData.lactancia === opt}
                onChange={handleChange}
                required
                className="form-radio mr-2"
              />
              {opt}
            </label>
          ))}
        </fieldset>

        {/* Tiempo de lactancia */}
        <div>
          <label className="font-medium">¿Cuánto tiempo fue lactancia?</label>
          <input
            type="text"
            name="tiempo_lactancia"
            value={formData.tiempo_lactancia}
            onChange={handleChange}
            placeholder="Ej: 6 meses"
            required
            className="mt-1 border border-gray-300 rounded px-3 py-2 w-full"
          />
        </div>
          </form>
        </div>
        {/* Sección: Historia del Desarrollo Del Niño */}
        <div className="p-6 rounded-xl border border-gray-300 shadow-sm bg-white">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Historia de Desarrollo
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Talla */}
        <Input label="Talla" name="talla" value={String(formData.talla)} onChange={handleChange} />

        {/* Peso */}
        <Input label="Peso" name="peso" value={String(formData.peso)} onChange={handleChange} />
         {/* Malformaciones */}
         <fieldset>
          <legend className="font-medium mb-2">¿Presenta alguna malformación aparente?</legend>
          {["Sí", "No"].map(opt => (
            <label key={opt} className="block mb-2">
              <input
                type="radio"
                name="tieneMalformacion"
                value={opt}
                checked={formData.tieneMalformacion === opt}
                onChange={handleChange}
                required
                className="form-radio mr-2"
              />
              {opt}
            </label>
          ))}
        </fieldset>

        {formData.tieneMalformacion === "Sí" && (
          <div>
            <label className="font-medium">Describe la malformación:</label>
            <input
              type="text"
              name="malformaciones"
              value={formData.malformaciones}
              onChange={handleChange}
              required
              className="mt-1 border border-gray-300 rounded px-3 py-2 w-full"
              placeholder="Ej: Labio leporino, pie plano..."
            />
          </div>
        )}

        {/* Enfermedades */}
        <div>
          <label className="font-medium">Enfermedades que padece</label>
          <textarea
            name="enfermedades"
            value={formData.enfermedades}
            onChange={handleChange}
            rows={3}
            className="mt-1 border border-gray-300 rounded px-3 py-2 w-full"
            placeholder="Ej: Asma, bronquitis, etc."
          />
        </div>

        {/* Alergias */}
        <div>
          <label className="font-medium">Alergias que padece</label>
          <textarea
            name="alergias"
            value={formData.alergias}
            onChange={handleChange}
            rows={3}
            className="mt-1 border border-gray-300 rounded px-3 py-2 w-full"
            placeholder="Ej: Alergia al polen, alimentos, medicamentos..."
          />
        </div>
         {/* Vacunas */}
         <fieldset>
          <legend className="font-medium mb-2">Vacunas y refuerzos recibidos</legend>
          {["Triple", "Sarampión", "Polio", "Tuberculosis"].map(opt => (
            <label key={opt} className="block mb-2">
              <input
                type="checkbox"
                name="vacunas"
                value={opt}
                checked={formData.vacunas.includes(opt)}
                onChange={handleChange}
                className="form-checkbox mr-2"
              />
              {opt}
            </label>
          ))}
        </fieldset>
        {/* Servicio médico */}
        <fieldset>
          <legend className="font-medium mb-2">¿Cuenta con servicio médico?</legend>
          {["Sí", "No"].map(opt => (
            <label key={opt} className="block mb-2">
              <input
                type="radio"
                name="tieneServicioMedico"
                value={opt}
                checked={formData.tieneServicioMedico === opt}
                onChange={handleChange}
                required
                className="form-radio mr-2"
              />
              {opt}
            </label>
          ))}
        </fieldset>

        {formData.tieneServicioMedico === "Sí" && (
          <div>
            <label className="font-medium">¿Cuál servicio médico?</label>
            <input
              type="text"
              name="servicio_medico"
              value={formData.servicio_medico}
              onChange={handleChange}
              required
              className="mt-1 border border-gray-300 rounded px-3 py-2 w-full"
              placeholder="Ej: IMSS, ISSSTE, Seguro Privado..."
            />
          </div>
        )}

        {/* Control de esfínteres */}
        <div>
          <label className="font-medium">Edad del control de esfínteres diurno</label>
          <input
            type="text"
            name="control_esfinteres_diurno"
            value={formData.control_esfinteres_diurno}
            onChange={handleChange}
            required
            className="mt-1 border border-gray-300 rounded px-3 py-2 w-full"
            placeholder="Ej: 2 años"
          />
        </div>

        <div>
          <label className="font-medium">Edad del control de esfínteres nocturno</label>
          <input
            type="text"
            name="control_esfinteres_nocturno"
            value={formData.control_esfinteres_nocturno}
            onChange={handleChange}
            required
            className="mt-1 border border-gray-300 rounded px-3 py-2 w-full"
            placeholder="Ej: 3 años"
          />
        </div>
        {/* Horas de sueño */}
        <div>
          <label className="font-medium">¿Cuántas horas duerme?</label>
          <input
            type="number"
            name="horas_sueño"
            value={formData.horas_sueño}
            onChange={handleChange}
            required
            className="mt-1 border border-gray-300 rounded px-3 py-2 w-full"
            placeholder="Ej: 8"
          />
        </div>

        {/* Tipo de sueño */}
        <fieldset>
          <legend className="font-medium mb-2">Tipo de sueño</legend>
          {["Tranquilo", "Intranquilo"].map(opt => (
            <label key={opt} className="block mb-2">
              <input
                type="radio"
                name="tipo_sueño"
                value={opt}
                checked={formData.tipo_sueño === opt}
                onChange={handleChange}
                required
                className="form-radio mr-2"
              />
              {opt}
            </label>
          ))}
        </fieldset>

        {/* Comparte cama */}
        <fieldset>
          <legend className="font-medium mb-2">¿Comparte cama?</legend>
          {["Sí", "No"].map(opt => (
            <label key={opt} className="block mb-2">
              <input
                type="radio"
                name="comparteCama"
                value={opt}
                checked={formData.comparteCama === opt}
                onChange={handleChange}
                required
                className="form-radio mr-2"
              />
              {opt}
            </label>
          ))}
        </fieldset>

        {/* Si comparte cama, ¿con quién? */}
        {formData.comparteCama === "Sí" && (
          <div>
            <label className="font-medium">¿Con quién comparte cama?</label>
            <input
              type="text"
              name="tipo_cama"
              value={formData.tipo_cama}
              onChange={handleChange}
              required
              className="mt-1 border border-gray-300 rounded px-3 py-2 w-full"
              placeholder="Ej: Mamá, Papá, Hermano..."
            />
          </div>
        )}
        {/* Alimentación */}
        <Input label="¿Qué desayuna normalmente?" name="desayuno" value={formData.desayuno} onChange={handleChange} />
        <Input label="¿Qué come normalmente?" name="comida" value={formData.comida} onChange={handleChange} />
        <Input label="¿Qué cena normalmente?" name="cena" value={formData.cena} onChange={handleChange} />

        {/* Edad en que caminó */}
        <Input label="¿A qué edad caminó?" name="edad_camino" value={String(formData.edad_camino)} onChange={handleChange} />

        {/* Edad en que habló */}
        <Input label="¿A qué edad habló?" name="edad_hablo" value={String(formData.edad_hablo)} onChange={handleChange} />

        {/* Lateridad */}
        <fieldset>
          <legend className="font-medium mb-2">Lateridad</legend>
          {["Diestro", "Zurdo", "No definido"].map(opt => (
            <label key={opt} className="block mb-2">
              <input
                type="radio"
                name="lateralidad"
                value={opt}
                checked={formData.lateralidad === opt}
                onChange={handleChange}
                required
                className="form-radio mr-2"
              />
              {opt}
            </label>
          ))}
        </fieldset>

        {/* Descripción del lenguaje */}
        <div>
          <label className="font-medium">Describe brevemente el lenguaje del niño</label>
          <textarea
            name="lenguaje"
            value={formData.lenguaje}
            onChange={handleChange}
            rows={3}
            required
            className="mt-1 border border-gray-300 rounded px-3 py-2 w-full"
            placeholder="Ej: Habla claramente, usa frases cortas, aún balbucea, etc."
          />
        </div>
        </form>
        {/* Sección: Observaciones */}
        {/* Observaciones generales */}
          <div>
            <label className="font-medium">Observaciones generales sobre el alumno</label>
            <textarea
              name="observacionesAlumno"
              value={formData.observacionesAlumno}
              onChange={handleChange}
              rows={4}
              required
              className="mt-1 border border-gray-300 rounded px-3 py-2 w-full"
              placeholder="Ej: Alumno tranquilo, se adapta bien al grupo, requiere apoyo en motricidad fina, etc."
            />
          </div>
        </div>
        {/* Botón de envío */}
        <div className="flex justify-center mt-8">
          <button type="submit" disabled={loading} className="bg-[#FFE0E3] hover:bg-[#ffccd4] text-black font-semibold py-2 px-4 rounded-lg">
            {loading ? "Guardando…" : "Registrar"}
          </button>
        </div>
      </form>
    </div>
  );
}

// Componente de Input reutilizable
interface InputProps {
  name: keyof FormData;
  label: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

function Input({ name, label, type = "text", value, onChange }: InputProps) {
  return (
    <div className="flex flex-col">
      <label htmlFor={name} className="mb-1 font-medium text-gray-700">{label}</label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        required
        className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400"
      />
    </div>
  );
}