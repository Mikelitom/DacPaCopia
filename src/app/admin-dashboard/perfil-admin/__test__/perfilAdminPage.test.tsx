import React from 'react'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import PerfilPage from '@/app/admin-dashboard/perfil-admin/page'
import { useRouter } from 'next/navigation'
import { useToast } from '@/app/components/ui/use-toast'
import { supabase } from '@/app/lib/supabaseclient'

// Mocks
jest.mock('@/app/lib/supabaseclient', () => ({
  supabase: {
    auth: {
      getUser: jest.fn()
    },
    from: jest.fn(() => ({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn()
    }))
  }
}))

jest.mock('next/navigation', () => ({
  useRouter: jest.fn()
}))

jest.mock('@/app/components/ui/use-toast', () => ({
  useToast: () => ({
    toast: jest.fn()
  })
}))

describe('PerfilPage', () => {
  const mockPush = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useRouter as jest.Mock).mockReturnValue({ push: mockPush })
  })

  it('muestra el texto "Cargando perfil..." inicialmente', async () => {
    (supabase.auth.getUser as jest.Mock).mockResolvedValue({
      data: { user: { id: '123', email: 'test@example.com' } }
    })
    ;(supabase.from as any).mockReturnValue({
      select: () => ({
        eq: () => ({
          single: () => Promise.resolve({
            data: {
              nombre_completo: 'Juan Pérez',
              telefono: '1234567890',
              departamento: 'TI',
              rol: 'admin'
            }
          })
        })
      })
    })

    render(<PerfilPage />)
    expect(screen.getByText(/Cargando perfil/i)).toBeInTheDocument()

    await waitFor(() => {
      expect(screen.getByText(/Información de Perfil/i)).toBeInTheDocument()
    })
  })

  it('muestra los datos del perfil correctamente', async () => {
    (supabase.auth.getUser as jest.Mock).mockResolvedValue({
      data: { user: { id: '123', email: 'test@example.com' } }
    })
    ;(supabase.from as any).mockReturnValue({
      select: () => ({
        eq: () => ({
          single: () => Promise.resolve({
            data: {
              nombre_completo: 'Ana López',
              telefono: '987654321',
              departamento: 'Recursos Humanos',
              rol: 'user'
            }
          })
        })
      })
    })

    render(<PerfilPage />)

    await waitFor(() => {
      expect(screen.getByText('Ana López')).toBeInTheDocument()
      expect(screen.getByText('test@example.com')).toBeInTheDocument()
      expect(screen.getByText('user')).toBeInTheDocument()
      expect(screen.getByText('Recursos Humanos')).toBeInTheDocument()
      expect(screen.getByText('987654321')).toBeInTheDocument()
    })
  })

  it('permite activar el modo de edición', async () => {
    (supabase.auth.getUser as jest.Mock).mockResolvedValue({
      data: { user: { id: '123', email: 'test@example.com' } }
    })
    ;(supabase.from as any).mockReturnValue({
      select: () => ({
        eq: () => ({
          single: () => Promise.resolve({
            data: {
              nombre_completo: 'Laura Gómez',
              telefono: '111222333',
              departamento: 'Contabilidad',
              rol: 'admin'
            }
          })
        })
      })
    })

    render(<PerfilPage />)

    await waitFor(() => {
      expect(screen.getByText('Editar perfil')).toBeInTheDocument()
    })

    fireEvent.click(screen.getByText(/Editar perfil/i))

    await waitFor(() => {
      expect(screen.getByDisplayValue('Laura Gómez')).toBeInTheDocument()
      expect(screen.getByDisplayValue('111222333')).toBeInTheDocument()
      expect(screen.getByDisplayValue('Contabilidad')).toBeInTheDocument()
    })
  })
})
