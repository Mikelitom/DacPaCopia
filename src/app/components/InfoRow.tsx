import React from 'react'; // Importa React

// Define la interfaz para las propiedades del componente InfoRow
interface InfoRowProps {
  label: string; // Etiqueta que describe el valor
  value: string; // Valor que se mostrará
}

// Componente funcional InfoRow
const InfoRow: React.FC<InfoRowProps> = ({ label, value }) => (
  <div className="flex flex-col"> {/* Contenedor que utiliza flexbox para organizar el contenido en columnas */}
    <span className="text-sm text-gray-600 mb-1">{label}</span> {/* Etiqueta con estilo de texto pequeño y color gris */}
    <span className="font-medium">{value}</span> {/* Valor con estilo de texto en negrita */}
  </div>
);

// Exporta el componente para su uso en otras partes de la aplicación
export default InfoRow;