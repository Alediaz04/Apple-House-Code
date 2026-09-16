"use client";

import { useState, FormEvent } from "react";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // TODO: Conectar con Supabase Auth signInWithPassword({ email, password })
      // Demo validation placeholder for UI test
      if (!email || !password) {
        setError("Por favor, completa todos los campos.");
        setLoading(false);
        return;
      }

      // Por ahora demostramos el espacio de error/procesamiento
      // Al presionar ingresar sin Supabase configurado aún
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        // Descomentar cuando Supabase Auth esté vinculado
        // setError("Email o contraseña incorrectos");
      }, 800);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Ocurrió un error inesperado");
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-wrapper">
      <div className="admin-login-card">
        <div className="admin-login-header">
          <div className="admin-login-logo">
            <span className="admin-logo-dot" />
            <span className="admin-logo-text">Apple House</span>
            <span className="admin-badge">Admin</span>
          </div>
          <h1>Iniciar Sesión</h1>
          <p>Ingresá con tus credenciales de administrador</p>
        </div>

        <form onSubmit={handleSubmit} className="admin-form">
          {error && (
            <div className="form-alert error">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 8v4M12 16h.01" />
              </svg>
              <div>
                <strong>Error al ingresar:</strong>
                <p>{error}</p>
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div className="form-actions" style={{ marginTop: "12px" }}>
            <button type="submit" className="admin-submit-btn" disabled={loading}>
              {loading ? (
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
