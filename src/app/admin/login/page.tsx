"use client";

import { useActionState } from "react";
import Image from "next/image";
import { iniciarSesion } from "./actions";

export default function AdminLoginPage() {
  // Conectamos el formulario con la Server Action y obtenemos su estado.
  const [state, formAction, pending] = useActionState(iniciarSesion, null);

  return (
    <div className="admin-login-wrapper">
      <div className="admin-login-card">
        <div className="admin-login-header">
          <div className="admin-login-logo">
            <Image src="/logo.png" alt="Apple House" width={32} height={32} style={{ borderRadius: "50%", objectFit: "cover" }} unoptimized />
            <span className="admin-logo-text">Apple House</span>
            <span className="admin-badge">Admin</span>
          </div>
          <h1>Iniciar Sesión</h1>
          <p>Ingresá con tus credenciales de administrador</p>
        </div>

        <form action={formAction} className="admin-form">
          {state?.error && (
            <div className="form-alert error">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 8v4M12 16h.01" />
              </svg>
              <div>
                <strong>Error al ingresar:</strong>
                <p>{state.error}</p>
              </div>
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Correo electrónico <span className="req">*</span>
            </label>
            <div className="input-wrapper">
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="admin@applehouse.com"
                className="form-input"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Contraseña <span className="req">*</span>
            </label>
            <div className="input-wrapper">
              <input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="current-password"
                placeholder="••••••••"
                className="form-input"
              />
            </div>
          </div>

          <div className="form-actions" style={{ marginTop: "12px" }}>
            <button type="submit" className="admin-submit-btn" disabled={pending}>
              {pending ? (
                <>
                  <span className="spinner" />
                  Ingresando…
                </>
              ) : (
                <>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                    <polyline points="10 17 15 12 10 7" />
                    <line x1="15" y1="12" x2="3" y2="12" />
                  </svg>
                  Ingresar
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
