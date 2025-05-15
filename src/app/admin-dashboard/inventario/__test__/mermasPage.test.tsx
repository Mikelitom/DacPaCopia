import React from "react"
import { render, screen, waitFor } from "@testing-library/react"
import MermasPage from "@/app/admin-dashboard/inventario/mermas/page"
import { supabase } from "@/app/lib/supabaseclient"

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
}))

jest.mock("@/app/lib/supabaseclient", () => {
  const mockFrom = {
    select: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    delete: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    order: jest.fn().mockReturnThis(),
  }

  return {
    supabase: {
      from: jest.fn(() => mockFrom),
    },
  }
})

describe("MermasPage", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("debe renderizar el título principal", async () => {
    // Simula respuesta de supabase para .select().order()
    (supabase.from as jest.Mock).mockReturnValueOnce({
      select: jest.fn().mockReturnValueOnce({
        order: jest.fn().mockResolvedValueOnce({
          data: [],
          error: null,
        }),
      }),
    })

    render(<MermasPage />)

    await waitFor(() => {
      expect(screen.getByText("Registro de Mermas")).toBeInTheDocument()
    })
  })
})
