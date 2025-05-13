import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import ReportesMensualesColegiaturas from "../ReporteMes";

describe("ReportesMensualesColegiaturas", () => {
  
  // Prueba 1: El componente se renderiza correctamente
  it("debería renderizarse sin errores", () => {
    render(<ReportesMensualesColegiaturas />);
    const titleElement = screen.getByText("Reportes Mensuales de Colegiaturas");
    expect(titleElement).toBeInTheDocument();
  });

  // Prueba 2: Verifica que el selector de meses esté presente
  it("debería mostrar el selector de meses", () => {
    render(<ReportesMensualesColegiaturas />);
    const selectElement = screen.getByRole("combobox");
    expect(selectElement).toBeInTheDocument();
  });

});