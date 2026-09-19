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

    function formatearDinero(monto: number) {
        return `ARS $${monto.toLocaleString("es-AR", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        })}`;
    }

    return (
        <main style={{ maxWidth: 960, margin: "0 auto", padding: "48px 20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16, marginBottom: 24 }}>
                <div>
                    <h1 style={{ marginBottom: 6, fontSize: "2rem", fontWeight: 800 }}>REPARACIONES</h1>
                    <p style={{ color: "var(--text-muted)", margin: 0, fontSize: "0.95rem" }}>
                        Registrá y gestioná las reparaciones del servicio técnico de Apple House.
                    </p>
                </div>

                <Link
                    href="/admin/stock"
                    style={{
                        padding: "10px 18px",
                        borderRadius: 10,
                        border: "1px solid var(--border)",
                        background: "rgba(255, 255, 255, 0.05)",
                        color: "var(--text)",
                        fontWeight: 600,
                        fontSize: "0.88rem",
                        textDecoration: "none",
                        transition: "all 0.15s ease",
                    }}
                >
                    Ver Inventario
                </Link>
            </div>

            {/* Selector de Filtro de Fechas */}
            <FiltroFecha />

            {/* Dashboard de Métricas Financieras (estilo Ventas Accesorios) */}
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                    gap: 14,
                    marginBottom: 28,
                }}
            >
                {/* Total Facturado */}
                <div
                    style={{
                        padding: "18px 20px",
                        background: "rgba(56,189,248,0.08)",
                        border: "1px solid rgba(56,189,248,0.25)",
                        borderRadius: 14,
                    }}
                >
                    <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 700, letterSpacing: "0.5px" }}>
                        Total Facturado
                    </div>
                    <div style={{ fontSize: "1.45rem", fontWeight: 800, color: "#38bdf8", marginTop: 4 }}>
                        {formatearDinero(facturadoTotal)}
                    </div>
                </div>

                {/* Costo Repuestos */}
                <div
                    style={{
                        padding: "18px 20px",
                        background: "rgba(239,68,68,0.08)",
                        border: "1px solid rgba(239,68,68,0.25)",
                        borderRadius: 14,
                    }}
                >
                    <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 700, letterSpacing: "0.5px" }}>
                        Costo Repuestos
                    </div>
                    <div style={{ fontSize: "1.45rem", fontWeight: 800, color: "#ef4444", marginTop: 4 }}>
                        {formatearDinero(costoRepuestosTotal)}
                    </div>
                </div>

                {/* Ganancia Neta */}
                <div
                    style={{
                        padding: "18px 20px",
                        background: "rgba(34,197,94,0.08)",
                        border: "1px solid rgba(34,197,94,0.25)",
                        borderRadius: 14,
                    }}
                >
                    <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 700, letterSpacing: "0.5px" }}>
                        Ganancia Neta
                    </div>
                    <div style={{ fontSize: "1.45rem", fontWeight: 800, color: ganancia >= 0 ? "#4ade80" : "#ef4444", marginTop: 4 }}>
                        {formatearDinero(ganancia)}
                    </div>
                </div>
            </div>

            {/* Formulario para registrar Reparaciones */}
            <ReparacionForm />

            {/* Listado de Reparaciones */}
            <div style={{ marginTop: 36 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
                    <h2 style={{ fontSize: "1.25rem", fontWeight: 700, margin: 0 }}>
                        Reparaciones registradas
                    </h2>
                    <span style={{ fontSize: "0.85rem", color: "var(--text-muted)", background: "rgba(255,255,255,0.05)", padding: "4px 12px", borderRadius: 8, fontWeight: 600 }}>
                        {reparaciones.length} {reparaciones.length === 1 ? "registro" : "registros"}
                    </span>
                </div>

                <ReparacionesList reparaciones={reparaciones} />
            </div>
        </main>
    );
}