import { prisma } from "@/lib/prisma";
import VentasPanel from "../ventas/VentasPanel";
import { Categoria } from "@prisma/client";

const CATEGORIAS_ACCESORIOS: Categoria[] = ["ACCESORIOS", "FUNDAS", "OTROS"];

export default async function VentasAccesoriosPage() {
  const [productos, ventas] = await Promise.all([
    prisma.producto.findMany({
      where: {
        visible: true,
        stock: { gt: 0 },
        OR: [
          { moneda: "ARS" },
          { categoria: { in: CATEGORIAS_ACCESORIOS } },
        ],
      },
      orderBy: { modelo: "asc" },
      select: { id: true, modelo: true, stock: true, moneda: true, categoria: true },
    }),
    prisma.venta.findMany({
      where: {
        OR: [
          { producto: { moneda: "ARS" } },
          { producto: { categoria: { in: CATEGORIAS_ACCESORIOS } } },
        ],
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
        titulo="VENTAS — ACCESORIOS"
        descripcion="Administración de ventas para accesorios, fundas, otros productos y todas las ventas en ARS (Pesos)."
        productos={productos}
        ventas={ventas}
        monedaForzada="ARS"
      />
    </main>
  );
}