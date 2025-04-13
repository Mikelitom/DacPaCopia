export default function WelcomeBanner() {
  return (
    <div className="bg-gradient-to-r from-pink-100 to-white rounded-lg p-4 mb-6 flex items-center"> {/* Contenedor principal con un fondo degradado */}
      <div>
        <h2 className="text-xl font-bold text-pink-700">Bienvenido!!!</h2> {/* Título de bienvenida */}
        <p className="text-gray-600">Sistema de Pagos Y Pedidos</p> {/* Descripción del sistema */}
      </div>
      <img 
        src="/banner_pic.jpg"  // Ruta de la imagen del banner
        alt="Dashboard illustration"  // Texto alternativo para la imagen
        className="ml-auto hidden md:block w-50 h-auto object-contain" // Estilos para la imagen
      />
    </div>
  );
}