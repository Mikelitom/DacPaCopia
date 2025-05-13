/**
 * @jest-environment jsdom
 */

import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import NuevoArticuloPage from "@/app/admin-dashboard/inventario/articulos/nuevo/page";
import { useRouter } from "next/navigation";
import { supabase } from "@/app/lib/supabaseclient";

// Mocks
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

jest.mock("@/app/lib/supabaseclient", () => ({
  supabase: {
    from: jest.fn(() => ({
      insert: jest.fn(),
    })),
  },
}));

jest.mock("@/app/components/ui/use-toast", () => ({
  useToast: () => ({
    toast: jest.fn(),
  }),
}));

describe("NuevoArticuloPage", () => {
  const push = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({ push });
  });


  it("no permite guardar si los campos requeridos están vacíos", () => {
    render(<NuevoArticuloPage />);
    const submitButton = screen.getByRole("button", { name: /guardar artículo/i });

    expect(submitButton).toBeDisabled();
  });

  it("muestra resumen correctamente cuando se completan campos", () => {
    render(<NuevoArticuloPage />);
    
    fireEvent.change(screen.getByLabelText(/Nombre del Artículo/i), { target: { value: "Zapatos" } });
    fireEvent.change(screen.getByLabelText(/Precio de Venta/i), { target: { value: "299" } });
    fireEvent.change(screen.getByLabelText(/Stock Inicial/i), { target: { value: "5" } });
    
    expect(screen.getByText("Zapatos")).toBeInTheDocument();
    expect(screen.getByText("$299")).toBeInTheDocument();
    expect(screen.getByText("5 unidades")).toBeInTheDocument();
  });
});
