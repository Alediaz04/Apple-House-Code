"use client";

import { useState, useTransition } from "react";
import { registrarVentaStock } from "./actions";

interface Producto {
  id: string;
  modelo: string;
  precioVenta: number;
  stock: number;
  moneda?: string;
}

export default function VentaModal({
  producto,
  onClose,
}: {
  producto: Producto;
  onClose: () => void;
}) {
  const [cantidad, setCantidad] = useState<number | "">(1);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const moneda = producto.moneda || "USD";
  const numCantidad = typeof cantidad === "number" ? cantidad : 0;
  const totalCalculado = (producto.precioVenta * numCantidad).toFixed(2);
  const esInvalido = typeof cantidad !== "number" || cantidad < 1 || cantidad > producto.stock || !Number.isInteger(cantidad);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (typeof cantidad !== "number" || cantidad < 1) {
      setError("La cantidad debe ser al menos 1.");
      return;
    }
    if (cantidad > producto.stock) {
      setError(`No puedes vender más del stock disponible (${producto.stock}).`);
      return;
    }

    startTransition(async () => {
      const res = await registrarVentaStock(producto.id, cantidad);
      if (res.ok) {
        onClose();
      } else if (res.error) {
        setError(res.error);
      }
    });
  };

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
          maxWidth: 460,
          background: "#181a20",
          border: "1px solid var(--border)",
          borderRadius: 16,
          padding: 28,
          boxShadow: "0 20px 50px rgba(0, 0, 0, 0.6)",
          position: "relative",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <h2 style={{ fontSize: "1.25rem", fontWeight: 700 }}>🛍️ Registrar Venta</h2>
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
          <div style={{ fontWeight: 600, fontSize: "1.05rem", marginBottom: 4 }}>{producto.modelo}</div>
          <div style={{ fontSize: "0.88rem", color: "var(--text-muted)", display: "flex", justifyContent: "space-between" }}>
            <span>Stock disponible: <b style={{ color: "#38bdf8" }}>{producto.stock} u.</b></span>
            <span>Precio unitario: <b>{moneda} ${producto.precioVenta}</b></span>
          </div>
        </div>

        {error && (
          <div className="form-alert error" style={{ marginBottom: 16 }}>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="admin-form">
          <div className="form-group" style={{ marginBottom: 20 }}>
            <label htmlFor="cantidadVenta" className="form-label">
              Cantidad a vender <span className="req">*</span>
            </label>
            <input
              id="cantidadVenta"
              type="number"
              min={1}
              max={producto.stock}
              step={1}
              required
              value={cantidad}
              onChange={(e) => {
                const raw = e.target.value;
                if (raw === "") {
                  setCantidad("");
                } else {
                  const val = parseInt(raw, 10);
                  setCantidad(isNaN(val) ? "" : val);
                }
              }}
              className="form-input"
              placeholder="Ingresá la cantidad"
            />
            <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: 6, display: "block" }}>
              Máximo permitido: {producto.stock} unidad(es).
            </span>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, padding: "12px 16px", background: "rgba(56,189,248,0.08)", borderRadius: 10, border: "1px solid rgba(56,189,248,0.2)" }}>
            <span style={{ fontSize: "0.9rem", color: "var(--text-muted)" }}>Total estimado:</span>
            <span style={{ fontSize: "1.2rem", fontWeight: 700, color: "#38bdf8" }}>{moneda} ${totalCalculado}</span>
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
              disabled={isPending || esInvalido}
            >
              {isPending ? "Registrando..." : "Confirmar Venta"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
