import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import ConveniosPage from '../convenios/page';

jest.mock('next/navigation', () => ({
    useRouter: () => ({
      push: jest.fn(),
      replace: jest.fn(),
      refresh: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      prefetch: jest.fn(),
    }),
  }));

describe('ConveniosPage', () => {
  it('renderiza el título principal', () => {
    render(<ConveniosPage />);
    expect(screen.getByText('Estado de Cuenta')).toBeInTheDocument();
  });

  it('muestra por defecto la vista "Crear Convenio"', () => {
    render(<ConveniosPage />);
    expect(screen.getByRole('heading', { name: /crear convenio/i })).toBeInTheDocument();

  });

  it('cambia de tab al hacer clic en "Convenios Activos"', async () => {
    render(<ConveniosPage />);
    fireEvent.click(screen.getByText('📑 Convenios Activos'));

    await waitFor(() =>
      expect(screen.getByText(/Cargando convenios/)).toBeInTheDocument()
    );
  });

  it('renderiza inputs del formulario en el tab "Crear Convenio"', () => {
    render(<ConveniosPage />);
    expect(screen.getByPlaceholderText('Nombre del padre de familia')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Correo electrónico')).toBeInTheDocument();
  });
});
