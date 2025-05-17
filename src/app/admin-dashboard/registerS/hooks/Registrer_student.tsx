// registrarStudent/hooks/useRegistrarStudent.ts
import { useState } from "react";
import { supabase } from "@/app/lib/supabaseclient";

// Estructura de datos del formulario incluyendo todos los campos
export interface formData {
  // Datos generales del niño
  apellidoPaterno: string;
  apellidoMaterno: string;
  nombres: string;
  edadAlumno: number;
  fechaNacimiento: string;
  domicilioAlumno: string;

  // Contacto de emergencia
  contactoEmergenciaNombre: string;
  contactoEmergenciaTelefono: string;
  contactoEmergenciaDomicilio: string;

  // Datos del ingreso
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

  // Prenatal / Postnatal
  embarazo: string;
  parto: string;
  lactancia: string;
  tiempo_lactancia: string;

  // Desarrollo
  talla: number;
  peso: number;
  tieneMalformacion: "" | "Sí" | "No";
  malformaciones: string;
  enfermedades: string;
  alergias: string;
  vacunas: string[];
  tieneServicioMedico: "" | "Sí" | "No";
  servicio_medico: string;
  control_esfinteres_diurno: string;
  control_esfinteres_nocturno: string;
  horas_sueño: number;
  tipo_sueño: string;
  comparteCama: "" | "Sí" | "No";
  tipo_cama: string;
  desayuno: string;
  comida: string;
  cena: string;
  edad_camino: number;
  edad_hablo: number;
  lateralidad: string;
  lenguaje: string;

  // Observaciones
  observacionesAlumno: string;
}

const initialFormData: formData = {
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

export function useRegistrarStudent() {
  const [formData, setFormData] = useState<formData>(initialFormData);
  const [loading, setLoading] = useState(false);

  // Cambios generales
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

  // Radio para tipo de vivienda
  const handleRadio = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "tipoVivienda" && value !== "otros"
        ? { otrosTipoVivienda: "" }
        : {}),
    }));
  };

  // Checkbox múltiples en arrays
  const handleCheckboxArray = (
    field: "serviciosVivienda" | "serviciosComunidad",
    value: string,
    checked: boolean
  ) => {
    setFormData((prev) => {
      const arr = new Set(prev[field]);
      if (checked) arr.add(value);
      else arr.delete(value);
      return { ...prev, [field]: Array.from(arr) } as any;
    });
  };

  // Envío completo
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // 1) Padre
      const { data: padreData, error: padreError } = await supabase
        .from("PadreFamilia")
        .insert([
          {
            nombre: formData.padreNombre,
            edad: formData.padreEdad,
            escolaridad: formData.padreEscolaridad,
            ocupacion: formData.padreOcupacion,
            celular: formData.padreCelular,
            telefono_oficina: formData.padreTelefonoOficina,
          },
        ])
        .select("id_padre");
      if (padreError || !padreData) throw padreError;
      const id_padre = padreData[0].id_padre;

      // 2) Madre
      const { data: madreData, error: madreError } = await supabase
        .from("MadreDf")
        .insert([
          {
            madreNombre: formData.madreNombre,
            madreEdad: formData.madreEdad,
            madreEscolaridad: formData.madreEscolaridad,
            madreOcupacion: formData.madreOcupacion,
            madreCelular: formData.madreCelular,
            madreTelefonoOficina: formData.madreTelefonoOficina,
          },
        ])
        .select("idMadre");
      if (madreError || !madreData) throw madreError;
      const idMadre = madreData[0].idMadre;

      // 3) Alumno
      const { data: alumnoData, error: alumnoError } = await supabase
        .from("Alumno")
        .insert([
          {
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
            fecha_inscripción: new Date().toISOString().split("T")[0],
            estado: "activo",
            convenio: false,
          },
        ])
        .select("id_alumno");
      if (alumnoError || !alumnoData) throw alumnoError;
      const newId = alumnoData[0].id_alumno;

      // 4) Contacto Emergencia
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

      // 5) Vivienda y Comunidad
      const tipo =
        formData.tipoVivienda === "otros"
          ? formData.otrosTipoVivienda
          : formData.tipoVivienda;
      const { error: viviendaError } = await supabase
        .from("ViviendayComunidad")
        .insert([
          {
            id_alumno: newId,
            tipoVivienda: tipo,
            numCuartos: formData.numCuartos,
            tipoConstruccion: formData.tipoConstruccion,
            serviciosVivienda: formData.serviciosVivienda,
            serviciosComunidad: formData.serviciosComunidad,
          },
        ]);
      if (viviendaError) throw viviendaError;

      // 6) Historia de Desarrollo
      const { error } = await supabase
        .from("HistoriaDesarrollo")
        .insert([
          {
            id_alumno: newId,
            embarazo: formData.embarazo,
            parto: formData.parto,
            lactancia: formData.lactancia,
            tiempo_lactancia: formData.tiempo_lactancia,
            talla: formData.talla,
            peso: formData.peso,
            malformaciones:
              formData.tieneMalformacion === "Sí"
                ? formData.malformaciones
                : "",
            enfermedades: formData.enfermedades,
            alergias: formData.alergias,
            vacunas: formData.vacunas.join(", "),
            servicio_medico:
              formData.tieneServicioMedico === "Sí"
                ? formData.servicio_medico
                : "",
            control_esfinteres_diurno: formData.control_esfinteres_diurno,
            control_esfinteres_nocturno:
              formData.control_esfinteres_nocturno,
            horas_sueño: formData.horas_sueño,
            tipo_sueño: formData.tipo_sueño,
            tipo_cama:
              formData.comparteCama === "Sí"
                ? formData.tipo_cama
                : "Duerme solo",
            desayuno: formData.desayuno,
            comida: formData.comida,
            cena: formData.cena,
            edad_camino: formData.edad_camino,
            edad_hablo: formData.edad_hablo,
            lateralidad: formData.lateralidad,
            lenguaje: formData.lenguaje,
            observacionesAlumno: formData.observacionesAlumno,
          },
        ]);
      if (error) throw error;

      alert(`✅ Alumno registrado con éxito (ID: ${newId})`);
      setFormData(initialFormData);
    } catch (err: any) {
      console.error("ERROR COMPLETO:", err);
      const msg = err?.message ?? JSON.stringify(err);
      alert(`❌ Error al registrar estudiante: ${msg}`);
    } finally {
      setLoading(false);
    }
  };

  return {
    formData,
    loading,
    handleChange,
    handleRadio,
    handleCheckboxArray,
    handleSubmit,
  };
}
