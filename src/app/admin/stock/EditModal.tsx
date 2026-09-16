"use client";

import { useState, useTransition } from "react";
import { editarProducto } from "./actions";

interface ProductoItem {
  id: string;
  modelo: string;
  categoria: string;
  estado: string;
  color: string | null;
  memoria: string | null;
  bateria: string | null;
  precioVenta: number;
  precioCosto: number | null;
}

const CATEGORIAS = [
  { value: "IPHONE", label: "📱 iPhone" },
  { value: "MAC", label: "💻 Mac" },
  { value: "IPAD", label: "✏️ iPad" },
  { value: "ACCESORIOS", label: "🎧 Accesorios" },
  { value: "OTROS", label: "📦 Otros" },
];

export default function EditModal({
  producto,
  onClose,
}: {
  producto: ProductoItem;
  onClose: () => void;
}) {
  const [estadoSeleccionado, setEstadoSeleccionado] = useState<"NUEVO" | "USADO">(
    producto.estado as "NUEVO" | "USADO"
  );
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const res = await editarProducto(producto.id, null, formData);
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
        zIndex: 200,
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
          maxWidth: 600,
          maxHeight: "90vh",
          overflowY: "auto",
          position: "relative",
          border: "1px solid var(--border)",
          boxShadow: "0 20px 50px rgba(0,0,0,0.6)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h2 style={{ fontSize: "1.3rem", fontWeight: 700 }}>✏️ Editar Producto</h2>
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

        {error && (
          <div className="form-alert error" style={{ marginBottom: 16 }}>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="admin-form">
          <div className="form-grid gap-16">
            <div className="form-group col-span-2">
              <label htmlFor="modelo" className="form-label">
                Modelo del equipo <span className="req">*</span>
              </label>
              <input
                id="modelo"
                name="modelo"
                required
                defaultValue={producto.modelo}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="categoria" className="form-label">
                Categoría <span className="req">*</span>
              </label>
              <select
                id="categoria"
                name="categoria"
                required
                defaultValue={producto.categoria}
                className="form-select"
              >
                {CATEGORIAS.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">
                Estado <span className="req">*</span>
              </label>
              <div className="radio-pill-group">
                <label className={`radio-pill ${estadoSeleccionado === "NUEVO" ? "active nuevo" : ""}`}>
                  <input
                    type="radio"
                    name="estado"
                    value="NUEVO"
                    checked={estadoSeleccionado === "NUEVO"}
                    onChange={() => setEstadoSeleccionado("NUEVO")}
                  />
                  <span>✨ Nuevo</span>
                </label>

                <label className={`radio-pill ${estadoSeleccionado === "USADO" ? "active usado" : ""}`}>
                  <input
                    type="radio"
                    name="estado"
                    value="USADO"
                    checked={estadoSeleccionado === "USADO"}
                    onChange={() => setEstadoSeleccionado("USADO")}
                  />
                  <span>🔄 Usado</span>
                </label>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="color" className="form-label">
                Color
              </label>
              <input
                id="color"
                name="color"
                defaultValue={producto.color || ""}
                placeholder="Ej: Natural Titanium"
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="memoria" className="form-label">
                Memoria
              </label>
              <input
                id="memoria"
                name="memoria"
                defaultValue={producto.memoria || ""}
                placeholder="Ej: 128 GB"
                className="form-input"
              />
            </div>

            <div className="form-group col-span-2">
              <label htmlFor="bateria" className="form-label">
                Salud de Batería
              </label>
              <input
                id="bateria"
                name="bateria"
                defaultValue={producto.bateria || ""}
                placeholder="Ej: 88%"
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="precioVenta" className="form-label">
                Precio Venta (USD) <span className="req">*</span>
              </label>
              <div className="input-currency-wrapper">
                <span className="currency-prefix">USD $</span>
                <input
                  id="precioVenta"
                  name="precioVenta"
                  type="number"
                  step="0.01"
                  min="0"
                  required
                  defaultValue={producto.precioVenta}
                  className="form-input currency-input"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="precioCosto" className="form-label">
                Precio Costo (USD) <span className="hint">(Privado)</span>
              </label>
              <div className="input-currency-wrapper">
                <span className="currency-prefix">USD $</span>
                <input
                  id="precioCosto"
                  name="precioCosto"
                  type="number"
                  step="0.01"
                  min="0"
                  defaultValue={producto.precioCosto || ""}
                  className="form-input currency-input"
                />
              </div>
            </div>
          </div>

          <div style={{ display: "flex", gap: 12, justifyContent: "flex-end", marginTop: 24 }}>
            <button
              type="button"
              onClick={onClose}
              className="admin-btn-secondary"
              disabled={isPending}
            >
              Cancelar
            </button>
            <button type="submit" className="admin-submit-btn" style={{ width: "auto" }} disabled={isPending}>
              {isPending ? "Guardando..." : "Guardar Cambios"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
