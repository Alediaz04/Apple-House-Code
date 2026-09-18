"use client";

import { useActionState, useState } from "react";
import { crearProducto, CrearProductoState } from "./actions";
import Link from "next/link";
import { ColorPalettePicker } from "@/components/ColorPalettePicker";

const CATEGORIAS = [
  { value: "IPHONE", label: "📱 iPhone" },
  { value: "MAC", label: "💻 Mac" },
  { value: "IPAD", label: "✏️ iPad" },
  { value: "ACCESORIOS", label: "🎧 Accesorios" },
  { value: "PLAY", label: "🎮 Play" },
  { value: "FUNDAS", label: "📱 Fundas" },
  { value: "OTROS", label: "📦 Otros" },
];

const initialState: CrearProductoState = null;

export default function ProductoForm() {
  const [state, formAction, pending] = useActionState(crearProducto, initialState);
  const [estadoSeleccionado, setEstadoSeleccionado] = useState<"NUEVO" | "USADO">("NUEVO");

  // Estados para manejar vista previa de la foto y la moneda seleccionada
  const [preview, setPreview] = useState<string | null>(null);
  const [moneda, setMoneda] = useState("USD"); // <- Estado para la moneda dinámica

  // NUEVO: Función para generar la URL temporal de la foto
  function handleFotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  }

  return (
    <div className="admin-form-card">
      <form action={formAction} className="admin-form">
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

            {/* NUEVO: Campo de cantidad de Stock */}
            <div className="form-group">
              <label htmlFor="stock" className="form-label">
                Cantidad en stock <span className="req">*</span>
              </label>
              <div className="input-wrapper">
                <input
                  id="stock"
                  name="stock"
                  type="number"
                  min="1"
                  step="1"
                  defaultValue="1"
                  required
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-group col-span-2">
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
            <div className="form-group col-span-2">
              <label className="form-label">
                Color
              </label>

              <ColorPalettePicker resetSignal={state?.ok} />
            </div>

            <div className="form-group">
              <label htmlFor="memoriaCantidad" className="form-label">
                Memoria / Almacenamiento
              </label>

              <div style={{ display: "flex", gap: "8px" }}>
                <div className="input-wrapper" style={{ flex: 1 }}>
                  <input
                    id="memoriaCantidad"
                    name="memoriaCantidad"
                    type="number"
                    min="1"
                    step="any"
                    placeholder="Ej: 128, 256, 512, 1"
                    className="form-input"
                  />
                </div>
                <div className="select-wrapper" style={{ width: "95px" }}>
                  <select id="memoriaUnidad" name="memoriaUnidad" defaultValue="GB" className="form-select">
                    <option value="GB">GB</option>
                    <option value="TB">TB</option>
                    <option value="MB">MB</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="form-group col-span-2">
              <label htmlFor="bateria" className="form-label">
                Salud de Batería {estadoSeleccionado === "USADO" && <span className="hint">(Recomendado para usados)</span>}
              </label>

              <div className="input-wrapper">
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
        </div>

        <div className="form-divider" />

        {/* Sección 3: Precios y Moneda */}
        <div className="form-section">
          <div className="form-section-header">
            <span className="section-number">3</span>
            {/* Título dinámico que cambia según la moneda seleccionada */}
            <h3>Precios ({moneda})</h3>
          </div>

          <div className="form-grid gap-16">
            {/* Selector de Moneda conectado al estado */}
            <div className="form-group col-span-2">
              <label htmlFor="moneda" className="form-label">
                Moneda <span className="req">*</span>
              </label>
              <div className="select-wrapper">
                <select 
                  id="moneda" 
                  name="moneda" 
                  required 
                  value={moneda}
                  onChange={(e) => setMoneda(e.target.value)}
                  className="form-select"
                >
                  <option value="USD">USD (Dólares)</option>
                  <option value="ARS">ARS (Pesos)</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="precioVenta" className="form-label">
                Precio de Venta (Público) <span className="req">*</span>
              </label>

              <div className="input-currency-wrapper">
                {/* Símbolo dinámico para el precio de venta */}
                <span className="currency-prefix">{moneda} $</span>
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
                {/* Símbolo dinámico para el precio de costo */}
                <span className="currency-prefix">{moneda} $</span>
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

        <div className="form-divider" />

        {/* NUEVO: Sección 4: Agregar fotos */}
        <div className="form-section">
          <div className="form-section-header">
            <span className="section-number">4</span>
            <h3>Fotos del producto</h3>
          </div>

          <div className="form-grid gap-16">
            <div className="form-group col-span-2">
              <label htmlFor="foto" className="form-label">
                Foto principal
              </label>
              <div className="input-wrapper" style={{ marginBottom: "12px" }}>
                <input
                  id="foto"
                  type="file"
                  name="foto"
                  accept="image/*"
                  onChange={handleFotoChange}
                  className="form-input"
                  style={{ paddingTop: "8px", paddingBottom: "8px", cursor: "pointer" }}
                />
              </div>
              
              {/* Vista previa de la imagen */}
              {preview && (
                <div style={{ marginTop: "12px", border: "1px solid #eaeaea", padding: "8px", borderRadius: "16px", display: "inline-block" }}>
                  <img
                    src={preview}
                    alt="Vista previa"
                    style={{ width: 160, height: 160, objectFit: "cover", borderRadius: 12 }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Banners de estado */}
        {state?.ok && (
          <div className="form-alert success" style={{ marginTop: "24px" }}>
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
          <div className="form-alert error" style={{ marginTop: "24px" }}>
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
        <div className="form-actions" style={{ marginTop: "24px" }}>
          <button type="submit" className="admin-submit-btn" disabled={pending}>
            {pending ? (
              <>
                <span className="spinner" />
                Guardando equipo…
              </>
            ) : (
              <>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: "8px" }}>
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