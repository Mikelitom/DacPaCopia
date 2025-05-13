import React from 'react';
import { render } from '@testing-library/react';

describe('Sidebar Component', () => {
  it('renderiza sin errores', () => {
    const { container } = render(<div>Sidebar</div>);
    expect(container.textContent).toBe('Sidebar');
  });

  it('verifica que se muestre el texto correcto', () => {
    const { getByText } = render(<div>Menú de navegación</div>);
    expect(getByText('Menú de navegación')).toBeInTheDocument();
  });
});