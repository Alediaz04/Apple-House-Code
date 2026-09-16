"use client";

import { useActionState, useState } from "react";
import { crearProducto, CrearProductoState } from "./actions";
import Link from "next/link";

const CATEGORIAS = [
  { value: "IPHONE", label: "📱 iPhone" },
  { value: "MAC", label: "💻 Mac" },
  { value: "IPAD", label: "✏️ iPad" },
  { value: "ACCESORIOS", label: "🎧 Accesorios" },
  { value: "OTROS", label: "📦 Otros" },
];

const initialState: CrearProductoState = null;

export default function ProductoForm() {
  const [state, formAction, pending] = useActionState(crearProducto, initialState);
  const [estadoSeleccionado, setEstadoSeleccionado] = useState<"NUEVO" | "USADO">("NUEVO");

  return (
    <div className="admin-form-card">
      <form action={formAction} key={state?.ok ? Math.random() : "form"} className="admin-form">
        {/* Sección 1: Información Principal */}
        <div className="form-section">
          <div className="form-section-header">
            <span className="section-number">1</span>
            <h3>Información del Equipo</h3>
          </div>

          <div className="form-grid gap-16">
            <div className="form-group col-span-2">
              <label htmlFor="modelo" className="form-label">
                Modelo del equipo <span className="req">*</span>
              </label>

              <div className="input-wrapper">
                <input
                  id="modelo"
                  name="modelo"
                  required
                  placeholder="Ej: iPhone 15 Pro Max"
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="categoria" className="form-label">
                Categoría <span className="req">*</span>
              </label>

              <div className="select-wrapper">
                <select id="categoria" name="categoria" required defaultValue="IPHONE" className="form-select">
                  {CATEGORIAS.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>
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
          </div>
        </div>

        <div className="form-divider" />

        {/* Sección 2: Especificaciones */}
        <div className="form-section">
          <div className="form-section-header">
            <span className="section-number">2</span>
            <h3>Especificaciones</h3>
          </div>

          <div className="form-grid gap-16">
            <div className="form-group">
              <label htmlFor="color" className="form-label">
                Color
              </label>

              <input
                id="color"
                name="color"
                placeholder="Ej: Natural Titanium, Space Black"
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="memoria" className="form-label">
                Memoria / Almacenamiento
              </label>

              <input
                id="memoria"
                name="memoria"
                placeholder="Ej: 128 GB, 256 GB"
                className="form-input"
              />
            </div>

            <div className="form-group col-span-2">
              <label htmlFor="bateria" className="form-label">
                Salud de Batería {estadoSeleccionado === "USADO" && <span className="hint">(Recomendado para usados)</span>}
              </label>

              <input
                id="bateria"
                name="bateria"
                placeholder={estadoSeleccionado === "NUEVO" ? "100%" : "Ej: 92%"}
                defaultValue={estadoSeleccionado === "NUEVO" ? "100%" : ""}
                className="form-input"
              />
            </div>
          </div>
        </div>

        <div className="form-divider" />

        {/* Sección 3: Precios */}
        <div className="form-section">
          <div className="form-section-header">
            <span className="section-number">3</span>
            <h3>Precios (USD)</h3>
          </div>

          <div className="form-grid gap-16">
            <div className="form-group">
              <label htmlFor="precioVenta" className="form-label">
                Precio de Venta (Público) <span className="req">*</span>
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
                  placeholder="0.00"
                  className="form-input currency-input"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="precioCosto" className="form-label">
                Precio de Costo <span className="hint">(Privado)</span>
              </label>

              <div className="input-currency-wrapper">
                <span className="currency-prefix">USD $</span>
                <input
                  id="precioCosto"
                  name="precioCosto"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  className="form-input currency-input"
                />
              </div>
              <span className="form-help">Solo visible en el panel para control interno.</span>
            </div>
          </div>
        </div>

        {/* Banners de estado */}
        {state?.ok && (
          <div className="form-alert success">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <path d="M22 4L12 14.01l-3-3" />
            </svg>
            <div>
              <strong>¡Equipo guardado con éxito!</strong>
              <p>El producto ya está publicado en la web y visible en el inventario.</p>
              <div className="alert-actions">
                <Link href="/admin/stock" className="alert-link">
                  Ver en Inventario →
                </Link>
              </div>
            </div>
          </div>
        )}

        {state?.error && (
          <div className="form-alert error">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 8v4M12 16h.01" />
            </svg>
            <div>
              <strong>No se pudo guardar el equipo:</strong> {state.error}
            </div>
          </div>
        )}

        {/* Botón Guardar */}
        <div className="form-actions">
          <button type="submit" className="admin-submit-btn" disabled={pending}>
            {pending ? (
              <>
                <span className="spinner" />
                Guardando equipo…
              </>
            ) : (
              <>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                  <polyline points="17 21 17 13 7 13 7 21" />
                  <polyline points="7 3 7 8 15 8" />
                </svg>
                Guardar en Inventario
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}