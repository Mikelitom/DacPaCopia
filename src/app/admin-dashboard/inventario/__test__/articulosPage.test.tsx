import * as React from "react";
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ArticulosPage from '../articulos/page'; // Ajusta la ruta según tu estructura
import { supabase } from '@/app/lib/supabaseclient';
import { useRouter } from 'next/navigation';
import { toast } from '@/app/components/ui/use-toast';

// Mocks
jest.mock('next/navigation', () => ({
  useRouter: jest.fn()
}));

jest.mock('@/app/lib/supabaseclient', () => ({
  supabase: {
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        order: jest.fn(() => Promise.resolve({ data: [], error: null }))
      })),
      delete: jest.fn(() => ({
        eq: jest.fn(() => Promise.resolve({ error: null }))
      }))
    }))
  }
}));

jest.mock('@/app/components/ui/use-toast', () => ({
  toast: jest.fn()
}));

// Datos de prueba
const mockArticulos = [
  {
    id_articulo: 1,
    nombre: 'Camisa Escolar',
    categoria: 'Uniforme',
    sku: 'CAM-001',
    codigo_barras: '123456789',
    imagen_url: null,
    proveedor: 'Uniformes SA',
    precio_venta: 350,
    precio_adquisicion: 200,
    stock_actual: 50,
    stock_minimo: 10,
    stock_inicial: 100,
    ultima_actualizacion: '2023-05-10T00:00:00'
  },
  {
    id_articulo: 2,
    nombre: 'Libro Matemáticas',
    categoria: 'Libros',
    sku: 'LIB-001',
    codigo_barras: '987654321',
    imagen_url: null,
    proveedor: 'Editorial XYZ',
    precio_venta: 500,
    precio_adquisicion: 300,
    stock_actual: 5,
    stock_minimo: 10,
    stock_inicial: 30,
    ultima_actualizacion: '2023-05-12T00:00:00'
  },
  {
    id_articulo: 3,
    nombre: 'Falda Escolar',
    categoria: 'Uniforme',
    sku: 'FAL-001',
    codigo_barras: '456789123',
    imagen_url: null,
    proveedor: 'Uniformes SA',
    precio_venta: 250,
    precio_adquisicion: 150,
    stock_actual: 30,
    stock_minimo: 8,
    stock_inicial: 40,
    ultima_actualizacion: '2023-05-15T00:00:00'
  }
];

