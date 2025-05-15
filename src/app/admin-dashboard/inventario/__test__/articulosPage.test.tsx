import React from "react"
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ArticulosPage from "@/app/admin-dashboard/inventario/articulos/page";
import { supabase } from "@/app/lib/supabaseclient";

// Mocks de Next.js y Supabase
jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: jest.fn() }),
}));

jest.mock("@/app/lib/supabaseclient", () => ({
  supabase: {
    from: jest.fn(() => ({
      select: jest.fn().mockReturnThis(),
      order: jest.fn().mockResolvedValue({
        data: [
          {
            id_articulo: 1,
            nombre: "Camisa Escolar",
            categoria: "Uniforme",
            sku: "UNI001",
            codigo_barras: "123456789",
            imagen_url: null,
            proveedor: "Proveedor 1",
            precio_venta: 150,
            precio_adquisicion: 100,
            stock_actual: 20,
            stock_minimo: 5,
            stock_inicial: 20,
            ultima_actualizacion: new Date().toISOString(),
          },
          {
            id_articulo: 2,
            nombre: "Libro de Matemáticas",
            categoria: "Libros",
            sku: "LIB001",
            codigo_barras: "987654321",
            imagen_url: null,
            proveedor: "Proveedor 2",
            precio_venta: 300,
            precio_adquisicion: 200,
            stock_actual: 5,
            stock_minimo: 10,
            stock_inicial: 10,
            ultima_actualizacion: new Date().toISOString(),
          },
        ],
        error: null,
      }),
    })),
  },
}));

describe("ArticulosPage", () => {
  it("renderiza el título y el botón de nuevo artículo", async () => {
    render(<ArticulosPage />);
    await screen.findByText("Inventario");

    expect(screen.getByText("Inventario")).toBeInTheDocument();
    expect(screen.getByText("Nuevo Artículo")).toBeInTheDocument();
  });

  it("muestra los artículos correctamente", async () => {
    render(<ArticulosPage />);
    await screen.findByText("Camisa Escolar");

    expect(screen.getByText("Camisa Escolar")).toBeInTheDocument();
    expect(screen.getByText("Libro de Matemáticas")).toBeInTheDocument();
  });

  it("filtra los artículos por nombre", async () => {
    render(<ArticulosPage />);
    await screen.findByText("Camisa Escolar");

    const input = screen.getByPlaceholderText("Buscar artículo...");
    fireEvent.change(input, { target: { value: "Camisa" } });

    expect(screen.getByText("Camisa Escolar")).toBeInTheDocument();
    expect(screen.queryByText("Libro de Matemáticas")).toBeNull();
  });

  it("muestra el valor total del inventario", async () => {
    render(<ArticulosPage />);
    await screen.findByText("$4,500"); // 150*20 + 300*5
    expect(screen.getByText("$4,500")).toBeInTheDocument();
  });
});
