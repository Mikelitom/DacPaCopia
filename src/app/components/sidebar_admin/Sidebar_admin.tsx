"use client";
import { useState } from "react";
import {
  Home, User, LogOut, Menu, UserPen, UserPlus, BookOpenCheck,
  ShoppingCart, ChevronDown, ChevronUp, Book, DollarSign, Package, List, Trash,
  Handshake, Calendar, Briefcase, BookUser
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface SidebarDropdownProps {
  icon: any;
  text: string;
  isOpen: boolean;
  subItems?: { icon: any; href: string; text: string; }[];
}

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <aside
      className={`h-screen bg-pink-200 text-black p-4 transition-all ${isOpen ? "w-64" : "w-20"}`}
    >
      {/* Botón para colapsar */}
      <button
        className="mb-6 flex items-center gap-2"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Menu className="w-6 h-6" />
        {isOpen && <span className="text-lg font-bold">Menú</span>}
      </button>

      {/* Enlaces de navegación */}
      <nav className="space-y-4">
        <SidebarItem href="/dashboard-dashboard" icon={Home} text="Inicio" isOpen={isOpen} />
        <SidebarItem href="/perfil" icon={UserPen} text="Perfil" isOpen={isOpen} />
        <SidebarItem href="/alumnos" icon={User} text="Alumnos" isOpen={isOpen} />

        {/* Colegiaturas */}
        <SidebarDropdown
          icon={BookOpenCheck}
          text="Colegiaturas"
          isOpen={isOpen}
          subItems={[
            { icon: DollarSign, href: "/admin-dashboard/colegiaturas/pagos", text: "Pagos" },
            { icon: Handshake, href: "/admin-dashboard/colegiaturas/convenios", text: "Convenios" },
            
          ]}
        />

        {/* Inventario */}
        <SidebarDropdown
          icon={Package}
          text="Inventario"
          isOpen={isOpen}
          subItems={[
            { icon: List, href: "/inventario/articulos", text: "Artículos" },
            { icon: ShoppingCart, href: "/inventario/nuevo-articulo", text: "Nuevo Artículo" },
            { icon: Trash, href: "/inventario/mermas", text: "Mermas" }
          ]}
        />

        <SidebarItem href="/reportes" icon={List} text="Reportes" isOpen={isOpen} />
        <SidebarItem href="/usuarios" icon={BookUser} text="Usuarios" isOpen={isOpen} />

        {/* Salir */}
        <div className="absolute bottom-4 gap-4 p-3">
          <SidebarItem href="/" icon={LogOut} text="Salir" isOpen={isOpen} />
        </div>
      </nav>
    </aside>
  );
}

function SidebarItem({ href, icon: Icon, text, isOpen }: { href: string; icon: any; text: string; isOpen: boolean }) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link href={href} className={`flex items-center gap-4 p-3 rounded-md transition-all ${
      isActive ? "bg-pink-300 text-white" : "hover:bg-pink-300"
    }`}>
      <Icon className="w-6 h-6" />
      {isOpen && <span>{text}</span>}
    </Link>
  );
}

function SidebarDropdown({ icon: Icon, text, isOpen, subItems }: SidebarDropdownProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div>
      {/* Botón principal del dropdown */}
      <div
        className="flex items-center justify-between gap-4 p-3 hover:bg-pink-300 rounded-md cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-4">
          <Icon className="w-6 h-6" />
          {isOpen && <span>{text}</span>}
        </div>
        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </div>

      {/* Subítems del dropdown */}
      {isExpanded && (
        <div className="ml-6 mt-2 space-y-2">
          {subItems?.map((subItem, index) => (
            <Link key={index} href={subItem.href} className="flex items-center gap-4 p-2 hover:bg-pink-300 rounded-md">
              <subItem.icon className="w-5 h-5" />
              {isOpen && <span>{subItem.text}</span>}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
