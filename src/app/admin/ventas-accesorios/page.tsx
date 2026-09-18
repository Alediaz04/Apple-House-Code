import { prisma } from "@/lib/prisma";

const CATEGORIAS_ACCESORIOS = ["ACCESORIOS", "OTROS"] as const;

export default async function VentasAccesoriosPage() {
  const vendidos = await prisma.producto.findMany({
    where: {
      stock: 0,
      categoria: { in: CATEGORIAS_ACCESORIOS },
    },
    orderBy: { updatedAt: "desc" },
  });

  const total = vendidos.reduce((acc, p) => acc + p.precioVenta, 0);

  return (
    <div style={{ maxWidth: 960, margin: "0 auto", padding: "32px 20px" }}>
      <h1 style={{ marginBottom: 6 }}>Ventas — Accesorios</h1>
      <p style={{ color: "var(--text-muted)", marginBottom: 24 }}>
        Accesorios, fundas y otros marcados como vendidos desde Stock.
      </p>

      <div
        style={{
          marginBottom: 24,
          padding: "16px 20px",
          background: "rgba(56,189,248,0.08)",
          border: "1px solid rgba(56,189,248,0.25)",
          borderRadius: 12,
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <span>{vendidos.length} accesorios vendidos</span>
        <b style={{ color: "#38bdf8" }}>Total: USD {total}</b>
      </div>

      {vendidos.length === 0 ? (
        <div style={{ padding: 40, textAlign: "center", color: "var(--text-muted)", background: "rgba(255,255,255,0.03)", borderRadius: 12 }}>
          Todavía no se vendió ningún accesorio.
        </div>
      ) : (
        <div style={{ display: "grid", gap: 12 }}>
          {vendidos.map((p) => (
            <div
              key={p.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "14px 18px",
                background: "rgba(255,255,255,0.03)",
                border: "1px solid var(--border)",
                borderRadius: 10,
              }}
            >
              <div>
                <div style={{ fontWeight: 600 }}>{p.modelo}</div>
                <div style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
                  {p.categoria} · {p.estado} · Vendido el {p.updatedAt.toLocaleDateString("es-AR")}
                </div>
              </div>
              <b style={{ color: "#38bdf8" }}>USD {p.precioVenta}</b>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}