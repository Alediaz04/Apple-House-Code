"use client";

import { useState, useTransition } from "react";
import { editarVenta } from "./actions";

interface VentaItem {
  id: string;
  cantidad: number;
  precioUnitario: number;
  total: number;
  createdAt: Date;
  producto: {
    modelo: string;
    categoria: string;
    moneda?: string;
    precioCosto?: number | null;
  };
}

function formatForDateTimeInput(date: Date | string) {
  const d = new Date(date);
  if (isNaN(d.getTime())) return "";
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

export default function EditVentaModal({
  venta,
  onClose,
  monedaForzada,
}: {
  venta: VentaItem;
  onClose: () => void;
  monedaForzada?: "ARS" | "USD";
}) {
  const [cantidad, setCantidad] = useState<number | "">(venta.cantidad);
  const [precioUnitario, setPrecioUnitario] = useState<number | "">(venta.precioUnitario);
  const [fecha, setFecha] = useState<string>(formatForDateTimeInput(venta.createdAt));
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const moneda = monedaForzada || venta.producto.moneda || "USD";
  const numCant = typeof cantidad === "number" ? cantidad : 0;
  const numPrecio = typeof precioUnitario === "number" ? precioUnitario : 0;
  const totalCalculado = numCant * numPrecio;
  const costoUnitario = venta.producto.precioCosto || 0;
  const costoTotalCalculado = numCant * costoUnitario;
  const gananciaCalculada = totalCalculado - costoTotalCalculado;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const res = await editarVenta(venta.id, null, formData);
      if (res?.ok) {
        onClose();
      } else if (res?.error) {
        setError(res.error);
      }
    });
  }

  return (
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
      onClick={onClose}
    >
      <div
        className="admin-form-card"
        style={{
          width: "100%",
          maxWidth: 500,
          background: "#181a20",
          border: "1px solid var(--border)",
          borderRadius: 16,
          padding: 28,
          boxShadow: "0 20px 50px rgba(0,0,0,0.6)",
          position: "relative",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h2 style={{ fontSize: "1.25rem", fontWeight: 700 }}>✏️ Editar Venta</h2>
          <button
            onClick={onClose}
            type="button"
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid var(--border)",
              borderRadius: "50%",
              width: 32,
              height: 32,
              color: "var(--text-muted)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
          >
            ✕
          </button>
        </div>

        <div style={{ marginBottom: 20, padding: 14, background: "rgba(255,255,255,0.03)", borderRadius: 10, border: "1px solid var(--border)" }}>
          <div style={{ fontWeight: 600, fontSize: "1.05rem" }}>{venta.producto.modelo}</div>
          <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginTop: 4 }}>
            Categoría: <b>{venta.producto.categoria}</b> · Moneda: <b>{moneda}</b>
          </div>
        </div>

        {error && (
          <div className="form-alert error" style={{ marginBottom: 16 }}>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="admin-form">
          <div className="form-grid gap-16">
            <div className="form-group">
              <label htmlFor="cantidad" className="form-label">
                Cantidad <span className="req">*</span>
              </label>
              <input
                id="cantidad"
                name="cantidad"
                type="number"
                min="1"
                step="1"
                required
                value={cantidad}
                onChange={(e) => {
                  const val = e.target.value;
                  setCantidad(val === "" ? "" : parseInt(val, 10));
                }}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="precioUnitario" className="form-label">
                Precio Unitario ({moneda}) <span className="req">*</span>
              </label>
              <input
                id="precioUnitario"
                name="precioUnitario"
                type="number"
                step="0.01"
                min="0"
                required
                value={precioUnitario}
                onChange={(e) => {
                  const val = e.target.value;
                  setPrecioUnitario(val === "" ? "" : parseFloat(val));
                }}
                className="form-input"
              />
            </div>

            <div className="form-group col-span-2">
              <label htmlFor="fecha" className="form-label">
                Fecha y Hora de la Venta <span className="req">*</span>
              </label>
              <input
                id="fecha"
                name="fecha"
                type="datetime-local"
                required
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
                className="form-input"
              />
            </div>
          </div>

          {/* Resumen dinámico financiero */}
          <div
            style={{
              marginTop: 20,
              marginBottom: 24,
              padding: "14px 18px",
              background: "rgba(56,189,248,0.06)",
              borderRadius: 12,
              border: "1px solid rgba(56,189,248,0.2)",
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 12,
              textAlign: "center",
            }}
          >
            <div>
              <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 600 }}>
                Total Venta
              </div>
              <div style={{ fontWeight: 700, fontSize: "1.05rem", color: "#38bdf8", marginTop: 4 }}>
                {moneda} ${totalCalculado.toFixed(2)}
              </div>
            </div>

            <div>
              <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 600 }}>
                Costo Total
              </div>
              <div style={{ fontWeight: 700, fontSize: "1.05rem", color: "#ef4444", marginTop: 4 }}>
                {moneda} ${costoTotalCalculado.toFixed(2)}
              </div>
            </div>

            <div>
              <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 600 }}>
                Ganancia Neta
              </div>
              <div style={{ fontWeight: 700, fontSize: "1.05rem", color: gananciaCalculada >= 0 ? "#4ade80" : "#ef4444", marginTop: 4 }}>
                {moneda} ${gananciaCalculada.toFixed(2)}
              </div>
            </div>
          </div>

          <div style={{ display: "flex", gap: 12 }}>
            <button
              type="button"
              onClick={onClose}
              className="admin-btn-secondary"
              style={{ flex: 1, justifyContent: "center" }}
              disabled={isPending}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="admin-submit-btn"
              style={{ flex: 1, justifyContent: "center" }}
              disabled={isPending}
            >
              {isPending ? "Guardando..." : "Guardar Cambios"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
