import { prisma } from "@/lib/prisma";
import VentasPanel from "./VentasPanel";
import { Categoria } from "@prisma/client";

const CATEGORIAS_EQUIPOS: Categoria[] = ["IPHONE", "MAC", "IPAD", "PLAY"];

export default async function VentasEquiposMainPage() {
  const [productos, ventas] = await Promise.all([
    prisma.producto.findMany({
      where: {
        visible: true,
        stock: { gt: 0 },
        moneda: "USD",
        categoria: { in: CATEGORIAS_EQUIPOS },
      },
      orderBy: { modelo: "asc" },
      select: { id: true, modelo: true, stock: true, moneda: true, categoria: true },
    }),
    prisma.venta.findMany({
      where: {
        producto: {
          moneda: "USD",
          categoria: { in: CATEGORIAS_EQUIPOS },
        },
      },
      orderBy: { createdAt: "desc" },
      include: {
        producto: {
          select: { modelo: true, categoria: true, moneda: true, precioCosto: true, precioVenta: true },
        },
      },
    }),
  ]);

  return (
    <main style={{ maxWidth: 960, margin: "0 auto", padding: "48px 20px" }}>
      <VentasPanel
        titulo="VENTAS — EQUIPOS"
        descripcion="Administración de ventas para equipos en USD (iPhone, Mac, iPad, Play)."
        productos={productos}
        ventas={ventas}
      />
    </main>
  );
}