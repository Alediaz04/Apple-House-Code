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
    if (rango === "personalizado") {
      return;
    }

    const params = new URLSearchParams(searchParams.toString());

    params.set("rango", rango);
    params.delete("desde");
    params.delete("hasta");

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

  return (
    <div style={{ marginBottom: 28 }}>
      <label
        htmlFor="rango-reparaciones"
        style={{
          display: "block",
          marginBottom: 8,
          fontWeight: 600,
        }}
      >
        {"Per\u00edodo"}
      </label>

      <select
        id="rango-reparaciones"
        value={rangoActual}
        onChange={(e) => cambiarRango(e.target.value)}
        style={{
          padding: "10px 12px",
          borderRadius: 10,
          border: "1px solid var(--border)",
          background: "var(--background)",
          color: "var(--text)",
          minWidth: 210,
          colorScheme: "dark",
        }}
      >
        <option
          value="todos"
          style={{ backgroundColor: "#15171a", color: "#ffffff" }}
        >
          Todas las reparaciones
        </option>

        <option
          value="hoy"
          style={{ backgroundColor: "#15171a", color: "#ffffff" }}
        >
          Hoy
        </option>

        <option
          value="semana"
          style={{ backgroundColor: "#15171a", color: "#ffffff" }}
        >
          Esta semana
        </option>

        <option
          value="mes"
          style={{ backgroundColor: "#15171a", color: "#ffffff" }}
        >
          Este mes
        </option>

        <option
          value="personalizado"
          style={{ backgroundColor: "#15171a", color: "#ffffff" }}
        >
          Rango personalizado
        </option>
      </select>

      {rangoActual === "personalizado" && (
        <div
          style={{
            display: "flex",
            gap: 16,
            marginTop: 16,
            alignItems: "flex-end",
            flexWrap: "wrap",
          }}
        >
          <div>
            <label
              htmlFor="fecha-desde"
              style={{
                display: "block",
                marginBottom: 6,
                fontSize: 14,
              }}
            >
              Desde
            </label>

            <input
              id="fecha-desde"
              type="date"
              value={desde}
              onChange={(e) => setDesde(e.target.value)}
              style={{
                padding: "10px 12px",
                borderRadius: 10,
                border: "1px solid var(--border)",
                background: "var(--background)",
                color: "var(--text)",
                colorScheme: "dark",
              }}
            />
          </div>

          <div>
            <label
              htmlFor="fecha-hasta"
              style={{
                display: "block",
                marginBottom: 6,
                fontSize: 14,
              }}
            >
              Hasta
            </label>

            <input
              id="fecha-hasta"
              type="date"
              value={hasta}
              onChange={(e) => setHasta(e.target.value)}
              style={{
                padding: "10px 12px",
                borderRadius: 10,
                border: "1px solid var(--border)",
                background: "var(--background)",
                color: "var(--text)",
                colorScheme: "dark",
              }}
            />
          </div>

       <button
  type="button"
  onClick={aplicarRango}
  disabled={!desde || !hasta}
  style={{
    height: 42,
    padding: "0 20px",
    borderRadius: 10,
    border: "1px solid #3b82f6",
    background: "#2563eb",
    color: "#ffffff",
    fontWeight: 600,
    cursor: !desde || !hasta ? "not-allowed" : "pointer",
    opacity: !desde || !hasta ? 0.5 : 1,
    whiteSpace: "nowrap",
    transition: "transform 0.15s ease, box-shadow 0.15s ease, background 0.15s ease",
    boxShadow: "0 4px 12px rgba(37, 99, 235, 0.18)",
  }}
  onMouseEnter={(e) => {
    if (!desde || !hasta) return;

    e.currentTarget.style.background = "#3b82f6";
    e.currentTarget.style.transform = "translateY(-1px)";
    e.currentTarget.style.boxShadow =
      "0 6px 16px rgba(37, 99, 235, 0.3)";
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.background = "#2563eb";
    e.currentTarget.style.transform = "translateY(0)";
    e.currentTarget.style.boxShadow =
      "0 4px 12px rgba(37, 99, 235, 0.18)";
  }}
  onMouseDown={(e) => {
    if (!desde || !hasta) return;

    e.currentTarget.style.transform = "translateY(1px)";
    e.currentTarget.style.boxShadow =
      "0 2px 6px rgba(37, 99, 235, 0.2)";
  }}
  onMouseUp={(e) => {
    if (!desde || !hasta) return;

    e.currentTarget.style.transform = "translateY(-1px)";
    e.currentTarget.style.boxShadow =
      "0 6px 16px rgba(37, 99, 235, 0.3)";
  }}
>
  Aplicar rango
</button>
        </div>
      )}
    </div>
  );
}