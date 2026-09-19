"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function FiltroFecha() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const rangoActual = searchParams.get("rango") ?? "todos";

  const [desde, setDesde] = useState(searchParams.get("desde") ?? "");
  const [hasta, setHasta] = useState(searchParams.get("hasta") ?? "");

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

          <select
            id="rango-reparaciones"
            value={rangoActual}
            onChange={(e) => cambiarRango(e.target.value)}
            className="form-select"
            style={{
              padding: "6px 12px",
              fontSize: "0.88rem",
              borderRadius: 8,
              cursor: "pointer",
              width: "auto",
              minWidth: 200,
            }}
          >
            <option value="todos">Todas las reparaciones</option>
            <option value="hoy">Hoy</option>
            <option value="semana">Esta semana</option>
            <option value="mes">Este mes</option>
            <option value="personalizado">Rango personalizado…</option>
          </select>
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
