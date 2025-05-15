import * as React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import ComprasArticulosTable from "../articulos";

// Prueba 1: El componente se renderiza sin errores
test("El componente ComprasArticulosTable se renderiza sin errores", () => {
  render(<ComprasArticulosTable />);
});

// Prueba 2: Verifica que la tabla de artículos está presente
test("La tabla de artículos se muestra correctamente", () => {
  render(<ComprasArticulosTable />);
  const tableElement = screen.getByRole("table");
  expect(tableElement).toBeInTheDocument();
});