export default function WelcomeBanner_admin() {
    return (
      <div className="bg-gradient-to-r from-pink-100 to-white rounded-lg p-4 mb-6 flex items-center">
        <div>
          <h2 className="text-xl font-bold text-pink-700">BIENVENIDO COLABORADOR ADMINISTRATIVO!!!</h2>
          <p className="text-gray-600">Sistema de cobros y servicios.</p>
        </div>
        <img 
          src="/banner_pic.jpg" 
          alt="Dashboard illustration" 
          className="ml-auto hidden md:block w-50 h-auto object-contain"
        />
      </div>
    );
  }