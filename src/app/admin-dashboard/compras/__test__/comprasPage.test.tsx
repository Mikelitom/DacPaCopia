import React from 'react';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import ComprasPage from '@/app/admin-dashboard/compras/page';
import { useToast } from '@/app/components/ui/use-toast';
import { supabase } from '@/app/lib/supabaseclient';

// Mock de las dependencias externas
jest.mock('@/app/components/ui/use-toast', () => ({
  useToast: jest.fn(() => ({
    toast: jest.fn(),
  })),
}));

jest.mock('@/app/lib/supabaseclient', () => ({
  supabase: {
    from: jest.fn(() => ({
      select: jest.fn().mockReturnThis(),
      order: jest.fn().mockReturnThis(),
      update: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      insert: jest.fn().mockReturnThis(),
    })),
  },
}));

describe('ComprasPage', () => {
  const mockToast = jest.fn();
  const mockCompras = [
    {
      id_compra_proveedor: 1,
      proveedor: 101,
      fecha: '2023-05-01T10:00:00Z',
      total: 1500,
      estado: 'Pendiente',
    },
    {
      id_compra_proveedor: 2,
      proveedor: 102,
      fecha: '2023-05-02T11:00:00Z',
      total: 2300,
      estado: 'Recibido',
    },
  ];

  beforeEach(() => {
    (useToast as jest.Mock).mockReturnValue({
      toast: mockToast,
    });
    
    // Mock de la carga inicial de compras
    (supabase.from as jest.Mock).mockImplementation(() => ({
      select: jest.fn().mockReturnThis(),
      order: jest.fn().mockReturnThis(),
      then: jest.fn((callback) => callback({ data: mockCompras, error: null })),
    }));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('debe renderizar correctamente el componente', async () => {
    render(<ComprasPage />);
    
    expect(screen.getByText('Compras a Proveedores')).toBeInTheDocument();
    expect(screen.getByText('Nueva Compra')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Buscar por ID proveedor...')).toBeInTheDocument();
    
    // Esperar a que carguen los datos
    await waitFor(() => {
      expect(screen.getByText('#1')).toBeInTheDocument();
      expect(screen.getByText('#2')).toBeInTheDocument();
    });
  });

  it('debe cargar y mostrar las compras correctamente', async () => {
    render(<ComprasPage />);
    
    // Verificar que se muestra el estado de carga inicial
    expect(screen.getByText('Cargando compras...')).toBeInTheDocument();
    
    // Esperar a que se carguen los datos
    await waitFor(() => {
      expect(screen.getByText('#1')).toBeInTheDocument();
      expect(screen.getByText('101')).toBeInTheDocument();
      expect(screen.getByText('$1,500')).toBeInTheDocument();
      expect(screen.getByText('Pendiente')).toBeInTheDocument();
      
      expect(screen.getByText('#2')).toBeInTheDocument();
      expect(screen.getByText('102')).toBeInTheDocument();
      expect(screen.getByText('$2,300')).toBeInTheDocument();
      expect(screen.getByText('Recibido')).toBeInTheDocument();
    });
  });

  it('debe manejar errores al cargar las compras', async () => {
    // Mock de error al cargar
    (supabase.from as jest.Mock).mockImplementation(() => ({
      select: jest.fn().mockReturnThis(),
      order: jest.fn().mockReturnThis(),
      then: jest.fn((callback) => callback({ data: null, error: { message: 'Error de prueba' } })),
    }));

    render(<ComprasPage />);
    
    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        title: "Error",
        description: "No se pudieron cargar las compras",
        variant: "destructive"
      });
    });
  });

  it('debe filtrar compras por búsqueda', async () => {
    render(<ComprasPage />);
    
    // Esperar a que carguen los datos
    await screen.findByText('#1');
    
    // Buscar por ID de proveedor
    const searchInput = screen.getByPlaceholderText('Buscar por ID proveedor...');
    fireEvent.change(searchInput, { target: { value: '101' } });
    
    // Verificar que solo se muestra la compra con proveedor 101
    expect(screen.getByText('#1')).toBeInTheDocument();
    expect(screen.queryByText('#2')).not.toBeInTheDocument();
  });

  it('debe abrir y cerrar el diálogo de nueva compra', async () => {
    render(<ComprasPage />);
    
    // Verificar que el diálogo no está visible inicialmente
    expect(screen.queryByText('Nueva Orden de Compra')).not.toBeInTheDocument();
    
    // Abrir el diálogo
    fireEvent.click(screen.getByText('Nueva Compra'));
    expect(screen.getByText('Nueva Orden de Compra')).toBeInTheDocument();
    
    // Cerrar el diálogo
    fireEvent.click(screen.getByText('Cancelar'));
    await waitFor(() => {
      expect(screen.queryByText('Nueva Orden de Compra')).not.toBeInTheDocument();
    });
  });

  it('debe validar el formulario de nueva compra', async () => {
    render(<ComprasPage />);
    
    // Abrir el diálogo de nueva compra
    fireEvent.click(screen.getByText('Nueva Compra'));
    
    // Verificar que el botón de guardar está deshabilitado
    const guardarButton = screen.getByText('Guardar').closest('button');
    expect(guardarButton).toBeDisabled();
    
    // Llenar solo el campo de proveedor
    fireEvent.change(screen.getByLabelText('ID Proveedor (Número)*'), { target: { value: '103' } });
    expect(guardarButton).toBeDisabled();
    
    // Llenar solo el campo de total
    fireEvent.change(screen.getByLabelText('Total*'), { target: { value: '3000' } });
    fireEvent.change(screen.getByLabelText('ID Proveedor (Número)*'), { target: { value: '' } });
    expect(guardarButton).toBeDisabled();
    
    // Llenar ambos campos
    fireEvent.change(screen.getByLabelText('ID Proveedor (Número)*'), { target: { value: '103' } });
    expect(guardarButton).not.toBeDisabled();
  });

  it('debe manejar errores al crear una nueva compra', async () => {
    // Mock para error en inserción
    (supabase.from as jest.Mock).mockImplementation((table) => {
      if (table === 'CompraProveedor') {
        return {
          insert: jest.fn().mockReturnThis(),
          then: jest.fn((callback) => callback({ data: null, error: { message: 'Error de prueba' } })),
        };
      }
      return {
        select: jest.fn().mockReturnThis(),
        order: jest.fn().mockReturnThis(),
        then: jest.fn((callback) => callback({ data: mockCompras, error: null })),
      };
    });

    render(<ComprasPage />);
    
    // Abrir el diálogo de nueva compra
    fireEvent.click(screen.getByText('Nueva Compra'));
    
    // Llenar el formulario
    fireEvent.change(screen.getByLabelText('ID Proveedor (Número)*'), { target: { value: '103' } });
    fireEvent.change(screen.getByLabelText('Total*'), { target: { value: '3000' } });
    
    // Enviar el formulario
    fireEvent.click(screen.getByText('Guardar'));
    
    // Verificar que se mostró el error
    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        title: "❌ Error al crear compra",
        description: expect.any(String),
        variant: "destructive"
      });
    });
  });
});