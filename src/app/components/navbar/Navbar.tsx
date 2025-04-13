"use client";
import { Bell, UserCircle } from "lucide-react";
import { useDashboard } from "@/contexts/DashboardContext";

export default function Navbar() {
  const { currentTitle, currentUser } = useDashboard();

  return ( 
    <nav className="flex items-center justify-between bg-white p-4 shadow-md">
      {/* Título o logo */}
      <h1 className="text-xl font-bold">{currentTitle}</h1>

      {/* Iconos y perfil */}
      <div className="flex items-center gap-4">
        {/* Notificaciones */}
        <button className="relative p-2 hover:bg-gray-100 rounded-full">
          <Bell className="w-6 h-6" />
          <span className="absolute top-1 right-1 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
            3
          </span>
        </button>

        {/* Perfil */}
        <div className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 p-2 rounded-lg">
          <UserCircle className="w-8 h-8" />
          <span className="font-medium">{currentUser.name}</span>
        </div>
      </div>
    </nav>
  );
}