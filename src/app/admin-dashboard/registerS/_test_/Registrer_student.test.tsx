import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import RegistrerStudent from '../Registrer_student';

describe('RegistrerStudent Component', () => {
  it('verifica que el componente esté presente', () => {
    const { container } = render(<RegistrerStudent />);
    expect(container).not.toBeNull();
  });

  it('permite ingresar el nombre de la madre', () => {
    render(<RegistrerStudent />);
    fireEvent.change(screen.getByLabelText('Nombre de la Madre'), { target: { value: 'Ana López' } });
    expect(screen.getByLabelText('Nombre de la Madre')).toHaveValue('Ana López');
  });

  it('permite ingresar el nombre del padre', () => {
    render(<RegistrerStudent />);
    fireEvent.change(screen.getByLabelText('Nombre del Padre'), { target: { value: 'Juan Pérez' } });
    expect(screen.getByLabelText('Nombre del Padre')).toHaveValue('Juan Pérez');
  });

  it('permite ingresar el nombre del contacto de emergencia', () => {
    render(<RegistrerStudent />);
    fireEvent.change(screen.getByLabelText('Nombre'), { target: { value: 'Carlos Sanchez' } });
    expect(screen.getByLabelText('Nombre')).toHaveValue('Carlos Sanchez');
  });

  it('permite ingresar el nombre del alumno', () => {
    render(<RegistrerStudent />);
    fireEvent.change(screen.getByLabelText('Nombre(s)'), { target: { value: 'Pedro Alvarez' } });
    expect(screen.getByLabelText('Nombre(s)')).toHaveValue('Pedro Alvarez');
  });

  it('permite ingresar el apellido paterno', () => {
    render(<RegistrerStudent />);
    fireEvent.change(screen.getByLabelText('Apellido Paterno'), { target: { value: 'Gonzalez' } });
    expect(screen.getByLabelText('Apellido Paterno')).toHaveValue('Gonzalez');
  });

  it('permite ingresar el apellido materno', () => {
    render(<RegistrerStudent />);
    fireEvent.change(screen.getByLabelText('Apellido Materno'), { target: { value: 'Lopez' } });
    expect(screen.getByLabelText('Apellido Materno')).toHaveValue('Lopez');
  });
});


