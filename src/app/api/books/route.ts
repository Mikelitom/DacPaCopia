export async function GET() {
  const paquetes = {
    "1": {
      id: "paq-1",
      grado: "1er Grado",
      precio: 2500,
      libros: [
        { id: "lib-1-1", titulo: "Matemáticas 1", imagen: "/placeholder.svg?height=200&width=150", precio: 450 },
        { id: "lib-1-2", titulo: "Español 1", imagen: "/placeholder.svg?height=200&width=150", precio: 450 },
        { id: "lib-1-3", titulo: "Ciencias Naturales 1", imagen: "/placeholder.svg?height=200&width=150", precio: 400 },
        { id: "lib-1-4", titulo: "Historia 1", imagen: "/placeholder.svg?height=200&width=150", precio: 400 },
        { id: "lib-1-5", titulo: "Geografía 1", imagen: "/placeholder.svg?height=200&width=150", precio: 400 },
        { id: "lib-1-6", titulo: "Inglés 1", imagen: "/placeholder.svg?height=200&width=150", precio: 400 },
      ],
    },
    "2": {
      id: "paq-2",
      grado: "2do Grado",
      precio: 2650,
      libros: [
        { id: "lib-2-1", titulo: "Matemáticas 2", imagen: "/placeholder.svg?height=200&width=150", precio: 480 },
        { id: "lib-2-2", titulo: "Español 2", imagen: "/placeholder.svg?height=200&width=150", precio: 480 },
        { id: "lib-2-3", titulo: "Ciencias Naturales 2", imagen: "/placeholder.svg?height=200&width=150", precio: 420 },
        { id: "lib-2-4", titulo: "Historia 2", imagen: "/placeholder.svg?height=200&width=150", precio: 420 },
        { id: "lib-2-5", titulo: "Geografía 2", imagen: "/placeholder.svg?height=200&width=150", precio: 420 },
        { id: "lib-2-6", titulo: "Inglés 2", imagen: "/placeholder.svg?height=200&width=150", precio: 430 },
      ],
    },
    "3": {
      id: "paq-3",
      grado: "3er Grado",
      precio: 2800,
      libros: [
        { id: "lib-3-1", titulo: "Matemáticas 3", imagen: "/placeholder.svg?height=200&width=150", precio: 500 },
        { id: "lib-3-2", titulo: "Español 3", imagen: "/placeholder.svg?height=200&width=150", precio: 500 },
        { id: "lib-3-3", titulo: "Ciencias Naturales 3", imagen: "/placeholder.svg?height=200&width=150", precio: 450 },
        { id: "lib-3-4", titulo: "Historia 3", imagen: "/placeholder.svg?height=200&width=150", precio: 450 },
        { id: "lib-3-5", titulo: "Geografía 3", imagen: "/placeholder.svg?height=200&width=150", precio: 450 },
        { id: "lib-3-6", titulo: "Inglés 3", imagen: "/placeholder.svg?height=200&width=150", precio: 450 },
      ],
    },
  }

  return Response.json(paquetes);
}
