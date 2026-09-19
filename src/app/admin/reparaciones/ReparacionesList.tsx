"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import {
    cambiarEstadoReparacion,
    editarReparacion,
    eliminarReparacion,
} from "./actions";

interface Reparacion {
    id: string;
    nombreCliente: string;
    telefono: string;
    email: string | null;
    dispositivo: string;
    fechaIngreso: Date | string;
    cobro: number | null;
    costoRepuestos: number | null;
    descripcion: string | null;
    estado: "PENDIENTE" | "ENTREGADO";
}

function formatearFecha(fecha: Date | string) {
    const date = new Date(fecha);
    return date.toLocaleDateString("es-AR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    });
}

function formatearFechaInput(fecha: Date | string) {
    const date = new Date(fecha);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}

function formatearMonto(monto: number | null) {
    if (monto === null || monto === undefined) return "—";
    return `ARS $${monto.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export default function ReparacionesList({
    reparaciones,
}: {
    reparaciones: Reparacion[];
}) {
    const [filtroEstado, setFiltroEstado] = useState<"TODOS" | "PENDIENTE" | "ENTREGADO">("TODOS");
    const [deletingReparacion, setDeletingReparacion] = useState<Reparacion | null>(null);
    const [editingReparacion, setEditingReparacion] = useState<Reparacion | null>(null);
    const [isPending, startTransition] = useTransition();

    function confirmarEliminacion() {
        if (!deletingReparacion) return;
        const id = deletingReparacion.id;

        startTransition(async () => {
            const result = await eliminarReparacion(id);
            if (!result.ok) {
                alert(result.error || "No se pudo eliminar la reparación.");
                return;
            }
            setDeletingReparacion(null);
        });
    }

    async function cambiarEstado(reparacion: Reparacion) {
        const nuevoEstado = reparacion.estado === "PENDIENTE" ? "ENTREGADO" : "PENDIENTE";
        startTransition(async () => {
            const result = await cambiarEstadoReparacion(reparacion.id, nuevoEstado);
            if (!result.ok) {
                alert(result.error || "No se pudo cambiar el estado.");
            }
        });
    }

    async function guardarEdicion(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (!editingReparacion) return;

        const formData = new FormData(event.currentTarget);

        startTransition(async () => {
            const result = await editarReparacion(editingReparacion.id, formData);
            if (!result.ok) {
                alert(result.error || "No se pudo actualizar la reparación.");
                return;
            }
            setEditingReparacion(null);
        });
    }

    const pendCount = reparaciones.filter((r) => r.estado === "PENDIENTE").length;
    const entregCount = reparaciones.filter((r) => r.estado === "ENTREGADO").length;

    const reparacionesFiltradas = reparaciones.filter((r) => {
        if (filtroEstado === "TODOS") return true;
        return r.estado === filtroEstado;
    });

    if (reparaciones.length === 0) {
        return (
            <div className="admin-form-card" style={{ color: "var(--text-muted)", textAlign: "center", padding: 32 }}>
                Todavía no hay reparaciones registradas en este período.
            </div>
        );
    }

    return (
        <>
            {/* Menú de Categorías por Estado (Todas, No Entregadas, Entregadas) */}
            <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap" }}>
                <button
                    type="button"
                    onClick={() => setFiltroEstado("TODOS")}
                    style={{
                        padding: "8px 16px",
                        borderRadius: 10,
                        fontSize: "0.88rem",
                        fontWeight: 700,
                        border: filtroEstado === "TODOS" ? "1px solid #38bdf8" : "1px solid var(--border)",
                        background: filtroEstado === "TODOS" ? "rgba(56,189,248,0.15)" : "rgba(255,255,255,0.03)",
                        color: filtroEstado === "TODOS" ? "#38bdf8" : "var(--text-muted)",
                        cursor: "pointer",
                        transition: "all 0.15s ease",
                    }}
                >
                    Todas ({reparaciones.length})
                </button>

                <button
                    type="button"
                    onClick={() => setFiltroEstado("PENDIENTE")}
                    style={{
                        padding: "8px 16px",
                        borderRadius: 10,
                        fontSize: "0.88rem",
                        fontWeight: 700,
                        border: filtroEstado === "PENDIENTE" ? "1px solid rgba(234, 179, 8, 0.5)" : "1px solid var(--border)",
                        background: filtroEstado === "PENDIENTE" ? "rgba(234, 179, 8, 0.18)" : "rgba(255,255,255,0.03)",
                        color: filtroEstado === "PENDIENTE" ? "#facc15" : "var(--text-muted)",
                        cursor: "pointer",
                        transition: "all 0.15s ease",
                    }}
                >
                    ⏳ No Entregadas / Pendientes ({pendCount})
                </button>

                <button
                    type="button"
                    onClick={() => setFiltroEstado("ENTREGADO")}
                    style={{
                        padding: "8px 16px",
                        borderRadius: 10,
                        fontSize: "0.88rem",
                        fontWeight: 700,
                        border: filtroEstado === "ENTREGADO" ? "1px solid rgba(34, 197, 94, 0.5)" : "1px solid var(--border)",
                        background: filtroEstado === "ENTREGADO" ? "rgba(34, 197, 94, 0.18)" : "rgba(255,255,255,0.03)",
                        color: filtroEstado === "ENTREGADO" ? "#4ade80" : "var(--text-muted)",
                        cursor: "pointer",
                        transition: "all 0.15s ease",
                    }}
                >
                    ✓ Entregadas ({entregCount})
                </button>
            </div>

            {reparacionesFiltradas.length === 0 ? (
                <div className="admin-form-card" style={{ color: "var(--text-muted)", textAlign: "center", padding: 32 }}>
                    No hay reparaciones en la categoría &quot;{filtroEstado === "PENDIENTE" ? "No Entregadas / Pendientes" : "Entregadas"}&quot;.
                </div>
            ) : (
                <div style={{ display: "grid", gap: 14 }}>
                    {reparacionesFiltradas.map((reparacion) => {
                        const cobro = reparacion.cobro ?? 0;
                        const costoRepuestos = reparacion.costoRepuestos ?? 0;
                        const ganancia = cobro - costoRepuestos;
                        const tieneCosto = reparacion.costoRepuestos !== null && reparacion.costoRepuestos !== undefined;
                        const tieneCobro = reparacion.cobro !== null && reparacion.cobro !== undefined;

                        return (
                            <article
                                key={reparacion.id}
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: 14,
                                    padding: "20px 22px",
                                    background: "rgba(255,255,255,0.03)",
                                    border: "1px solid var(--border)",
                                    borderRadius: 14,
                                    transition: "border-color 0.15s ease",
                                }}
                            >
                                {/* Encabezado */}
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16, flexWrap: "wrap" }}>
                                    <div>
                                        <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                                            <strong style={{ fontSize: "1.15rem" }}>{reparacion.dispositivo}</strong>

                                            {/* Insignia de Estado */}
                                            <span
                                                style={{
                                                    fontSize: "0.78rem",
                                                    fontWeight: 800,
                                                    padding: "3px 10px",
                                                    borderRadius: 999,
                                                    background:
                                                        reparacion.estado === "PENDIENTE"
                                                            ? "rgba(234, 179, 8, 0.15)"
                                                            : "rgba(34, 197, 94, 0.15)",
                                                    color:
                                                        reparacion.estado === "PENDIENTE"
                                                            ? "#facc15"
                                                            : "#4ade80",
                                                    border:
                                                        reparacion.estado === "PENDIENTE"
                                                            ? "1px solid rgba(234, 179, 8, 0.3)"
                                                            : "1px solid rgba(34, 197, 94, 0.3)",
                                                }}
                                            >
                                                {reparacion.estado === "PENDIENTE" ? "PENDIENTE" : "ENTREGADO"}
                                            </span>
                                        </div>

                                        <div style={{ color: "var(--text-muted)", fontSize: "0.88rem", marginTop: 6, display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
                                            <span>👤 <strong>{reparacion.nombreCliente}</strong></span>
                                            <span>📞 {reparacion.telefono}</span>
                                            {reparacion.email && <span>✉️ {reparacion.email}</span>}
                                            <span>📅 Ingreso: {formatearFecha(reparacion.fechaIngreso)}</span>
                                        </div>
                                    </div>

                                    {/* Botones de Acción */}
                                    <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                                        <button
                                            type="button"
                                            onClick={() => cambiarEstado(reparacion)}
                                            style={{
                                                background: reparacion.estado === "PENDIENTE" ? "rgba(34, 197, 94, 0.12)" : "rgba(234, 179, 8, 0.12)",
                                                border: reparacion.estado === "PENDIENTE" ? "1px solid rgba(34, 197, 94, 0.3)" : "1px solid rgba(234, 179, 8, 0.3)",
                                                borderRadius: 8,
                                                padding: "8px 12px",
                                                color: reparacion.estado === "PENDIENTE" ? "#4ade80" : "#facc15",
                                                fontSize: "0.85rem",
                                                fontWeight: 700,
                                                cursor: "pointer",
                                                transition: "all 0.15s ease",
                                            }}
                                        >
                                            {reparacion.estado === "PENDIENTE" ? "✓ Marcar Entregada" : "⏳ Marcar Pendiente"}
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => setEditingReparacion(reparacion)}
                                            style={{
                                                background: "rgba(255,255,255,0.06)",
                                                border: "1px solid var(--border)",
                                                borderRadius: 8,
                                                padding: "8px 12px",
                                                color: "var(--text)",
                                                fontSize: "0.85rem",
                                                fontWeight: 500,
                                                display: "flex",
                                                alignItems: "center",
                                                gap: 6,
                                                cursor: "pointer",
                                                transition: "all 0.15s ease",
                                            }}
                                        >
                                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                                            </svg>
                                            Editar
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => setDeletingReparacion(reparacion)}
                                            style={{
                                                background: "rgba(239, 68, 68, 0.1)",
                                                border: "1px solid rgba(239, 68, 68, 0.25)",
                                                borderRadius: 8,
                                                padding: "8px 12px",
                                                color: "#ef4444",
                                                fontSize: "0.85rem",
                                                fontWeight: 600,
                                                display: "flex",
                                                alignItems: "center",
                                                gap: 6,
                                                cursor: "pointer",
                                                transition: "all 0.15s ease",
                                            }}
                                        >
                                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <polyline points="3 6 5 6 21 6" />
                                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                            </svg>
                                            Eliminar
                                        </button>
                                    </div>
                                </div>

                                {/* Desglose Financiero Estético */}
                                <div
                                    style={{
                                        display: "grid",
                                        gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
                                        gap: 10,
                                        padding: "12px 14px",
                                        background: "rgba(0,0,0,0.25)",
                                        borderRadius: 10,
                                        border: "1px solid rgba(255,255,255,0.05)",
                                    }}
                                >
                                    <div>
                                        <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600 }}>COBRO TOTAL</div>
                                        <div style={{ fontSize: "0.95rem", fontWeight: 800, color: "#38bdf8", marginTop: 2 }}>
                                            {formatearMonto(reparacion.cobro)}
                                        </div>
                                    </div>

                                    <div>
                                        <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600 }}>COSTO REPUESTOS</div>
                                        <div style={{ fontSize: "0.95rem", fontWeight: 700, color: tieneCosto ? "#ef4444" : "var(--text-muted)", marginTop: 2 }}>
                                            {formatearMonto(reparacion.costoRepuestos)}
                                        </div>
                                    </div>

                                    <div>
                                        <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600 }}>GANANCIA NETA</div>
                                        <div style={{ fontSize: "0.95rem", fontWeight: 800, color: (tieneCobro || tieneCosto) ? (ganancia >= 0 ? "#4ade80" : "#ef4444") : "var(--text-muted)", marginTop: 2 }}>
                                            {(tieneCobro || tieneCosto) ? `${ganancia >= 0 ? "+" : ""}${formatearMonto(ganancia)}` : "—"}
                                        </div>
                                    </div>
                                </div>

                                {/* Observaciones */}
                                {reparacion.descripcion && (
                                    <div
                                        style={{
                                            padding: "12px 14px",
                                            borderRadius: 8,
                                            border: "1px solid rgba(255,255,255,0.06)",
                                            background: "rgba(255,255,255,0.015)",
                                            fontSize: "0.88rem",
                                            color: "var(--text-muted)",
                                        }}
                                    >
                                        <strong style={{ color: "var(--text)", fontSize: "0.82rem", textTransform: "uppercase", letterSpacing: "0.5px", display: "block", marginBottom: 4 }}>
                                            📝 Observaciones:
                                        </strong>
                                        {reparacion.descripcion}
                                    </div>
                                )}
                            </article>
                        );
                    })}
                </div>
            )}

            {/* Modal Editar Reparación */}
            {editingReparacion && (
                <div
                    style={{
                        position: "fixed",
                        inset: 0,
                        zIndex: 250,
                        background: "rgba(0,0,0,0.75)",
                        backdropFilter: "blur(6px)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: 16,
                    }}
                    onClick={() => setEditingReparacion(null)}
                >
                    <div
                        style={{
                            width: "100%",
                            maxWidth: 580,
                            background: "#181a20",
                            border: "1px solid var(--border)",
                            borderRadius: 16,
                            padding: 28,
                            boxShadow: "0 20px 50px rgba(0,0,0,0.6)",
                            maxHeight: "90vh",
                            overflowY: "auto",
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: 20 }}>
                            Editar Reparación
                        </h3>

                        <form onSubmit={guardarEdicion} style={{ display: "grid", gap: 16 }}>
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 14 }}>
                                <div className="form-group">
                                    <label className="form-label">Nombre del cliente *</label>
                                    <input
                                        name="nombreCliente"
                                        defaultValue={editingReparacion.nombreCliente}
                                        required
                                        className="form-input"
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Teléfono *</label>
                                    <input
                                        name="telefono"
                                        type="tel"
                                        defaultValue={editingReparacion.telefono}
                                        required
                                        className="form-input"
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Email (opcional)</label>
                                <input
                                    name="email"
                                    type="email"
                                    defaultValue={editingReparacion.email ?? ""}
                                    className="form-input"
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Dispositivo *</label>
                                <input
                                    name="dispositivo"
                                    defaultValue={editingReparacion.dispositivo}
                                    required
                                    className="form-input"
                                />
                            </div>

                            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 14 }}>
                                <div className="form-group">
                                    <label className="form-label">Fecha ingreso *</label>
                                    <input
                                        name="fechaIngreso"
                                        type="date"
                                        defaultValue={formatearFechaInput(editingReparacion.fechaIngreso)}
                                        required
                                        className="form-input"
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Cobro (AR$)</label>
                                    <input
                                        name="cobro"
                                        type="number"
                                        step="any"
                                        min="0"
                                        defaultValue={editingReparacion.cobro ?? ""}
                                        className="form-input"
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Repuestos (AR$)</label>
                                    <input
                                        name="costoRepuestos"
                                        type="number"
                                        step="any"
                                        min="0"
                                        defaultValue={editingReparacion.costoRepuestos ?? ""}
                                        className="form-input"
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Descripción / Observaciones</label>
                                <textarea
                                    name="descripcion"
                                    rows={3}
                                    defaultValue={editingReparacion.descripcion ?? ""}
                                    className="form-input"
                                    style={{ resize: "vertical" }}
                                />
                            </div>

                            <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
                                <button
                                    type="button"
                                    onClick={() => setEditingReparacion(null)}
                                    className="admin-btn-secondary"
                                    style={{ flex: 1, justifyContent: "center" }}
                                    disabled={isPending}
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={isPending}
                                    style={{
                                        flex: 1,
                                        display: "inline-flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        padding: "10px 16px",
                                        borderRadius: "var(--radius-m)",
                                        background: "#38bdf8",
                                        border: "none",
                                        color: "#000000",
                                        fontWeight: 700,
                                        fontSize: "0.9rem",
                                        cursor: isPending ? "wait" : "pointer",
                                        opacity: isPending ? 0.7 : 1,
                                        boxShadow: "0 4px 14px rgba(56, 189, 248, 0.25)",
                                        transition: "all 0.15s ease",
                                    }}
                                >
                                    {isPending ? "Guardando..." : "Guardar cambios"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal Confirmación Eliminación */}
            {deletingReparacion && (
                <div
                    style={{
                        position: "fixed",
                        inset: 0,
                        zIndex: 250,
                        background: "rgba(0, 0, 0, 0.75)",
                        backdropFilter: "blur(6px)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: 16,
                    }}
                    onClick={() => setDeletingReparacion(null)}
                >
                    <div
                        style={{
                            width: "100%",
                            maxWidth: 440,
                            background: "#181a20",
                            border: "1px solid var(--border)",
                            borderRadius: 16,
                            padding: 28,
                            boxShadow: "0 20px 50px rgba(0, 0, 0, 0.6)",
                            textAlign: "center",
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div
                            style={{
                                width: 52,
                                height: 52,
                                borderRadius: "50%",
                                background: "rgba(239, 68, 68, 0.15)",
                                border: "1px solid rgba(239, 68, 68, 0.3)",
                                color: "#ef4444",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                margin: "0 auto 16px auto",
                            }}
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                <line x1="10" y1="11" x2="10" y2="17" />
                                <line x1="14" y1="11" x2="14" y2="17" />
                            </svg>
                        </div>

                        <h3 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: 8 }}>
                            ¿Eliminar reparación?
                        </h3>
                        <p style={{ color: "var(--text-muted)", fontSize: "0.92rem", lineHeight: 1.5, marginBottom: 24 }}>
                            Estás a punto de eliminar el registro de reparación del cliente{" "}
                            <b style={{ color: "var(--text)" }}>&quot;{deletingReparacion.nombreCliente}&quot;</b> ({deletingReparacion.dispositivo}).
                        </p>

                        <div style={{ display: "flex", gap: 12 }}>
                            <button
                                type="button"
                                onClick={() => setDeletingReparacion(null)}
                                className="admin-btn-secondary"
                                style={{ flex: 1, justifyContent: "center" }}
                                disabled={isPending}
                            >
                                Cancelar
                            </button>
                            <button
                                type="button"
                                onClick={confirmarEliminacion}
                                disabled={isPending}
                                style={{
                                    flex: 1,
                                    display: "inline-flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    padding: "10px 16px",
                                    borderRadius: "var(--radius-m)",
                                    background: "#dc2626",
                                    border: "none",
                                    color: "#ffffff",
                                    fontWeight: 600,
                                    fontSize: "0.9rem",
                                    cursor: isPending ? "wait" : "pointer",
                                    opacity: isPending ? 0.7 : 1,
                                    boxShadow: "0 4px 14px rgba(220, 38, 38, 0.35)",
                                    transition: "all 0.15s ease",
                                }}
                            >
                                {isPending ? "Eliminando..." : "Sí, eliminar"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}