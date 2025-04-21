"use client";

import { useState, useRef, useEffect } from "react";
import { MoreHorizontal } from "lucide-react";

interface RowActionsDropdownProps {
  onEdit: () => void;
  onDelete: () => void;
}

const RowActionsDropdown: React.FC<RowActionsDropdownProps> = ({ onEdit, onDelete }) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Cierra el menú si se hace clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
        className="text-gray-500 hover:text-gray-700"
      >
        <MoreHorizontal className="w-5 h-5" />
      </button>

      {open && (
        <div className="absolute right-0 z-10 mt-2 w-32 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
          <div className="py-1">
            <button
              onClick={() => {
                onEdit();
                setOpen(false);
              }}
              className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
            >
              Editar
            </button>
            <button
              onClick={() => {
                onDelete();
                setOpen(false);
              }}
              className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-100"
            >
              Eliminar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RowActionsDropdown;
