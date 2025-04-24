"use client"

import * as React from "react";
import { X } from "lucide-react";

// Context para manejar el estado del diálogo
const DialogContext = React.createContext<{
  open: boolean;
  setOpen: (open: boolean) => void;
}>({
  open: false,
  setOpen: () => {},
});

const Dialog = ({ children }: { children: React.ReactNode }) => {
  const [open, setOpen] = React.useState(false);
  
  return (
    <DialogContext.Provider value={{ open, setOpen }}>
      {children}
    </DialogContext.Provider>
  );
};

const DialogTrigger = ({ children }: { children: React.ReactNode }) => {
  const { setOpen } = React.useContext(DialogContext);
  
  return (
    <div onClick={() => setOpen(true)} className="inline-flex">
      {children}
    </div>
  );
};

const DialogOverlay = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  const { open, setOpen } = React.useContext(DialogContext);
  
  if (!open) return null;

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 bg-black/80 animate-in fade-in-0",
        className
      )}
      onClick={() => setOpen(false)}
      {...props}
    />
  );
};

const DialogContent = ({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  const { open, setOpen } = React.useContext(DialogContext);
  
  if (!open) return null;

  return (
    <>
      <DialogOverlay />
      <div
        className={cn(
          "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg animate-in fade-in-0 zoom-in-95",
          "sm:rounded-lg",
          className
        )}
        {...props}
      >
        {children}
        <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none">
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </DialogClose>
      </div>
    </>
  );
};

const DialogClose = ({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  const { setOpen } = React.useContext(DialogContext);
  
  return (
    <div
      className={cn(
        "cursor-pointer",
        className
      )}
      onClick={() => setOpen(false)}
      {...props}
    >
      {children}
    </div>
  );
};

const DialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col space-y-1.5 text-center sm:text-left",
      className
    )}
    {...props}
  />
);

const DialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
      className
    )}
    {...props}
  />
);

const DialogTitle = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) => (
  <h3
    className={cn(
      "text-lg font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
);

const DialogDescription = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) => (
  <p
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
);

// Función de utilidad para combinar clases
function cn(...inputs: (string | undefined)[]): string {
  return inputs.filter(Boolean).join(" ");
}

export {
  Dialog,
  DialogTrigger,
  DialogOverlay,
  DialogContent,
  DialogClose,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
};