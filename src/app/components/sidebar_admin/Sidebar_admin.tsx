"use client";
import { useState, useEffect } from "react";
import {
  Home, User, LogOut, Menu, UserPen, BookOpenCheck,
  ShoppingCart, ChevronDown, ChevronUp, Book, DollarSign, Package, List, Trash,
  Handshake, BookUser, UserPlus
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
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    setRole(storedRole);
  }, []);

  return (
    <aside className={`h-screen bg-pink-200 text-black p-4 transition-all ${isOpen ? "w-64" : "w-20"}`}>
      <button
        className="mb-6 flex items-center gap-2"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Menu className="w-6 h-6" />
        {isOpen && <span className="text-lg font-bold">Menú</span>}
      </button>

      <nav className="space-y-4">
        <SidebarItem href="/admin-dashboard" icon={Home} text="Inicio" isOpen={isOpen} />
        <SidebarItem href="/admin-dashboard/perfil-admin" icon={UserPen} text="Perfil" isOpen={isOpen} />

        <SidebarDropdown
          icon={BookOpenCheck}
          text="Colegiaturas"
          isOpen={isOpen}
          subItems={[
            { icon: Book, href: "/admin-dashboard/colegiaturas/pagos", text: "Pagos" },
            { icon: Handshake, href: "/admin-dashboard/colegiaturas/convenios", text: "Convenios" },
          ]}
        />

        <SidebarItem href="/admin-dashboard/Reportes" icon={List} text="Reportes" isOpen={isOpen} />
        {role === "contador" && (
          <>
        <SidebarItem href="/admin-dashboard/compras" icon={ShoppingCart} text="Compras" isOpen={isOpen} />
        <SidebarDropdown
          icon={Package}
          text="Inventario"
          isOpen={isOpen}
          subItems={[
            { icon: List, href: "/admin-dashboard/inventario/articulos", text: "Articulos" },
            { icon: Trash, href: "/admin-dashboard/inventario/mermas", text: "Mermas" }
          ]}
        /></>
       )}
        {role === "director" && (
          <>
          <SidebarItem href="/admin-dashboard/compras" icon={ShoppingCart} text="Compras" isOpen={isOpen} />
           <SidebarDropdown
          icon={Package}
          text="Inventario"
          isOpen={isOpen}
          subItems={[
            { icon: List, href: "/admin-dashboard/inventario/articulos", text: "Articulos" },
            { icon: Trash, href: "/admin-dashboard/inventario/mermas", text: "Mermas" }
          ]}
        />
        <SidebarItem href="/admin-dashboard/registerS" icon={UserPlus} text="Registrar" isOpen={isOpen} />
        <SidebarItem href="/admin-dashboard/registerC" icon={BookUser} text="Usuarios" isOpen={isOpen} />
        </>
       )}
         {role === "secretario" && (
          <>
        <SidebarItem href="/admin-dashboard/registerS" icon={UserPlus} text="Registrar" isOpen={isOpen} />
        </>
       )}
<<<<<<< HEAD

=======
        <>
        <SidebarItem href="/admin-dashboard/pedidos" icon={Package} text="Listado Pedidos" isOpen={isOpen} />
        </>
>>>>>>> e8228539c0ec718cfe9e3d939363b35f5f760260
        <div className="absolute bottom-4 gap-4 p-3">
          <SidebarItem href="/admin-dashboard/perfil-admin" icon={LogOut} text="Salir" isOpen={isOpen} />
        </div>
      </nav>
    </aside>
  );
}

function SidebarItem({ href, icon: Icon, text, isOpen }: { href: string; icon: any; text: string; isOpen: boolean }) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link href={href} className={`flex items-center gap-4 p-3 rounded-md transition-all ${isActive ? "bg-pink-300 text-white" : "hover:bg-pink-300"}`}>
      <Icon className="w-6 h-6" />
      {isOpen && <span>{text}</span>}
    </Link>
  );
}

function SidebarDropdown({ icon: Icon, text, isOpen, subItems }: SidebarDropdownProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div>
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
