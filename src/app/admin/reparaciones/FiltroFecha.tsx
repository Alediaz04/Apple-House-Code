"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const OPCIONES_PERIODO = [
  { value: "todos", label: "Todas las reparaciones" },
  { value: "hoy", label: "Hoy" },
  { value: "semana", label: "Esta semana" },
  { value: "mes", label: "Este mes" },
  { value: "personalizado", label: "Rango personalizado…" },
];

export default function FiltroFecha() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const rangoActual = searchParams.get("rango") ?? "todos";

  const [desde, setDesde] = useState(searchParams.get("desde") ?? "");
  const [hasta, setHasta] = useState(searchParams.get("hasta") ?? "");

  // Estado y referencia para el menú desplegable "a mano"
  // (reemplaza al <select> nativo, cuya lista de opciones no se puede
  // customizar del todo con CSS)
  const [menuAbierto, setMenuAbierto] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuAbierto(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function cambiarRango(rango: string) {
    const params = new URLSearchParams(searchParams.toString());

    params.set("rango", rango);
    if (rango !== "personalizado") {
      params.delete("desde");
      params.delete("hasta");
    }

    router.push(`/admin/reparaciones?${params.toString()}`);
  }

  function aplicarRango() {
    if (!desde || !hasta) {
      return;
    }

    const params = new URLSearchParams(searchParams.toString());

    params.set("rango", "personalizado");
    params.set("desde", desde);
    params.set("hasta", hasta);

    router.push(`/admin/reparaciones?${params.toString()}`);
  }

  function limpiarRango() {
    setDesde("");
    setHasta("");
    const params = new URLSearchParams(searchParams.toString());
    params.set("rango", "todos");
    params.delete("desde");
    params.delete("hasta");
    router.push(`/admin/reparaciones?${params.toString()}`);
  }

  const opcionActual =
    OPCIONES_PERIODO.find((o) => o.value === rangoActual) ?? OPCIONES_PERIODO[0];

  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          <label style={{ fontSize: "0.85rem", color: "var(--text-muted)", fontWeight: 600, display: "flex", alignItems: "center", gap: 6 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            Filtrar por período:
          </label>

          {/* Menú desplegable "a mano", en vez del <select> nativo */}
          <div ref={menuRef} style={{ position: "relative", minWidth: 200 }}>
            <button
              type="button"
              onClick={() => setMenuAbierto((v) => !v)}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 8,
                padding: "6px 12px",
                fontSize: "0.88rem",
                borderRadius: 8,
                border: menuAbierto ? "1px solid #38bdf8" : "1px solid var(--border)",
                background: "var(--background)",
                color: "var(--text)",
                cursor: "pointer",
              }}
            >
              <span>{opcionActual.label}</span>
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                style={{
                  transform: menuAbierto ? "rotate(180deg)" : "rotate(0deg)",
                  transition: "transform 0.15s ease",
                  flexShrink: 0,
                }}
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>

            {menuAbierto && (
              <div
                style={{
                  position: "absolute",
                  top: "calc(100% + 6px)",
                  left: 0,
                  minWidth: "100%",
                  background: "#15171a",
                  border: "1px solid var(--border)",
                  borderRadius: 10,
                  boxShadow: "0 14px 35px rgba(0,0,0,0.6)",
                  padding: 6,
                  zIndex: 100,
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                }}
              >
                {OPCIONES_PERIODO.map((opcion) => {
                  const activa = opcion.value === rangoActual;
                  return (
                    <button
                      key={opcion.value}
                      type="button"
                      onClick={() => {
                        setMenuAbierto(false);
                        cambiarRango(opcion.value);
                      }}
                      style={{
                        display: "block",
                        width: "100%",
                        textAlign: "left",
                        padding: "8px 12px",
                        border: "none",
                        borderRadius: 8,
                        background: activa ? "rgba(56, 189, 248, 0.15)" : "transparent",
                        color: activa ? "#38bdf8" : "var(--text)",
                        fontSize: "0.85rem",
                        fontWeight: activa ? 600 : 500,
                        cursor: "pointer",
                      }}
                      onMouseEnter={(e) => {
                        if (!activa) e.currentTarget.style.background = "rgba(255,255,255,0.06)";
                      }}
                      onMouseLeave={(e) => {
                        if (!activa) e.currentTarget.style.background = "transparent";
                      }}
                    >
                      {opcion.label}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {rangoActual === "personalizado" && (
        <div
          style={{
            marginTop: 14,
            padding: "14px 18px",
            background: "rgba(255,255,255,0.03)",
            border: "1px solid var(--border)",
            borderRadius: 12,
            display: "flex",
            alignItems: "center",
            gap: 16,
            flexWrap: "wrap",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: "0.85rem", color: "var(--text-muted)", fontWeight: 500 }}>Desde:</span>
            <input
              id="fecha-desde"
              type="date"
              value={desde}
              onChange={(e) => setDesde(e.target.value)}
              className="form-input"
              style={{ padding: "6px 10px", fontSize: "0.85rem", width: "auto" }}
            />
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: "0.85rem", color: "var(--text-muted)", fontWeight: 500 }}>Hasta:</span>
            <input
              id="fecha-hasta"
              type="date"
              value={hasta}
              onChange={(e) => setHasta(e.target.value)}
              className="form-input"
              style={{ padding: "6px 10px", fontSize: "0.85rem", width: "auto" }}
            />
          </div>

          <button
            type="button"
            onClick={aplicarRango}
            disabled={!desde || !hasta}
            style={{
              background: "#38bdf8",
              border: "none",
              color: "#000000",
              fontWeight: 700,
              fontSize: "0.85rem",
              borderRadius: 8,
              padding: "8px 16px",
              cursor: !desde || !hasta ? "not-allowed" : "pointer",
              opacity: !desde || !hasta ? 0.5 : 1,
              display: "flex",
              alignItems: "center",
              gap: 6,
              boxShadow: "0 4px 12px rgba(56,189,248,0.25)",
              transition: "all 0.15s ease",
            }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            Realizar búsqueda
          </button>

          {(desde || hasta) && (
            <button
              type="button"
              onClick={limpiarRango}
              style={{
                background: "rgba(239, 68, 68, 0.12)",
                border: "1px solid rgba(239, 68, 68, 0.25)",
                borderRadius: 6,
                padding: "6px 12px",
                color: "#ef4444",
                fontSize: "0.82rem",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Limpiar rango
            </button>
          )}
        </div>
      )}
    </div>
  );
}