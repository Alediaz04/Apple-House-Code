import { prisma } from "@/lib/prisma";
import VentasPanel from "./VentasPanel";

export default async function VentasPage() {
  const [productos, ventas] = await Promise.all([
    prisma.producto.findMany({
      where: { visible: true, stock: { gt: 0 } },
      orderBy: { modelo: "asc" },
      select: { id: true, modelo: true, stock: true },
    }),
    prisma.venta.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        producto: {
          select: { modelo: true, categoria: true },
        },
      },
    }),
  ]);

  return (
    <main style={{ maxWidth: 960, margin: "0 auto", padding: "48px 20px" }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ marginBottom: 6 }}>VENTAS</h1>
        <p style={{ color: "var(--text-muted)" }}>
          Registrá una venta para descontar stock y conservar el historial.
        </p>
      </div>

      <VentasPanel productos={productos} ventas={ventas} />
    </main>
  );
}
