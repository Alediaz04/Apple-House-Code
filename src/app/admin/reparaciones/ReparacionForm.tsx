"use client";

import { useActionState } from "react";
import { crearReparacion, CrearReparacionState } from "./actions";

const initialState: CrearReparacionState = null;

export default function ReparacionForm() {
  const [state, formAction, pending] = useActionState(
    crearReparacion,
    initialState
  );

  return (
    <div className="admin-form-card">
      <form action={formAction} className="admin-form">
        <div className="form-section">
          <div className="form-section-header">
            <span className="section-number">1</span>
            <h3>Datos del Cliente</h3>
          </div>

          <div className="form-grid gap-16">
            <div className="form-group">
              <label htmlFor="nombreCliente" className="form-label">
                Nombre del cliente <span className="req">*</span>
              </label>
              <input
                id="nombreCliente"
                name="nombreCliente"
                required
                placeholder="Ej: Juan Perez"
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="telefono" className="form-label">
                Telefono <span className="req">*</span>
              </label>
              <input
                id="telefono"
                name="telefono"
                type="tel"
                required
                placeholder="Ej: 261 555 1234"
                className="form-input"
              />
            </div>

            <div className="form-group col-span-2">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="Ej: cliente@email.com"
                className="form-input"
              />
            </div>
          </div>
        </div>

        <div className="form-divider" />

        <div className="form-section">
          <div className="form-section-header">
            <span className="section-number">2</span>
            <h3>Informacion de la Reparacion</h3>
          </div>

          <div className="form-grid gap-16">
            <div className="form-group col-span-2">
              <label htmlFor="dispositivo" className="form-label">
                Dispositivo <span className="req">*</span>
              </label>
              <input
                id="dispositivo"
                name="dispositivo"
                required
                placeholder="Ej: iPhone 15 Pro Max"
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
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="cobro" className="form-label">
                Cobro
              </label>
              <div className="input-currency-wrapper">
                <span className="currency-prefix">USD $</span>
                <input
                  id="cobro"
                  name="cobro"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  className="form-input currency-input"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="costoRepuestos" className="form-label">
                Costo de repuestos
              </label>
              <div className="input-currency-wrapper">
                <span className="currency-prefix">USD $</span>
                <input
                  id="costoRepuestos"
                  name="costoRepuestos"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  className="form-input currency-input"
                />
              </div>
            </div>

            <div className="form-group col-span-2">
              <label htmlFor="descripcion" className="form-label">
                Descripcion
              </label>
              <textarea
                id="descripcion"
                name="descripcion"
                rows={4}
                placeholder="Detalle de la falla, trabajo realizado, repuestos utilizados, etc."
                className="form-input"
              />
            </div>
          </div>
        </div>

        {state?.ok && (
          <div className="form-alert success">
            <strong>Reparacion guardada con exito!</strong>
            <p>La reparacion fue registrada correctamente.</p>
          </div>
        )}

        {state?.error && (
          <div className="form-alert error">
            <strong>No se pudo guardar la reparacion:</strong>{" "}
            {state.error}
          </div>
        )}

        <div className="form-actions">
          <button
            type="submit"
            className="admin-submit-btn"
            disabled={pending}
          >
            {pending ? "Guardando reparacion..." : "Guardar reparacion"}
          </button>
        </div>
      </form>
    </div>
  );
}
