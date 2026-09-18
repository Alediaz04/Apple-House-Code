"use client";

import { useActionState } from "react";
import { registrarVenta } from "./actions";

type ProductoDisponible = {
  id: string;
  modelo: string;
  stock: number;
};

type Venta = {
  id: string;
  cantidad: number;
  precioUnitario: number;
  total: number;
  createdAt: Date;
  producto: {
    modelo: string;
    categoria: string;
  };
};

export default function VentasPanel({
  productos,
  ventas,
}: {
  productos: ProductoDisponible[];
  ventas: Venta[];
}) {
  const [state, formAction, pending] = useActionState(registrarVenta, null);

  return (
    <div style={{ display: "grid", gap: 24 }}>
      <section className="admin-form-card">
        <div className="form-section-header">
          <span className="section-number">1</span>
          <h3>Registrar venta</h3>
        </div>

        <form action={formAction} className="admin-form">
          <div className="form-grid gap-16">
            <div className="form-group">
              <label htmlFor="productoId" className="form-label">
                Equipo <span className="req">*</span>
              </label>
              <select
                id="productoId"
                name="productoId"
                required
                defaultValue=""
                className="form-select"
              >
                <option value="" disabled>
                  Seleccioná un equipo
                </option>
                {productos.map((producto) => (
                  <option key={producto.id} value={producto.id}>
                    {producto.modelo} ({producto.stock} disponibles)
                  </option>
                ))}
              </select>
            </div>

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
                defaultValue="1"
                required
                className="form-input"
              />
            </div>
          </div>

          {productos.length === 0 && (
            <p className="form-help">No hay productos con stock disponible para vender.</p>
          )}

          {state?.error && <div className="form-alert error">{state.error}</div>}
          {state?.ok && <div className="form-alert success">Venta registrada y stock actualizado.</div>}

          <button
            type="submit"
            className="admin-submit-btn"
            disabled={pending || productos.length === 0}
          >
            {pending ? "Registrando..." : "Registrar venta"}
          </button>
        </form>
      </section>

      <section>
        <div className="form-section-header" style={{ marginBottom: 16 }}>
          <span className="section-number">2</span>
          <h3>Ventas concretadas</h3>
        </div>

        {ventas.length === 0 ? (
          <div className="admin-form-card" style={{ color: "var(--text-muted)" }}>
            Todavía no hay ventas registradas.
          </div>
        ) : (
          <div style={{ display: "grid", gap: 12 }}>
            {ventas.map((venta) => (
              <article
                key={venta.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 16,
                  padding: 18,
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid var(--border)",
                  borderRadius: 12,
                }}
              >
                <div>
                  <strong>{venta.producto.modelo}</strong>
                  <div style={{ color: "var(--text-muted)", marginTop: 6 }}>
                    {venta.producto.categoria} · {venta.cantidad} unidad(es) ·{" "}
                    {new Date(venta.createdAt).toLocaleString("es-AR")}
                  </div>
                </div>
                <strong style={{ color: "#38bdf8", whiteSpace: "nowrap" }}>
                  USD {venta.total.toFixed(2)}
                </strong>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
