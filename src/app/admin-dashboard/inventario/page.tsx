"use client"

import { useEffect } from "react"
import { useRouter } from "next/router"

export default function PaginaInventario(){
    const router = useRouter()

    useEffect(() => {
        router.push("/inventario/articulos")
    }, [router]

    )
    return null
}