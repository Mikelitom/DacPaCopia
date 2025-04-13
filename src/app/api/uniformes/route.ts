export async function GET() {
  const uniformes = [
    {
      id: "unif-1",
      nombre: "Uniforme de Diario Niña",
      imagen: "/uniformeNormalNina.jpg",
      precio: 950,
      tallas: ["4", "6", "8", "10", "12", "14", "16"],
      stock: {
        "4": 5,
        "6": 3,
        "8": 0,
        "10": 2,
        "12": 4,
        "14": 0,
        "16": 1,
      },
      descripcion: "Incluye falda, blusa y suéter con el logo del colegio",
    },
    {
      id: "unif-2",
      nombre: "Uniforme de Diario (Niño)",
      imagen: "/placeholder.svg?height=300&width=250",
      precio: 950,
      tallas: ["4", "6", "8", "10", "12", "14", "16"],
      stock: {
        "4": 0,
        "6": 0,
        "8": 0,
        "10": 0,
        "12": 0,
        "14": 0,
        "16": 0,
      },
      descripcion: "Incluye pantalón, camisa y suéter con el logo del colegio",
    },
    {
      id: "unif-3",
      nombre: "Uniforme Deportivo",
      imagen: "/placeholder.svg?height=300&width=250",
      precio: 850,
      tallas: ["4", "6", "8", "10", "12", "14", "16"],
      stock: {
        "4": 10,
        "6": 8,
        "8": 6,
        "10": 4,
        "12": 2,
        "14": 1,
        "16": 0,
      },
      descripcion: "Incluye pants, playera y chamarra deportiva con el logo del colegio",
    },
    {
      id: "unif-4",
      nombre: "Uniforme de Gala",
      imagen: "/placeholder.svg?height=300&width=250",
      precio: 1200,
      tallas: ["4", "6", "8", "10", "12", "14", "16"],
      stock: {
        "4": 2,
        "6": 0,
        "8": 1,
        "10": 0,
        "12": 3,
        "14": 0,
        "16": 0,
      },
      descripcion: "Uniforme para eventos especiales y ceremonias",
    }
  ] 

  return Response.json(uniformes);
}
