import React from 'react'; // Add this import to fix the error
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PagosPage from '../page';
import { supabase } from '@/app/lib/supabaseclient';

// Mock supabase
jest.mock('@/app/lib/supabaseclient', () => ({
  supabase: {
    from: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    order: jest.fn().mockReturnThis()
  }
}));

// Mock jsPDF
jest.mock('jspdf', () => {
  return function() {
    return {
      setFontSize: jest.fn(),
      text: jest.fn(),
      save: jest.fn()
    };
  };
});

describe('PagosPage', () => {
  // Mock data
  const pagosMock = [
    {
      id: 1,
      fecha_pago: '2024-04-15',
      concepto: 'Colegiatura Abril',
      id_alumno: 1,
      monto: 1500,
      metodo_pago: 'Transferencia',
      estado: 'Pagado'
    },
    {
      id: 2,
      fecha_pago: '2024-03-15',
      concepto: 'Colegiatura Marzo',
      id_alumno: 1,
      monto: 1500,
      metodo_pago: 'Efectivo',
      estado: 'Pagado'
    },
    {
      id: 3,
      fecha_pago: '2024-04-10',
      concepto: 'Colegiatura Abril',
      id_alumno: 2,
      monto: 1500,
      metodo_pago: 'Tarjeta',
      estado: 'Pagado'
    }
  ];

  const estudiantesMock = [
    { id: 1, nombre: 'Ana Martínez' },
    { id: 2, nombre: 'Pedro López' },
    { id: 3, nombre: 'María Sánchez' } // Sin pagos, será deudor
  ];

  // Helper function to setup mocks for supabase queries
  const setupMocks = (pagosMockData = pagosMock, estudiantesMockData = estudiantesMock) => {
    // Mock for payments query
    (supabase.from as jest.Mock).mockImplementation((tableName) => {
      if (tableName === 'PagoColegiatura') {
        return {
          select: () => ({
            order: () => Promise.resolve({ data: pagosMockData, error: null })
          })
        };
      }
      if (tableName === 'Alumno') {
        return {
          select: () => Promise.resolve({ data: estudiantesMockData, error: null })
        };
      }
      return {
        select: jest.fn().mockReturnThis(),
        order: jest.fn().mockReturnThis()
      };
    });
  };

  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
  });

  test('carga y muestra los pagos recientes correctamente', async () => {
    setupMocks();
    
    render(<PagosPage />);
    
    // Verify the tabs are rendered
    expect(screen.getByText('Pagos Recientes')).toBeInTheDocument();
    expect(screen.getByText('Deudores')).toBeInTheDocument();
    
    // Wait for the payments to load
    await waitFor(() => {
      expect(screen.getByText('Colegiatura Abril')).toBeInTheDocument();
    });
    
    // Check if the payments data is rendered
    expect(screen.getByText('Transferencia')).toBeInTheDocument();
    expect(screen.getByText('$1500.00')).toBeInTheDocument();
    expect(screen.getAllByText('Pagado')[0]).toBeInTheDocument();
  });

  test('filtra pagos por mes y año correctamente', async () => {
    setupMocks();
    
    const user = userEvent.setup(); // Create user event instance with the new API
    render(<PagosPage />);
    
    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText('Colegiatura Abril')).toBeInTheDocument();
    });
    
    // Find the month selector and select March (03)
    const mesSelector = screen.getByLabelText('Mes');
    await user.selectOptions(mesSelector, '03');
    
    // After filtering, only March payments should be visible
    await waitFor(() => {
      expect(screen.queryByText('Colegiatura Abril')).not.toBeInTheDocument();
      expect(screen.getByText('Colegiatura Marzo')).toBeInTheDocument();
    });
    
    // Reset the filter
    await user.selectOptions(mesSelector, '');
    
    // Now select a year filter
    const añoSelector = screen.getByLabelText('Año');
    await user.selectOptions(añoSelector, '2023');
    
    // No payments from 2023 in our mock data
    await waitFor(() => {
      expect(screen.getByText('No hay pagos en este mes y año seleccionados.')).toBeInTheDocument();
    });
  });

  test('muestra la pestaña de deudores correctamente', async () => {
    // Create a date that's older than 60 days for the "deudor" test
    const oldDate = new Date();
    oldDate.setDate(oldDate.getDate() - 90);
    
    const pagosConDeudor = [
      ...pagosMock,
      {
        id: 4,
        fecha_pago: oldDate.toISOString().split('T')[0], // A date more than 60 days old
        concepto: 'Colegiatura Enero',
        id_alumno: 3,
        monto: 1500,
        metodo_pago: 'Efectivo',
        estado: 'Pagado'
      }
    ];
    
    setupMocks(pagosConDeudor);
    
    const user = userEvent.setup();
    render(<PagosPage />);
    
    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText('Pagos Recientes')).toBeInTheDocument();
    });
    
    // Switch to the debtors tab
    const deudoresTab = screen.getByText('Deudores');
    await user.click(deudoresTab);
    
    // Check if María appears as a debtor (student with id 3)
    await waitFor(() => {
      expect(screen.getByText('María Sánchez')).toBeInTheDocument();
    });
  });

  test('genera PDF al hacer clic en el botón Descargar PDF', async () => {
    setupMocks();
    
    const user = userEvent.setup();
    render(<PagosPage />);
    
    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText('Colegiatura Abril')).toBeInTheDocument();
    });
    
    // Find the PDF download button and click it
    const pdfButtons = screen.getAllByText('Descargar PDF');
    await user.click(pdfButtons[0]);
    
    // We can't easily assert on the PDF generation itself, but we can check
    // that the button click handler ran without errors
    // This is a limited test, but the best we can do without mocking jsPDF methods
  });

  test('maneja errores al cargar datos', async () => {
    // Mock error responses
    (supabase.from as jest.Mock).mockImplementation((tableName) => {
      if (tableName === 'PagoColegiatura') {
        return {
          select: () => ({
            order: () => Promise.resolve({ data: null, error: { message: 'Error fetching pagos' } })
          })
        };
      }
      if (tableName === 'Alumno') {
        return {
          select: () => Promise.resolve({ data: null, error: { message: 'Error fetching alumnos' } })
        };
      }
      return {
        select: jest.fn().mockReturnThis(),
        order: jest.fn().mockReturnThis()
      };
    });
    
    // Spy on console.error
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    render(<PagosPage />);
    
    // Wait to ensure the error logs are called
    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error fetching pagos:', { message: 'Error fetching pagos' });
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error fetching alumnos:', { message: 'Error fetching alumnos' });
    });
    
    // Should show empty table message
    expect(screen.getByText('No hay pagos en este mes y año seleccionados.')).toBeInTheDocument();
    
    // Restore console.error
    consoleErrorSpy.mockRestore();
  });
});