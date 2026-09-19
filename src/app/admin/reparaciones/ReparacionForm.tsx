"use client";

import { useActionState, useEffect, useState } from "react";
import { crearReparacion } from "./actions";

export default function ReparacionForm() {
  const [state, action, pending] = useActionState(crearReparacion, null);
  const [formKey, setFormKey] = useState(0);

  const hoyStr = new Date().toISOString().split("T")[0];

  useEffect(() => {
    if (state?.ok) {
      setFormKey((prev) => prev + 1);
    }
  }, [state]);

  return (
    <section className="admin-form-card" style={{ marginBottom: 28 }}>
      <div className="form-section-header">
        <span className="section-number">1</span>
        <h3 style={{ margin: 0, fontSize: "1.15rem", fontWeight: 700 }}>Registrar nueva reparación</h3>
      </div>

      {state?.error && (
        <div className="form-alert error" style={{ marginBottom: 16 }}>
          {state.error}
        </div>
      )}

      {state?.ok && (
        <div className="form-alert success" style={{ marginBottom: 16 }}>
          Reparación registrada con éxito.
        </div>
      )}

      <form key={formKey} action={action} className="admin-form">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 16,
            marginBottom: 16,
          }}
        >
          <div className="form-group">
            <label htmlFor="nombreCliente" className="form-label">
              Nombre del cliente <span className="req">*</span>
            </label>
            <input
              id="nombreCliente"
              name="nombreCliente"
              type="text"
              required
              placeholder="Ej: Juan Pérez"
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="telefono" className="form-label">
              Teléfono <span className="req">*</span>
            </label>
            <input
              id="telefono"
              name="telefono"
              type="tel"
              required
              placeholder="Ej: +54 9 11 1234-5678"
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email (opcional)
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="cliente@ejemplo.com"
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="dispositivo" className="form-label">
              Dispositivo <span className="req">*</span>
            </label>
            <input
              id="dispositivo"
              name="dispositivo"
              type="text"
              required
              placeholder="Ej: iPhone 13 Pro - Cambio de Módulo"
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="fechaIngreso" className="form-label">
              Fecha de ingreso <span className="req">*</span>
            </label>
            <input
              id="fechaIngreso"
              name="fechaIngreso"
              type="date"
              required
              defaultValue={hoyStr}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="cobro" className="form-label">
              Cobro total (AR$)
            </label>
            <input
              id="cobro"
              name="cobro"
              type="number"
              step="any"
              min="0"
              placeholder="0.00"
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="costoRepuestos" className="form-label">
              Costo repuestos (AR$)
            </label>
            <input
              id="costoRepuestos"
              name="costoRepuestos"
              type="number"
              step="any"
              min="0"
              placeholder="0.00"
              className="form-input"
            />
          </div>
        </div>

        <div className="form-group" style={{ marginBottom: 20 }}>
          <label htmlFor="descripcion" className="form-label">
            Descripción / Observaciones
          </label>
          <textarea
            id="descripcion"
            name="descripcion"
            rows={3}
            placeholder="Detalles de la falla, estado del equipo, clave de bloqueo, etc."
            className="form-input"
            style={{ resize: "vertical" }}
          />
        </div>

        <button
          type="submit"
          disabled={pending}
          className="admin-submit-btn"
          style={{
            background: "#38bdf8",
            color: "#000000",
            fontWeight: 700,
            boxShadow: "0 4px 14px rgba(56,189,248,0.25)",
          }}
        >
          {pending ? "Guardando..." : "Guardar reparación"}
        </button>
      </form>
    </section>
  );
}