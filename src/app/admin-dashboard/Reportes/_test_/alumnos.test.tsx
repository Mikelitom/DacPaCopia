import React from 'react';
import { render, screen } from '@testing-library/react';
import AlumnosTable from '../alumnos';

describe('AlumnosTable Component', () => {
  it('renderiza sin errores', () => {
    const { container } = render(<AlumnosTable />);
    expect(container).toBeTruthy();
  });

  it('muestra el título del componente', () => {
    render(<AlumnosTable />);
    expect(screen.getByText('Nombre Completo')).toBeInTheDocument();
  });
});
