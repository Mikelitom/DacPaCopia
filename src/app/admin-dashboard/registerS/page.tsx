// registrarStudent/page.tsx
"use client";

import React from "react";
import type { formData as FormDataType } from "./hooks/Registrer_student";
import { useRegistrarStudent } from "./hooks/Registrer_student";

export default function Page() {
  const {
    formData,
    loading,
    handleChange,
    handleRadio,
    handleCheckboxArray,
    handleSubmit,
  } = useRegistrarStudent();

  return (
    <div className="p-6 rounded-xl border border-gray-300 shadow-sm bg-white max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center text-pink-700">
        Registro de Alumno
      </h1>
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* --- Datos Generales --- */}
        <Section title="Datos Generales">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              name="apellidoPaterno"
              label="Apellido Paterno"
              value={formData.apellidoPaterno}
              onChange={handleChange}
            />
            <Input
              name="apellidoMaterno"
              label="Apellido Materno"
              value={formData.apellidoMaterno}
              onChange={handleChange}
            />
            <Input
              name="nombres"
              label="Nombre(s)"
              value={formData.nombres}
              onChange={handleChange}
            />
            <Input
              name="edadAlumno"
              type="number"
              label="Edad"
              value={String(formData.edadAlumno)}
              onChange={handleChange}
            />
            <Input
              name="fechaNacimiento"
              type="date"
              label="Fecha Nacimiento"
              value={formData.fechaNacimiento}
              onChange={handleChange}
            />
            <Input
              name="domicilioAlumno"
              label="Domicilio"
              value={formData.domicilioAlumno}
              onChange={handleChange}
            />
          </div>
        </Section>

        {/* --- Contacto de Emergencia --- */}
        <Section title="Contacto de Emergencia">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              name="contactoEmergenciaNombre"
              label="Nombre"
              value={formData.contactoEmergenciaNombre}
              onChange={handleChange}
            />
            <Input
              name="contactoEmergenciaTelefono"
              type="tel"
              label="Teléfono"
              value={formData.contactoEmergenciaTelefono}
              onChange={handleChange}
            />
            <Input
              name="contactoEmergenciaDomicilio"
              label="Domicilio"
              value={formData.contactoEmergenciaDomicilio}
              onChange={handleChange}
            />
          </div>
        </Section>

        {/* --- Datos del Ingreso --- */}
        <Section title="Datos del Ingreso">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              name="grado"
              label="Grado"
              value={formData.grado}
              onChange={handleChange}
            />
            <Input
              name="grupo"
              label="Grupo"
              value={formData.grupo}
              onChange={handleChange}
            />
            <Input
              name="maestraAlumno"
              label="Maestra"
              value={formData.maestraAlumno}
              onChange={handleChange}
            />
          </div>
        </Section>

        {/* --- Datos Familiares --- */}
        <Section title="Datos Familiares">
          <div className="space-y-4">
            <Input
              name="padreNombre"
              label="Nombre del Padre"
              value={formData.padreNombre}
              onChange={handleChange}
            />
            <Input
              name="padreEdad"
              type="number"
              label="Edad del Padre"
              value={String(formData.padreEdad)}
              onChange={handleChange}
            />
            <Input
              name="padreEscolaridad"
              label="Escolaridad Padre"
              value={formData.padreEscolaridad}
              onChange={handleChange}
            />
            <Input
              name="padreOcupacion"
              label="Ocupación Padre"
              value={formData.padreOcupacion}
              onChange={handleChange}
            />
            <Input
              name="padreCelular"
              type="tel"
              label="Celular Padre"
              value={String(formData.padreCelular)}
              onChange={handleChange}
            />
            <Input
              name="padreTelefonoOficina"
              type="tel"
              label="Teléfono Oficina Padre"
              value={String(formData.padreTelefonoOficina)}
              onChange={handleChange}
            />
            <Input
              name="madreNombre"
              label="Nombre de la Madre"
              value={formData.madreNombre}
              onChange={handleChange}
            />
            <Input
              name="madreEdad"
              type="number"
              label="Edad de la Madre"
              value={String(formData.madreEdad)}
              onChange={handleChange}
            />
            <Input
              name="madreEscolaridad"
              label="Escolaridad Madre"
              value={formData.madreEscolaridad}
              onChange={handleChange}
            />
            <Input
              name="madreOcupacion"
              label="Ocupación Madre"
              value={formData.madreOcupacion}
              onChange={handleChange}
            />
            <Input
              name="madreCelular"
              type="tel"
              label="Celular Madre"
              value={String(formData.madreCelular)}
              onChange={handleChange}
            />
            <Input
              name="madreTelefonoOficina"
              type="tel"
              label="Teléfono Oficina Madre"
              value={String(formData.madreTelefonoOficina)}
              onChange={handleChange}
            />
          </div>
        </Section>

        {/* --- Vivienda y Comunidad --- */}
        <Section title="Vivienda y Comunidad">
          <fieldset className="mb-4">
            <legend className="font-medium mb-2">Tipo de vivienda</legend>
            {[
              "casa sola",
              "departamento",
              "cuarto",
              "propio",
              "rentada",
              "otros",
            ].map((opt) => (
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <Input
              name="numCuartos"
              label="Número de cuartos"
              type="number"
              value={String(formData.numCuartos)}
              onChange={handleChange}
            />
            <Input
              name="tipoConstruccion"
              label="Tipo de construcción"
              value={formData.tipoConstruccion}
              onChange={handleChange}
            />
          </div>
          <div className="mb-4">
            <span className="font-medium">Servicios de la vivienda</span>
            <div className="mt-2 flex flex-wrap gap-4">
              {["agua", "drenaje", "electricidad", "telefono", "gas"].map(
                (opt) => (
                  <label key={opt} className="inline-flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.serviciosVivienda.includes(opt)}
                      onChange={(e) =>
                        handleCheckboxArray(
                          "serviciosVivienda",
                          opt,
                          e.target.checked
                        )
                      }
                      className="form-checkbox"
                    />
                    <span className="ml-2">{opt}</span>
                  </label>
                )
              )}
            </div>
          </div>
          <div>
            <span className="font-medium">Servicios de la comunidad</span>
            <div className="mt-2 flex flex-wrap gap-4">
              {[
                "alumbrado público",
                "calles pavimentadas",
                "alcantarillado",
                "telefono",
                "transporte público",
              ].map((opt) => (
                <label key={opt} className="inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.serviciosComunidad.includes(opt)}
                    onChange={(e) =>
                      handleCheckboxArray(
                        "serviciosComunidad",
                        opt,
                        e.target.checked
                      )
                    }
                    className="form-checkbox"
                  />
                  <span className="ml-2">{opt}</span>
                </label>
              ))}
            </div>
          </div>
        </Section>

        {/* --- Prenatal / Postnatal --- */}
        <Section title="Antecedentes Prenatales y Postnatales">
          {["Normal", "Prematuro"].map((opt) => (
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
          {["Normal", "Complicaciones"].map((opt) => (
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
          {["Pecho", "Mamila"].map((opt) => (
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
          <Input
            name="tiempo_lactancia"
            label="Tiempo de lactancia"
            value={formData.tiempo_lactancia}
            onChange={handleChange}
          />
        </Section>

        {/* --- Desarrollo --- */}
        <Section title="Historia de Desarrollo">
          <Input
            name="talla"
            type="number"
            label="Talla"
            value={String(formData.talla)}
            onChange={handleChange}
          />
          <Input
            name="peso"
            type="number"
            label="Peso"
            value={String(formData.peso)}
            onChange={handleChange}
          />
          {["Sí", "No"].map((opt) => (
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
          {formData.tieneMalformacion === "Sí" && (
            <Input
              name="malformaciones"
              label="Malformaciones"
              value={formData.malformaciones}
              onChange={handleChange}
            />
          )}
          <Textarea
            name="enfermedades"
            label="Enfermedades"
            value={formData.enfermedades}
            onChange={handleChange}
          />
          <Textarea
            name="alergias"
            label="Alergias"
            value={formData.alergias}
            onChange={handleChange}
          />
          <fieldset>
            <legend className="font-medium mb-2">Vacunas</legend>
            {["Triple", "Sarampión", "Polio", "Tuberculosis"].map((opt) => (
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
          {["Sí", "No"].map((opt) => (
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
          {formData.tieneServicioMedico === "Sí" && (
            <Input
              name="servicio_medico"
              label="Servicio Médico"
              value={formData.servicio_medico}
              onChange={handleChange}
            />
          )}
          <Input
            name="control_esfinteres_diurno"
            label="Control esfínteres diurno"
            value={formData.control_esfinteres_diurno}
            onChange={handleChange}
          />
          <Input
            name="control_esfinteres_nocturno"
            label="Control esfínteres nocturno"
            value={formData.control_esfinteres_nocturno}
            onChange={handleChange}
          />
          <Input
            name="horas_sueño"
            type="number"
            label="Horas de sueño"
            value={String(formData.horas_sueño)}
            onChange={handleChange}
          />
          {["Tranquilo", "Intranquilo"].map((opt) => (
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
          {["Sí", "No"].map((opt) => (
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
          {formData.comparteCama === "Sí" && (
            <Input
              name="tipo_cama"
              label="Con quién comparte cama"
              value={formData.tipo_cama}
              onChange={handleChange}
            />
          )}
          <Input
            name="desayuno"
            label="Desayuno"
            value={formData.desayuno}
            onChange={handleChange}
          />
          <Input
            name="comida"
            label="Comida"
            value={formData.comida}
            onChange={handleChange}
          />
          <Input
            name="cena"
            label="Cena"
            value={formData.cena}
            onChange={handleChange}
          />
          <Input
            name="edad_camino"
            type="number"
            label="Edad caminó"
            value={String(formData.edad_camino)}
            onChange={handleChange}
          />
          <Input
            name="edad_hablo"
            type="number"
            label="Edad habló"
            value={String(formData.edad_hablo)}
            onChange={handleChange}
          />
          {["Diestro", "Zurdo", "No definido"].map((opt) => (
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
          <Textarea
            name="lenguaje"
            label="Lenguaje"
            value={formData.lenguaje}
            onChange={handleChange}
          />
        </Section>

        {/* --- Observaciones --- */}
        <Section title="Observaciones">
          <Textarea
            name="observacionesAlumno"
            label="Observaciones generales"
            value={formData.observacionesAlumno}
            onChange={handleChange}
          />
        </Section>

        {/* --- Botón enviar --- */}
        <div className="flex justify-center">
          <button
            type="submit"
            disabled={loading}
            className="bg-[#FFE0E3] hover:bg-[#ffccd4] text-black font-semibold py-2 px-6 rounded-lg transition disabled:opacity-50"
          >
            {loading ? "Guardando…" : "Registrar"}
          </button>
        </div>
      </form>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="p-6 rounded-xl border border-gray-300 shadow-sm bg-white space-y-4">
      <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
      {children}
    </div>
  );
}

interface InputProps {
  name: keyof FormDataType;
  label: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

function Input({ name, label, type = "text", value, onChange }: InputProps) {
  return (
    <div className="flex flex-col">
      <label htmlFor={name} className="mb-1 font-medium text-gray-700">
        {label}
      </label>
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

interface TextareaProps {
  name: keyof FormDataType;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

function Textarea({ name, label, value, onChange }: TextareaProps) {
  return (
    <div className="flex flex-col">
      <label htmlFor={name} className="mb-1 font-medium text-gray-700">
        {label}
      </label>
      <textarea
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        rows={3}
        required
        className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400"
      />
    </div>
  );
}
