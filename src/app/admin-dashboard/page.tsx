import WelcomeBanner from "../components/welcomeBanner_admin/WelcomeBanner_admin";
import NotificationSection from "../components/notificationSection/notificationSection";
import PaymentCalendar from "../components/paymentCalendar/PaymentCalendar";
import { supabase } from "@/app/lib/supabaseClient";
export default function DashboardPage() {
  return (
    <div className="flex-grow">
      {/* Renderiza el banner de bienvenida en la parte superior de la página */}
      <WelcomeBanner />
      
      {/* Contenedor con diseño de cuadrícula para organizar los componentes en dos columnas en pantallas medianas en adelante */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Renderiza la sección de notificaciones */}
        <NotificationSection />
        
        {/* Renderiza el calendario de pagos */}
        <PaymentCalendar />
      </div>
    </div>
  );
}