"use client";
import { useState, ElementType, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Home, Settings, LogOut, Menu, UserPen, CircleDollarSign, 
  BookOpenCheck, ShoppingCart, ChevronDown, ChevronUp, 
  Book, Shirt, Store, Package, ChartNoAxesGantt, Trash, ShoppingCartIcon, BookOpen
} from "lucide-react";
import { useDashboard } from "@/contexts/DashboardContext";

interface MenuItem {
  href?: string;
  icon: ElementType;
  text: string;
  subItems?: MenuItem[];
}

const studentsMenu: MenuItem[] = [
  { href: "/dashboard", icon: Home, text: "Inicio" },
  { href: "/dashboard/colegiatura", icon: CircleDollarSign, text: "Colegiatura" },
  { 
    icon: Store, text: "Productos", subItems: [
      { href: "/dashboard/productos/books", icon: Book, text: "Libros" },
      { href: "/dashboard/productos/uniforms", icon: Shirt, text: "Uniforme" }
    ] 
  },
  { href: "/dashboard/carrito", icon: ShoppingCart, text: "Carrito" },
  { href: "/dashboard/estado_cuenta", icon: BookOpenCheck, text: "Estado de Cuenta" },
  { href: "/dashboard/profile", icon: UserPen, text: "Perfil" },
  { href: "/dashboard/settings", icon: Settings, text: "Configuración" }
];

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const menu = studentsMenu;
  const { setCurrentTitle } = useDashboard();
  const pathname = usePathname();

  // Set initial title based on current path when component mounts
  useEffect(() => {
    const currentItem = findCurrentMenuItem(menu, pathname);
    if (currentItem) {
      setCurrentTitle(currentItem.text);
    }
  }, [pathname, menu, setCurrentTitle]);

  // Helper function to find the current menu item based on pathname
  const findCurrentMenuItem = (items: MenuItem[], path: string): MenuItem | null => {
    for (const item of items) {
      if (item.href === path) return item;
      if (item.subItems) {
        const found = item.subItems.find(subItem => subItem.href === path);
        if (found) return found;
      }
    }
    return null;
  };  

  return (
    <aside className={`h-screen bg-pink-200 text-black p-4 transition-all ${isOpen ? "w-64" : "w-20"}`}>

      <button className="mb-6 flex items-center gap-2" onClick={() => setIsOpen(!isOpen)}>
        <Menu className="w-6 h-6" />
        {isOpen && <span className="text-lg font-bold">Menú</span>}
      </button>

      <nav className="space-y-4">
        {menu.map((item, index) =>
          item.subItems ? (
            <SidebarDropdown 
              key={index} 
              {...item} 
              isOpen={isOpen} 
              setCurrentTitle={setCurrentTitle} 
            />
          ) : (
            <SidebarItem 
              key={index} 
              href={item.href!} 
              icon={item.icon} 
              text={item.text} 
              isOpen={isOpen} 
              setCurrentTitle={setCurrentTitle} 
            />
          )
        )}
        <div className="absolute bottom-4 p-3">
          <SidebarItem href="/" icon={LogOut} text="Salir" isOpen={isOpen} setCurrentTitle={setCurrentTitle} />
        </div>
      </nav>

    </aside>
  );
}

function SidebarItem({ 
  href, 
  icon: Icon, 
  text, 
  isOpen, 
  setCurrentTitle 
}: { 
  href: string; 
  icon: React.ElementType; 
  text: string; 
  isOpen: boolean;
  setCurrentTitle: (title: string) => void;
}) {
  const pathname = usePathname();
  const isActive = pathname === href;
  const router = useRouter();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setCurrentTitle(text);
    router.push(href);
  };

  return (
    <a 
      href={href} 
      onClick={handleClick}
      className={`flex items-center gap-4 p-3 rounded-md transition-all 
        ${isActive ? "bg-pink-400 text-white" : "hover:bg-pink-300"}`}
    >
      <Icon className="w-6 h-6" />
      {isOpen && <span>{text}</span>}
    </a>
  );
}

function SidebarDropdown({ 
  icon: Icon, 
  text, 
  isOpen, 
  subItems = [],
  setCurrentTitle
}: { 
  icon: React.ElementType; 
  text: string; 
  isOpen: boolean; 
  subItems?: MenuItem[];
  setCurrentTitle: (title: string) => void;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const pathname = usePathname();
  const isActive = subItems.some((sub) => sub.href === pathname);
  const router = useRouter();

  return (
    <div>
      <div 
        className={`flex items-center justify-between gap-4 p-3 rounded-md cursor-pointer 
          ${isActive ? "bg-pink-400 text-white" : "hover:bg-pink-300"}`} 
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-4">
          <Icon className="w-6 h-6" />
          {isOpen && <span>{text}</span>}
        </div>
        {isOpen && (isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />)}
      </div>
      {isExpanded && (
        <div className="ml-6 mt-2 space-y-2">
          {subItems.map((subItem, index) => {
            const isSubActive = pathname === subItem.href;
            
            const handleSubItemClick = (e: React.MouseEvent) => {
              e.preventDefault();
              setCurrentTitle(subItem.text);
              router.push(subItem.href!);
            };
            
            return (
              <a
                key={index} 
                href={subItem.href!}
                onClick={handleSubItemClick}
                className={`flex items-center gap-4 p-2 rounded-md transition-all 
                  ${isSubActive ? "bg-pink-400 text-white" : "hover:bg-pink-300"}`}
              >
                <subItem.icon className="w-5 h-5" />
                {isOpen && <span>{subItem.text}</span>}
              </a>
            );
          })}
        </div>
      )}
    </div>
  );
}
