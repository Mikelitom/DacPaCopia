import { Package, Calendar, Bell, LucideIcon } from 'lucide-react'; // Importa íconos de lucide-react

// Define la interfaz para las notificaciones
interface Notification {
  Icon: LucideIcon; // Icono de la notificación
  message: string; // Mensaje de la notificación
  time: string; // Tiempo de la notificación
}

// Componente para mostrar un elemento de notificación
const NotificationItem = ({ Icon, message, time }: Notification) => {
  return (
    <div className="bg-white p-3 rounded-md shadow-sm flex items-center"> {/* Contenedor de la notificación */}
      <Icon className="mr-3 text-pink-500" /> {/* Icono de la notificación */}
      <div>
        <p className="text-sm font-medium">{message}</p> {/* Mensaje de la notificación */}
        <p className="text-xs text-gray-500">{time}</p> {/* Tiempo de la notificación */}
      </div>
    </div>
  );
};

// Componente principal para la sección de notificaciones
export default function NotificationSection() {
  // Lista de notificaciones
  const notifications = [
    {
      icon: Package, // Icono de paquete
      message: "Tu pedido de uniformes está listo", // Mensaje de la notificación
      time: "4h" // Tiempo de la notificación
    },
    {
      icon: Calendar, // Icono de calendario
      message: "Tu próximo pago es para el 30 de noviembre", // Mensaje de la notificación
      time: "4h ago" // Tiempo de la notificación
    }
  ];

  return (
    <div className="bg-gray-50 rounded-lg p-4"> {/* Contenedor de la sección de notificaciones */}
      <div className="flex items-center mb-4"> {/* Contenedor para el título */}
        <Bell className="mr-2 text-pink-500" /> {/* Icono de campana */}
        <h2 className="text-lg font-semibold">Notificaciones</h2> {/* Título de la sección */}
      </div>
      <div className="space-y-3"> {/* Espacio entre los elementos de notificación */}
        {notifications.map((notification, index) => ( // Mapea las notificaciones para crear elementos
          <NotificationItem 
            key={index} // Clave única para cada elemento
            Icon={notification.icon} // Pasa el icono
            message={notification.message} // Pasa el mensaje
            time={notification.time} // Pasa el tiempo
          />
        ))}
        <button className="text-sm text-pink-600 hover:text-pink-800 transition-colors"> {/* Botón para mostrar más notificaciones */}
          Mostrar más
        </button>
      </div>
    </div>
  );
}