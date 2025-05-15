import React from 'react';
import { render, screen } from '@testing-library/react';
import Pedidos from '../Pedidos';

describe('Pedidos Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renderiza correctamente el componente Pedidos', () => {
    render(<Pedidos />);
    expect(screen.getByText('Gestión de Pedidos')).toBeInTheDocument();
  });

  it('verifica que los botones se rendericen correctamente', () => {
    render(<Pedidos />);
    const botones = ['Recibidos', 'En Proceso', 'Listos para Entrega', 'Entregados'];
    botones.forEach((boton) => {
      expect(screen.getByText(boton)).toBeInTheDocument();
    });
  });

  it('muestra el mensaje sin pedidos cuando no hay datos', () => {
    render(<Pedidos />);
    expect(screen.getByText('No hay pedidos en esta sección.')).toBeInTheDocument();
  });

  it('permite cambiar entre pestañas', () => {
    render(<Pedidos />);
    screen.getByText('En Proceso').click();
    expect(screen.getByText('No hay pedidos en esta sección.')).toBeInTheDocument();
  });

  it('verifica que el título esté presente', () => {
    render(<Pedidos />);
    expect(screen.getByText('Gestión de Pedidos')).toBeInTheDocument();
  });

  it('verifica que la tabla se renderice correctamente', () => {
    render(<Pedidos />);
    const headers = ['ID Pedido', 'Alumno', 'Fecha', 'Articulo', 'Total', 'Estado'];
    headers.forEach((header) => {
      expect(screen.getByText(header)).toBeInTheDocument();
    });
  });

  it('verifica que se pueda hacer clic en los botones de estado', () => {
    render(<Pedidos />);
    screen.getByText('Entregados').click();
    expect(screen.getByText('No hay pedidos en esta sección.')).toBeInTheDocument();
  });

  it('verifica que el componente se cargue sin errores', () => {
    render(<Pedidos />);
    expect(screen.getByText('Gestión de Pedidos')).toBeInTheDocument();
  });
});
