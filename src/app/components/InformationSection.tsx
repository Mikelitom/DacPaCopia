import React from 'react'; // Importa React

// Define la interfaz para las propiedades del componente InformationSection
interface InformationSectionProps {
  title: string; // Título de la sección
  children: React.ReactNode; // Contenido que se pasará como hijos
}

// Componente funcional InformationSection
const InformationSection: React.FC<InformationSectionProps> = ({ title, children }) => (
  <div className="border rounded-lg p-4"> {/* Contenedor con borde, esquinas redondeadas y padding */}
    <h2 className="text-lg font-semibold mb-4">{title}</h2> {/* Título de la sección con estilo */}
    <div className="grid grid-cols-2 gap-4"> {/* Contenedor de cuadrícula para organizar el contenido en dos columnas */}
      {children} {/* Renderiza los elementos hijos dentro de la cuadrícula */}
    </div>
  </div>
);

// Exporta el componente para su uso en otras partes de la aplicación
export default InformationSection;