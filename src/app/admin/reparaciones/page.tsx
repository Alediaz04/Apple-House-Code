import { prisma } from "@/lib/prisma";
import Link from "next/link";
import ReparacionForm from "./ReparacionForm";
import ReparacionesList from "./ReparacionesList";
import FiltroFecha from "./FiltroFecha";

type Props = {
  searchParams: Promise<{
    rango?: string;
    desde?: string;
    hasta?: string;
  }>;
};

export default async function ReparacionesPage({ searchParams }: Props) {
  const params = await searchParams;

  const rango = params.rango ?? "todos";
  const desdeParam = params.desde;
  const hastaParam = params.hasta;

  const ahora = new Date();

  let desde: Date | undefined;
  let hasta: Date | undefined;

  if (rango === "hoy") {
    desde = new Date(
      ahora.getFullYear(),
      ahora.getMonth(),
      ahora.getDate()
    );

    hasta = new Date(
      ahora.getFullYear(),
      ahora.getMonth(),
      ahora.getDate() + 1
    );
  }

  if (rango === "semana") {
    const dia = ahora.getDay();
    const diferencia = dia === 0 ? 6 : dia - 1;

    desde = new Date(
      ahora.getFullYear(),
      ahora.getMonth(),
      ahora.getDate() - diferencia
    );

    hasta = new Date(
      desde.getFullYear(),
      desde.getMonth(),
      desde.getDate() + 7
    );
  }

  if (rango === "mes") {
    desde = new Date(
      ahora.getFullYear(),
      ahora.getMonth(),
      1
    );

    hasta = new Date(
      ahora.getFullYear(),
      ahora.getMonth() + 1,
      1
    );
  }

  if (rango === "personalizado" && desdeParam && hastaParam) {
    desde = new Date(`${desdeParam}T00:00:00`);

    hasta = new Date(`${hastaParam}T00:00:00`);
    hasta.setDate(hasta.getDate() + 1);
  }

  const reparaciones = await prisma.reparacion.findMany({
    where:
      desde && hasta
        ? {
            fechaIngreso: {
              gte: desde,
              lt: hasta,
            },
          }
        : undefined,
    orderBy: { fechaIngreso: "desc" },
  });

  const facturadoTotal = reparaciones.reduce(
    (total, reparacion) => total + (reparacion.cobro ?? 0),
    0
  );

  const costoRepuestosTotal = reparaciones.reduce(
    (total, reparacion) => total + (reparacion.costoRepuestos ?? 0),
    0
  );

  const ganancia = facturadoTotal - costoRepuestosTotal;

  const dinero = new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  });

  return (
    <div className="admin-page-container">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Reparaciones</h1>

          <p className="admin-page-subtitle">
            Registra una nueva reparacion y consulta las reparaciones existentes.
          </p>
        </div>

        <Link href="/admin/stock" className="admin-btn-secondary">
          Ver Inventario
        </Link>
      </div>

      <FiltroFecha />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 16,
          marginBottom: 32,
        }}
      >
        <div
          style={{
            padding: 20,
            borderRadius: 16,
            border: "1px solid var(--border)",
            background: "rgba(255, 255, 255, 0.03)",
          }}
        >
          <p
            style={{
              margin: 0,
              color: "var(--text-muted)",
              fontSize: 14,
            }}
          >
            Facturado total
          </p>

          <strong
            style={{
              display: "block",
              marginTop: 8,
              fontSize: 26,
            }}
          >
            {dinero.format(facturadoTotal)}
          </strong>
        </div>

        <div
          style={{
            padding: 20,
            borderRadius: 16,
            border: "1px solid var(--border)",
            background: "rgba(255, 255, 255, 0.03)",
          }}
        >
          <p
            style={{
              margin: 0,
              color: "var(--text-muted)",
              fontSize: 14,
            }}
          >
            Costo de repuestos
          </p>

          <strong
            style={{
              display: "block",
              marginTop: 8,
              fontSize: 26,
            }}
          >
            {dinero.format(costoRepuestosTotal)}
          </strong>
        </div>

        <div
          style={{
            padding: 20,
            borderRadius: 16,
            border: "1px solid var(--border)",
            background: "rgba(255, 255, 255, 0.03)",
          }}
        >
          <p
            style={{
              margin: 0,
              color: "var(--text-muted)",
              fontSize: 14,
            }}
          >
            Ganancia
          </p>

          <strong
            style={{
              display: "block",
              marginTop: 8,
              fontSize: 26,
            }}
          >
            {dinero.format(ganancia)}
          </strong>
        </div>
      </div>

      <ReparacionForm />

      <div style={{ marginTop: 40 }}>
        <div style={{ marginBottom: 20 }}>
          <h2 style={{ marginBottom: 6 }}>
            Reparaciones registradas
          </h2>

          <p style={{ color: "var(--text-muted)", margin: 0 }}>
            {reparaciones.length} reparacion
            {reparaciones.length === 1 ? "" : "es"} registrada
            {reparaciones.length === 1 ? "" : "s"}.
          </p>
        </div>

        <ReparacionesList reparaciones={reparaciones} />
      </div>
    </div>
  );
}