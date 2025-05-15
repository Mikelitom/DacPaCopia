import React from "react";
import { render } from "@testing-library/react";
import AltaUsuario from "../AltaUsuario";

test("renderiza AltaUsuario sin errores", () => {
  render(<AltaUsuario />);
});