"use client"

import * as React from "react";
import { Check, ChevronRight, Circle } from "lucide-react";

// Corregimos el tipo en el contexto para permitir null
const DropdownContext = React.createContext<{
  open: boolean;
  setOpen: (open: boolean) => void;
  triggerRef: React.RefObject<HTMLDivElement | null>;
}>({
  open: false,
  setOpen: () => {},
  triggerRef: { current: null } as React.RefObject<HTMLDivElement | null>,
});

const DropdownMenu = ({ children }: { children: React.ReactNode }) => {
  const [open, setOpen] = React.useState(false);
  // Inicializamos con null y tipamos correctamente
  const triggerRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (triggerRef.current && !triggerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <DropdownContext.Provider value={{ open, setOpen, triggerRef }}>
      <div className="relative inline-block text-left">{children}</div>
    </DropdownContext.Provider>
  );
};

const DropdownMenuTrigger = ({ children }: { children: React.ReactNode }) => {
  const { open, setOpen, triggerRef } = React.useContext(DropdownContext);

  return (
    <div
      ref={triggerRef as React.RefObject<HTMLDivElement>} // Hacemos type assertion aquí
      onClick={() => setOpen(!open)}
      className="inline-flex justify-center w-full rounded-md cursor-pointer"
    >
      {children}
    </div>
  );
};
const DropdownMenuContent = ({
  children,
  align = "left",
}: {
  children: React.ReactNode;
  align?: "left" | "right" | "end";
}) => {
  const { open } = React.useContext(DropdownContext);

  if (!open) return null;

  return (
    <div
      className={`absolute z-50 mt-2 w-56 min-w-[8rem] rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none transition-all ${
        align === "left" ? "left-0 origin-top-left" : "right-0 origin-top-right"
      } animate-in fade-in-80 zoom-in-95`}
    >
      <div className="py-1">{children}</div>
    </div>
  );
};

const DropdownMenuItem = ({
  children,
  inset,
  onClick,
  className = "",
}: {
  children: React.ReactNode;
  inset?: boolean;
  onClick?: () => void;
  className?: string;
}) => {
  const { setOpen } = React.useContext(DropdownContext);

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        onClick?.();
        setOpen(false);
      }}
      className={`flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 cursor-pointer ${
        inset && "pl-8"
      } ${className}`}
    >
      {children}
    </div>
  );
};

const DropdownMenuCheckboxItem = ({
  children,
  checked,
  onChange,
}: {
  children: React.ReactNode;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
}) => {
  return (
    <DropdownMenuItem
      onClick={() => onChange?.(!checked)}
    >
      <span className="flex items-center">
        {checked && <Check className="w-4 h-4 mr-2" />}
        {!checked && <span className="w-4 h-4 mr-2" />}
        {children}
      </span>
    </DropdownMenuItem>
  );
};

const DropdownMenuRadioItem = ({
  children,
  active,
  onClick,
}: {
  children: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
}) => {
  return (
    <DropdownMenuItem onClick={onClick}>
      <span className="flex items-center">
        {active && <Circle className="w-2 h-2 mr-2 fill-current" />}
        {!active && <span className="w-2 h-2 mr-2" />}
        {children}
      </span>
    </DropdownMenuItem>
  );
};

const DropdownMenuLabel = ({
  children,
  inset,
}: {
  children: React.ReactNode;
  inset?: boolean;
}) => {
  return (
    <div
      className={`px-4 py-2 text-sm font-semibold text-gray-700 ${
        inset && "pl-8"
      }`}
    >
      {children}
    </div>
  );
};

const DropdownMenuSeparator = () => {
  return <div className="border-t border-gray-200 my-1" />;
};

const DropdownMenuShortcut = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <span className="ml-auto text-xs tracking-widest text-gray-500">
      {children}
    </span>
  );
};

const DropdownMenuSub = ({ children }: { children: React.ReactNode }) => {
  return <div className="relative">{children}</div>;
};

const DropdownMenuSubTrigger = ({
  children,
  inset,
}: {
  children: React.ReactNode;
  inset?: boolean;
}) => {
  const [subOpen, setSubOpen] = React.useState(false);

  return (
    <div
      onMouseEnter={() => setSubOpen(true)}
      onMouseLeave={() => setSubOpen(false)}
      className={`flex items-center justify-between px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer ${
        inset && "pl-8"
      }`}
    >
      {children}
      <ChevronRight className="w-4 h-4 ml-2" />
      {subOpen && (
        <div className="absolute left-full top-0 ml-1 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
          <div className="py-1" onClick={(e) => e.stopPropagation()}>
            {React.Children.toArray(children).find(
              (child) => React.isValidElement(child) && child.type === DropdownMenuSubContent
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const DropdownMenuSubContent = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return <>{children}</>;
};

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
};