describe('ArticulosPage Component', () => {
  // Setup común
  const mockRouter = {
    push: jest.fn()
  };
  
  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);

    // Configurar mock para devolver los datos de prueba
    const mockFrom = supabase.from as jest.Mock;
    mockFrom.mockImplementation(() => ({
      select: jest.fn(() => ({
        order: jest.fn(() => Promise.resolve({ data: mockArticulos, error: null }))
      })),
      delete: jest.fn(() => ({
        eq: jest.fn(() => Promise.resolve({ error: null }))
      }))
    }));
    
    // Mockear window.confirm
    global.confirm = jest.fn(() => true);
  });

  test('renderiza el componente y carga los datos del inventario', async () => {
    render(<ArticulosPage />);
    
    // Verificar elementos de carga iniciales
    expect(screen.getByText('Cargando inventario...')).toBeInTheDocument();
    
    // Esperar a que los datos se carguen
    await waitFor(() => {
      expect(screen.getByText('Camisa Escolar')).toBeInTheDocument();
      expect(screen.getByText('Libro Matemáticas')).toBeInTheDocument();
      expect(screen.getByText('Falda Escolar')).toBeInTheDocument();
    });
    
    // Verificar que se llamó a Supabase correctamente
    expect(supabase.from).toHaveBeenCalledWith('Articulo');
  });

  test('muestra el número correcto de artículos y valor del inventario', async () => {
    render(<ArticulosPage />);
    
    await waitFor(() => {
      // Verificar que el total de artículos sea 3
      const totalArticulos = screen.getByText('3');
      expect(totalArticulos).toBeInTheDocument();
      
      // Calcular el valor total del inventario (50*350 + 5*500 + 30*250 = 20,000)
      const valorInventario = screen.getByText('$20,000');
      expect(valorInventario).toBeInTheDocument();
    });
  });

  test('filtra artículos por categoría', async () => {
    render(<ArticulosPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Camisa Escolar')).toBeInTheDocument();
    });
    
    // Filtrar por categoría Uniforme
    const selectTrigger = screen.getByRole('combobox');
    fireEvent.click(selectTrigger);
    
    // Esperar a que aparezca el menú desplegable
    const uniformeOption = await screen.findByText('Uniforme');
    fireEvent.click(uniformeOption);
    
    // Verificar que solo se muestran los artículos de uniforme
    expect(screen.getByText('Camisa Escolar')).toBeInTheDocument();
    expect(screen.getByText('Falda Escolar')).toBeInTheDocument();
    expect(screen.queryByText('Libro Matemáticas')).not.toBeInTheDocument();
  });

  test('filtra artículos por término de búsqueda', async () => {
    render(<ArticulosPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Camisa Escolar')).toBeInTheDocument();
    });
    
    // Buscar "Libro"
    const searchInput = screen.getByPlaceholderText('Buscar artículo...');
    fireEvent.change(searchInput, { target: { value: 'Libro' } });
    
    // Verificar que solo se muestra el libro
    expect(screen.queryByText('Camisa Escolar')).not.toBeInTheDocument();
    expect(screen.getByText('Libro Matemáticas')).toBeInTheDocument();
    expect(screen.queryByText('Falda Escolar')).not.toBeInTheDocument();
  });

  test('navega a la página de nuevo artículo al hacer clic en el botón', async () => {
    render(<ArticulosPage />);
    
    const nuevoArticuloBtn = screen.getByText('Nuevo Artículo');
    fireEvent.click(nuevoArticuloBtn);
    
    expect(mockRouter.push).toHaveBeenCalledWith('/admin-dashboard/inventario/articulos/nuevo');
  });

  test('elimina un artículo correctamente', async () => {
    render(<ArticulosPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Paquete Libros 1')).toBeInTheDocument();
    });
    
    // Abrir menú de acciones del primer artículo
    const dropdownButtons = screen.getAllByRole('button', { name: '' });
    fireEvent.click(dropdownButtons[1]); // El primer botón después del de "Nuevo Artículo"
    
    // Hacer clic en eliminar
    const eliminarBtn = await screen.findByText('Eliminar');
    fireEvent.click(eliminarBtn);
    
    // Verificar que se mostró el diálogo de confirmación
    expect(global.confirm).toHaveBeenCalledWith('¿Estás seguro de eliminar este artículo?');
    
    // Verificar que se llamó a supabase para eliminar
    expect(supabase.from).toHaveBeenCalledWith('Articulo');
    const mockDelete = supabase.from('Articulo').delete;
    expect(mockDelete).toHaveBeenCalled();
    const mockEq = supabase.from('Articulo').delete().eq;
    expect(mockEq).toHaveBeenCalledWith('id_articulo', 1);
    
    // Verificar que se mostró la notificación de éxito
    expect(toast).toHaveBeenCalledWith({
      title: "Artículo eliminado",
      description: "El artículo ha sido eliminado correctamente."
    });
  });

  test('cancela eliminación de artículo cuando el usuario no confirma', async () => {
    // Sobreescribir el mock de confirm para devolver false
    (global.confirm as jest.Mock).mockReturnValueOnce(false);
    
    render(<ArticulosPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Paquete Libros 1')).toBeInTheDocument();
    });
    
    // Abrir menú de acciones del primer artículo
    const dropdownButtons = screen.getAllByRole('button', { name: '' });
    fireEvent.click(dropdownButtons[1]);
    
    // Hacer clic en eliminar
    const eliminarBtn = await screen.findByText('Eliminar');
    fireEvent.click(eliminarBtn);
    
    // Verificar que se mostró el diálogo de confirmación
    expect(global.confirm).toHaveBeenCalled();
    
    // Verificar que NO se llamó a supabase para eliminar
    const mockDelete = supabase.from('Articulo').delete;
    expect(mockDelete).not.toHaveBeenCalled();
    
    // Verificar que no se mostró la notificación de éxito
    expect(toast).not.toHaveBeenCalled();
  });

  test('navega a la página de edición al hacer clic en editar', async () => {
    render(<ArticulosPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Paquete Libros 1')).toBeInTheDocument();
    });
    
    // Abrir menú de acciones del primer artículo
    const dropdownButtons = screen.getAllByRole('button', { name: '' });
    fireEvent.click(dropdownButtons[1]);
    
    // Hacer clic en editar
    const editarBtn = await screen.findByText('Editar');
    fireEvent.click(editarBtn);
    
    // Verificar que se navegó a la ruta correcta
    expect(mockRouter.push).toHaveBeenCalledWith('/admin-dashboard/inventario/articulos/editar/1');
  });

  test('muestra un indicador visual cuando el stock está por debajo del mínimo', async () => {
    render(<ArticulosPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Paquete Libros 1')).toBeInTheDocument();
    });
    
    // El libro tiene stock_actual: 5, stock_minimo: 10, por lo que debería mostrar (Bajo)
    expect(screen.getByText('5 (Bajo)')).toBeInTheDocument();
  });

  test('maneja errores durante la carga de datos', async () => {
    // Sobreescribir el mock para simular un error
    const mockFrom = supabase.from as jest.Mock;
    mockFrom.mockImplementationOnce(() => ({
      select: jest.fn(() => ({
        order: jest.fn(() => Promise.resolve({ data: null, error: new Error('Error de carga') }))
      }))
    }));
    
    // Espiar console.error
    jest.spyOn(console, 'error').mockImplementation(() => {});
    
    render(<ArticulosPage />);
    
    await waitFor(() => {
      expect(console.error).toHaveBeenCalled();
      expect(screen.getByText('Cargando inventario...')).toBeInTheDocument();
    });
    
    (console.error as jest.Mock).mockRestore();
  });

  test('maneja errores durante la eliminación de un artículo', async () => {
    // Sobreescribir el mock para simular un error en la eliminación
    const mockFrom = supabase.from as jest.Mock;
    mockFrom.mockImplementation(() => ({
      select: jest.fn(() => ({
        order: jest.fn(() => Promise.resolve({ data: mockArticulos, error: null }))
      })),
      delete: jest.fn(() => ({
        eq: jest.fn(() => Promise.resolve({ error: { message: 'Error al eliminar' } }))
      }))
    }));
    
    // Espiar console.error
    jest.spyOn(console, 'error').mockImplementation(() => {});
    
    render(<ArticulosPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Paquete Libros 1')).toBeInTheDocument();
    });
    
    // Abrir menú de acciones del primer artículo
    const dropdownButtons = screen.getAllByRole('button', { name: '' });
    fireEvent.click(dropdownButtons[1]);
    
    // Hacer clic en eliminar
    const eliminarBtn = await screen.findByText('Eliminar');
    fireEvent.click(eliminarBtn);
    
    await waitFor(() => {
      expect(console.error).toHaveBeenCalled();
      expect(toast).toHaveBeenCalledWith({
        title: "Error",
        description: "No se pudo eliminar el artículo.",
        variant: "destructive"
      });
    });
    
    (console.error as jest.Mock).mockRestore();
  });
});