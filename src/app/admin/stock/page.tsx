import { prisma } from "@/lib/prisma";
import Link from "next/link";
import StockList from "./StockList";

export default async function AdminStockPage() {
  const productos = await prisma.producto.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <main style={{ maxWidth: 960, margin: "0 auto", padding: "48px 20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
        <div>
          <h1 style={{ marginBottom: 6 }}>STOCK DE PRODUCTOS</h1>
          <p style={{ color: "var(--text-muted)" }}>
            Listado completo de equipos en STOCK ({productos.length} equipos).
          </p>
        </div>
        <Link href="/admin/agregar" className="btn btn-primary">
          + Agregar equipo
        </Link>
      </div>

      <StockList productos={productos} />
    </main>
  );
}

