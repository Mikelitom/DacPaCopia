"use client"

import type React from "react"

import { useState } from "react"
import { ChevronDown, FileText, Package, Plus, Search, ShoppingCart, Truck } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/app/components/ui/card"
import { Button } from "@/app/components/ui/button"
import { Input } from "@/app/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/app/components/ui/table"
import { Badge } from "@/app/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/app/components/ui/dropdown-menu"
import { useToast } from "@/app/components/ui/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/app/components/ui/dialog"
import { Label } from "@/app/components/ui/label"
import { Textarea } from "@/app/components/ui/textarea"

export default function ComprasPage() {
  const { toast } = useToast()
  const [filtroStatus, setFiltro] = useState("todos")
  const [valorBusqueda, setBusqueda] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [nuevaCompra, setNuevaCompra] = useState({
    proveedor: "",
    articulo: "",
    cantidad: "",
    notes: "",
  })

  const [comprasPendientes, setComprasPendientes] = useState([
    {
      id: "OC-001",
      proveedor: "Uniformes Escolares S.A.",
      fecha: "2023-09-10",
      total: 8750,
      status: "Pendiente",
    },
    {
      id: "OC-002",
      proveedor: "Editorial Educativa",
      fecha: "2023-09-12",
      total: 10800,
      status: "Pendiente",
    },
    {
      id: "OC-003",
      proveedor: "Editorial Educativa",
      fecha: "2023-09-12",
      total: 10800,
      status: "Recibido",
    },
  ])

  const filtroComprasPendientes = comprasPendientes.filter((compras) => {
    // filtro para status  
    const filStatus = filtroStatus === "todos" || compras.status === filtroStatus;
    // Filtro para texto
    const filtroTexto = valorBusqueda.toLowerCase();
    const filTexto =
        compras.id.toLowerCase().includes(filtroTexto) ||
        compras.proveedor.toLowerCase().includes(filtroTexto);

      return filStatus && filTexto;
    });

  const handleStatusChange = (purchaseId: string, newStatus: string) => {
    setComprasPendientes(prevCompras =>
      prevCompras.map(compra =>
        compra.id === purchaseId ? { ...compra, status: newStatus } : compra
      )
    )
    toast({
      title: "Estado actualizado",
      description: `La orden de compra ${purchaseId} ha sido actualizada a "${newStatus}".`,
    })
  }

  const handleNewPurchaseChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setNuevaCompra((prev) => ({ ...prev, [name]: value }))
  }

  const handleCreatePurchase = () => {
    toast({
      title: "Orden de compra creada",
      description: `Se ha creado una nueva orden de compra para ${nuevaCompra.proveedor}.`,
    })
    setIsDialogOpen(false)
    setNuevaCompra({
      proveedor: "",
      articulo: "",
      cantidad: "",
      notes: "",
    })
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Compras a Proveedores</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger>
            <Button className="bg-pink-300 hover:bg-pink-400">
              <ShoppingCart className="mr-2 h-4 w-4" /> Levantar Orden de Compra
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-stone-50">
            <DialogHeader>
              <DialogTitle>Nueva Orden de Compra</DialogTitle>
              <DialogDescription>Crea una nueva orden de compra para reabastecer el inventario</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="proveedor">Proveedor</Label>
                <Input id="proveedor" name="proveedor" value={nuevaCompra.proveedor} onChange={handleNewPurchaseChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="articulo">Articulo</Label>
                <Input id="articulo" name="articulo" value={nuevaCompra.articulo} onChange={handleNewPurchaseChange}/>
              </div>
              <div className="space-y-2">
                <Label htmlFor="cantidad">Cantidad</Label>
                <Input 
                  id="cantidad" 
                  name="cantidad"
                  type="number"
                  min="0"
                  step="1"
                  className="pl-7"
                  value={nuevaCompra.cantidad} 
                  onChange={handleNewPurchaseChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Notas adicionales</Label>
                <Textarea
                  id="notes"
                  name="notes"
                  rows={2}
                  value={nuevaCompra.notes}
                  onChange={handleNewPurchaseChange}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleCreatePurchase} className="bg-pink-300 hover:bg-pink-400">
                Crear Orden
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Órdenes Pendientes</CardTitle>
            <FileText className="h-4 w-4 text-pink-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{comprasPendientes.length}</div>
            <p className="text-xs text-muted-foreground">
              Valor total: ${comprasPendientes.reduce((sum, purchase) => sum + purchase.total, 0)}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por ID, proveedor o artículo..."
              className="pl-8 mb-4"
              value={valorBusqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />`
        </div>
        <Select value={filtroStatus} onValueChange={setFiltro}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Categoría" />
            </SelectTrigger>
            <SelectContent className="bg-stone-50" >
              <SelectItem value="todos">Todas las categorías</SelectItem>
              <SelectItem value="Pendiente">Pendiente</SelectItem>
              <SelectItem value="Recibido">Recibido</SelectItem>
            </SelectContent>
        </Select>
      </div>

          <Card>
            <CardHeader>
              <CardTitle>Órdenes de Compra Pendientes</CardTitle>
              <CardDescription>Órdenes enviadas a proveedores pendientes de recepción</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Proveedor</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtroComprasPendientes.map((compras) => (
                    <TableRow key={compras.id}>
                      <TableCell className="font-medium">{compras.id}</TableCell>
                      <TableCell>{compras.proveedor}</TableCell>
                      <TableCell>{new Date(compras.fecha).toLocaleDateString()}</TableCell>
                      <TableCell>${compras.total}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={
                            compras.status === "Recibido" 
                              ? "bg-green-100 text-green-800" 
                              : "bg-yellow-100 text-yellow-800"
                            }>
                            {compras.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger>
                            <Button variant="ghost" size="sm">
                              <ChevronDown className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleStatusChange(compras.id, "Recibido")}>
                              Marcar como recibido
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
    </div>
  )
}
