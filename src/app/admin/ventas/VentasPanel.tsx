"use client";

import { useState, useTransition, useActionState, useRef, useEffect } from "react";
import { registrarVenta, eliminarVenta } from "./actions";
import EditVentaModal from "./EditVentaModal";

export type ProductoDisponible = {
  id: string;
  modelo: string;
  stock: number;
  moneda: string;
  categoria: string;
};

export type VentaItem = {
  id: string;
  cantidad: number;
  precioUnitario: number;
  total: number;
  createdAt: Date;
  producto: {
    modelo: string;
    categoria: string;
    moneda?: string;
    precioCosto?: number | null;
    precioVenta?: number;
  };
};

interface VentasPanelProps {
  titulo: string;
  descripcion: string;
  productos: ProductoDisponible[];
  ventas: VentaItem[];
  monedaForzada?: "ARS" | "USD";
}

const OPCIONES_FILTRO_FECHA = [
  { value: "todas", label: "Todas las ventas" },
  { value: "hoy", label: "Hoy" },
  { value: "ayer", label: "Ayer" },
  { value: "semana", label: "Últimos 7 días" },
  { value: "mes", label: "Este mes" },
  { value: "personalizado", label: "Rango personalizado…" },
];

function isSameDay(d1: Date, d2: Date) {
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
}

function isVentaInFilter(
  createdAt: Date | string,
  filtro: string,
  fechaDesde: string,
  fechaHasta: string
): boolean {
  const date = new Date(createdAt);
  if (isNaN(date.getTime())) return false;

  const now = new Date();

  if (filtro === "todas") return true;

  if (filtro === "hoy") {
    return isSameDay(date, now);
  }

  if (filtro === "ayer") {
    const ayer = new Date(now);
    ayer.setDate(now.getDate() - 1);
    return isSameDay(date, ayer);
  }

  if (filtro === "semana") {
    const hace7dias = new Date(now);
    hace7dias.setDate(now.getDate() - 7);
    hace7dias.setHours(0, 0, 0, 0);
    return date >= hace7dias;
  }

  if (filtro === "mes") {
    return date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth();
  }

  if (filtro === "personalizado") {
    let inicioOk = true;
    let finOk = true;

    if (fechaDesde) {
      const d = new Date(`${fechaDesde}T00:00:00`);
      if (!isNaN(d.getTime())) {
        inicioOk = date >= d;
      }
    }

    if (fechaHasta) {
      const h = new Date(`${fechaHasta}T23:59:59`);
      if (!isNaN(h.getTime())) {
        finOk = date <= h;
      }
    }

    return inicioOk && finOk;
  }

  return true;
}

export default function VentasPanel({
  titulo,
  descripcion,
  productos,
  ventas,
  monedaForzada,
}: VentasPanelProps) {
  const [state, formAction, pending] = useActionState(registrarVenta, null);
  const [editingVenta, setEditingVenta] = useState<VentaItem | null>(null);
  const [deletingVenta, setDeletingVenta] = useState<VentaItem | null>(null);
  const [isPending, startTransition] = useTransition();

  // Estado para el dropdown "a mano" de Equipo / Producto
  const [productoId, setProductoId] = useState("");
  const [menuProductoAbierto, setMenuProductoAbierto] = useState(false);
  const menuProductoRef = useRef<HTMLDivElement | null>(null);

  // Estado para el dropdown "a mano" de Filtrar por fecha
  const [menuFechaAbierto, setMenuFechaAbierto] = useState(false);
  const menuFechaRef = useRef<HTMLDivElement | null>(null);

  // Cierra cualquiera de los dos menús si el usuario hace clic afuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuProductoRef.current && !menuProductoRef.current.contains(event.target as Node)) {
        setMenuProductoAbierto(false);
      }
      if (menuFechaRef.current && !menuFechaRef.current.contains(event.target as Node)) {
        setMenuFechaAbierto(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Si la venta se registró con éxito, vaciamos el producto elegido
  useEffect(() => {
    if (state?.ok) setProductoId("");
  }, [state]);

  // Estados para Filtro de Fechas
  const [filtroFecha, setFiltroFecha] = useState<string>("todas");
  const [fechaDesdeInput, setFechaDesdeInput] = useState<string>("");
  const [fechaHastaInput, setFechaHastaInput] = useState<string>("");
  const [fechaDesdeAplicada, setFechaDesdeAplicada] = useState<string>("");
  const [fechaHastaAplicada, setFechaHastaAplicada] = useState<string>("");

  const handleBuscarPersonalizado = () => {
    setFechaDesdeAplicada(fechaDesdeInput);
    setFechaHastaAplicada(fechaHastaInput);
  };

  const handleLimpiarFechas = () => {
    setFechaDesdeInput("");
    setFechaHastaInput("");
    setFechaDesdeAplicada("");
    setFechaHastaAplicada("");
  };

  // Filtrado de ventas según el período seleccionado
  const ventasFiltradas = ventas.filter((v) =>
    isVentaInFilter(v.createdAt, filtroFecha, fechaDesdeAplicada, fechaHastaAplicada)
  );

  // Métricas financieras globales calculadas sobre las ventas filtradas
  const totalVentas = ventasFiltradas.reduce((acc, v) => acc + v.total, 0);

  const totalCostos = ventasFiltradas.reduce((acc, v) => {
    const costoUnitario = v.producto.precioCosto ?? 0;
    return acc + costoUnitario * v.cantidad;
  }, 0);

  const gananciaNeta = totalVentas - totalCostos;

  const handleConfirmDelete = () => {
    if (!deletingVenta) return;
    const targetId = deletingVenta.id;
    startTransition(async () => {
      await eliminarVenta(targetId);
      setDeletingVenta(null);
    });
  };

  const fmtCurrency = (val: number, m: string) => {
    if (m === "ARS") {
      return `ARS $${val.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
    return `USD $${val.toFixed(2)}`;
  };

  return (
    <div style={{ display: "grid", gap: 24 }}>
      <div style={{ marginBottom: 4 }}>
        <h1 style={{ marginBottom: 6 }}>{titulo}</h1>
        <p style={{ color: "var(--text-muted)" }}>{descripcion}</p>
      </div>

      <section className="admin-form-card">
        <div className="form-section-header">
          <span className="section-number">1</span>
          <h3>Registrar nueva venta</h3>
        </div>

        <form action={formAction} className="admin-form">
          <div className="form-grid gap-16">
            <div className="form-group">
              <label htmlFor="productoId" className="form-label">
                Equipo / Producto <span className="req">*</span>
              </label>

              {/* Campo oculto: es lo que realmente viaja en el FormData al Server Action,
                  ya que el div de abajo no es un <select> nativo del navegador */}
              <input type="hidden" name="productoId" value={productoId} />

              <div ref={menuProductoRef} style={{ position: "relative" }}>
                <button
                  type="button"
                  onClick={() => setMenuProductoAbierto((v) => !v)}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 8,
                    padding: "10px 12px",
                    borderRadius: 8,
                    border: menuProductoAbierto ? "1px solid #38bdf8" : "1px solid var(--border)",
                    background: "var(--background)",
                    color: productoId ? "var(--text)" : "var(--text-muted)",
                    cursor: "pointer",
                    fontSize: "0.9rem",
                    textAlign: "left",
                  }}
                >
                  <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {productoId
                      ? (() => {
                          const p = productos.find((prod) => prod.id === productoId);
                          if (!p) return "Seleccioná un producto";
                          const m = monedaForzada || p.moneda || "USD";
                          return `${p.modelo} [${p.categoria}] (${m}) — ${p.stock} disponible(s)`;
                        })()
                      : "Seleccioná un producto"}
                  </span>
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    style={{
                      transform: menuProductoAbierto ? "rotate(180deg)" : "rotate(0deg)",
                      transition: "transform 0.15s ease",
                      flexShrink: 0,
                    }}
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>

                {menuProductoAbierto && (
                  <div
                    style={{
                      position: "absolute",
                      top: "calc(100% + 6px)",
                      left: 0,
                      width: "100%",
                      maxHeight: 280,
                      overflowY: "auto",
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
                    {productos.length === 0 ? (
                      <div style={{ padding: "10px 12px", color: "var(--text-muted)", fontSize: "0.85rem" }}>
                        No hay productos disponibles.
                      </div>
                    ) : (
                      productos.map((producto) => {
                        const m = monedaForzada || producto.moneda || "USD";
                        const activo = producto.id === productoId;
                        return (
                          <button
                            key={producto.id}
                            type="button"
                            onClick={() => {
                              setProductoId(producto.id);
                              setMenuProductoAbierto(false);
                            }}
                            style={{
                              display: "block",
                              width: "100%",
                              textAlign: "left",
                              padding: "9px 12px",
                              border: "none",
                              borderRadius: 8,
                              background: activo ? "rgba(56, 189, 248, 0.15)" : "transparent",
                              color: activo ? "#38bdf8" : "var(--text)",
                              fontSize: "0.85rem",
                              fontWeight: activo ? 600 : 500,
                              cursor: "pointer",
                            }}
                            onMouseEnter={(e) => {
                              if (!activo) e.currentTarget.style.background = "rgba(255,255,255,0.06)";
                            }}
                            onMouseLeave={(e) => {
                              if (!activo) e.currentTarget.style.background = "transparent";
                            }}
                          >
                            {producto.modelo} [{producto.categoria}] ({m}) — {producto.stock} disponible(s)
                          </button>
                        );
                      })
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="cantidad" className="form-label">
                Cantidad <span className="req">*</span>
              </label>
              <input
                id="cantidad"
                name="cantidad"
                type="number"
                min="1"
                step="1"
                defaultValue="1"
                required
                className="form-input"
              />
            </div>
          </div>

          {productos.length === 0 && (
            <p className="form-help" style={{ marginTop: 12 }}>
              No hay productos con stock disponible en esta sección.
            </p>
          )}

          {state?.error && <div className="form-alert error" style={{ marginTop: 16 }}>{state.error}</div>}
          {state?.ok && <div className="form-alert success" style={{ marginTop: 16 }}>Venta registrada con éxito.</div>}

          <div style={{ marginTop: 20 }}>
            <button
              type="submit"
              className="admin-submit-btn"
              disabled={pending || productos.length === 0 || !productoId}
            >
              {pending ? "Registrando..." : "Registrar venta"}
            </button>
          </div>
        </form>
      </section>

      <section>
        {/* Cabecera con selector de filtro por fechas */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12, marginBottom: 16 }}>
          <div className="form-section-header" style={{ marginBottom: 0 }}>
            <span className="section-number">2</span>
            <h3>
              Historial de ventas concretadas ({ventasFiltradas.length}
              {ventasFiltradas.length !== ventas.length ? ` de ${ventas.length}` : ""})
            </h3>
          </div>

          {/* Menú desplegable de Períodos */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            <label style={{ fontSize: "0.85rem", color: "var(--text-muted)", fontWeight: 600, display: "flex", alignItems: "center", gap: 6 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              Filtrar por fecha:
            </label>

            <div ref={menuFechaRef} style={{ position: "relative", minWidth: 190 }}>
              <button
                type="button"
                onClick={() => setMenuFechaAbierto((v) => !v)}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 8,
                  padding: "6px 12px",
                  fontSize: "0.88rem",
                  borderRadius: 8,
                  border: menuFechaAbierto ? "1px solid #38bdf8" : "1px solid var(--border)",
                  background: "var(--background)",
                  color: "var(--text)",
                  cursor: "pointer",
                }}
              >
                <span>{OPCIONES_FILTRO_FECHA.find((o) => o.value === filtroFecha)?.label}</span>
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  style={{
                    transform: menuFechaAbierto ? "rotate(180deg)" : "rotate(0deg)",
                    transition: "transform 0.15s ease",
                    flexShrink: 0,
                  }}
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>

              {menuFechaAbierto && (
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
                  {OPCIONES_FILTRO_FECHA.map((opcion) => {
                    const activa = opcion.value === filtroFecha;
                    return (
                      <button
                        key={opcion.value}
                        type="button"
                        onClick={() => {
                          setFiltroFecha(opcion.value);
                          setMenuFechaAbierto(false);
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
                          whiteSpace: "nowrap",
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

        {/* Controles para Rango de Fechas Personalizado con botón de búsqueda */}
        {filtroFecha === "personalizado" && (
          <div
            style={{
              marginBottom: 16,
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
                type="date"
                value={fechaDesdeInput}
                onChange={(e) => setFechaDesdeInput(e.target.value)}
                className="form-input"
                style={{ padding: "6px 10px", fontSize: "0.85rem", width: "auto" }}
              />
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: "0.85rem", color: "var(--text-muted)", fontWeight: 500 }}>Hasta:</span>
              <input
                type="date"
                value={fechaHastaInput}
                onChange={(e) => setFechaHastaInput(e.target.value)}
                className="form-input"
                style={{ padding: "6px 10px", fontSize: "0.85rem", width: "auto" }}
              />
            </div>

            <button
              type="button"
              onClick={handleBuscarPersonalizado}
              style={{
                background: "#38bdf8",
                border: "none",
                color: "#000000",
                fontWeight: 700,
                fontSize: "0.85rem",
                borderRadius: 8,
                padding: "8px 16px",
                cursor: "pointer",
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

            {(fechaDesdeInput || fechaHastaInput || fechaDesdeAplicada || fechaHastaAplicada) && (
              <button
                type="button"
                onClick={handleLimpiarFechas}
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

        {/* Tarjetas de Métricas Financieras (actualizadas según el filtro) */}
        {ventas.length > 0 && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: 14,
              marginBottom: 20,
            }}
          >
            {/* Total Venta */}
            <div
              style={{
                padding: "18px 20px",
                background: "rgba(56,189,248,0.08)",
                border: "1px solid rgba(56,189,248,0.25)",
                borderRadius: 14,
              }}
            >
              <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 700, letterSpacing: "0.5px" }}>
                Total Ventas
              </div>
              <div style={{ fontSize: "1.4rem", fontWeight: 800, color: "#38bdf8", marginTop: 4 }}>
                {fmtCurrency(totalVentas, monedaForzada || "USD")}
              </div>
            </div>

            {/* Costo Total */}
            <div
              style={{
                padding: "18px 20px",
                background: "rgba(239,68,68,0.08)",
                border: "1px solid rgba(239,68,68,0.25)",
                borderRadius: 14,
              }}
            >
              <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 700, letterSpacing: "0.5px" }}>
                Costo Total
              </div>
              <div style={{ fontSize: "1.4rem", fontWeight: 800, color: "#ef4444", marginTop: 4 }}>
                {fmtCurrency(totalCostos, monedaForzada || "USD")}
              </div>
            </div>

            {/* Ganancia Neta */}
            <div
              style={{
                padding: "18px 20px",
                background: "rgba(34,197,94,0.08)",
                border: "1px solid rgba(34,197,94,0.25)",
                borderRadius: 14,
              }}
            >
              <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 700, letterSpacing: "0.5px" }}>
                Ganancia Neta
              </div>
              <div style={{ fontSize: "1.4rem", fontWeight: 800, color: gananciaNeta >= 0 ? "#4ade80" : "#ef4444", marginTop: 4 }}>
                {fmtCurrency(gananciaNeta, monedaForzada || "USD")}
              </div>
            </div>
          </div>
        )}

        {ventasFiltradas.length === 0 ? (
          <div className="admin-form-card" style={{ color: "var(--text-muted)", textAlign: "center", padding: 32 }}>
            {ventas.length === 0
              ? "Todavía no hay ventas registradas en esta sección."
              : "No hay ventas registradas para el período de fechas seleccionado."}
          </div>
        ) : (
          <div style={{ display: "grid", gap: 14 }}>
            {ventasFiltradas.map((venta) => {
              const moneda = monedaForzada || venta.producto.moneda || "USD";
              const costoUnitario = venta.producto.precioCosto || 0;
              const costoTotal = costoUnitario * venta.cantidad;
              const ganancia = venta.total - costoTotal;
              const tieneCosto = venta.producto.precioCosto !== null && venta.producto.precioCosto !== undefined;

              return (
                <article
                  key={venta.id}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 12,
                    padding: "20px 22px",
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid var(--border)",
                    borderRadius: 14,
                    transition: "border-color 0.15s ease",
                  }}
                >
                  {/* Encabezado de la Venta */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16 }}>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                        <strong style={{ fontSize: "1.1rem" }}>{venta.producto.modelo}</strong>
                        <span
                          style={{
                            fontSize: "0.76rem",
                            fontWeight: 700,
                            padding: "2px 8px",
                            borderRadius: 6,
                            background: "rgba(56,189,248,0.12)",
                            color: "#38bdf8",
                            border: "1px solid rgba(56,189,248,0.25)",
                          }}
                        >
                          {venta.producto.categoria}
                        </span>
                        <span
                          style={{
                            fontSize: "0.76rem",
                            fontWeight: 700,
                            padding: "2px 8px",
                            borderRadius: 6,
                            background: "rgba(255,255,255,0.06)",
                            color: "var(--text-muted)",
                          }}
                        >
                          {venta.cantidad} {venta.cantidad === 1 ? "unidad" : "unidades"}
                        </span>
                      </div>

                      <div style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginTop: 6 }}>
                        Vendido el: {new Date(venta.createdAt).toLocaleString("es-AR", { dateStyle: "medium", timeStyle: "short" })}
                      </div>
                    </div>

                    {/* Acciones de Edición / Eliminación */}
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <button
                        type="button"
                        onClick={() => setEditingVenta(venta)}
                        aria-label="Editar venta"
                        title="Editar venta"
                        style={{
                          background: "rgba(255,255,255,0.06)",
                          border: "1px solid var(--border)",
                          borderRadius: 8,
                          padding: "8px 12px",
                          color: "var(--text)",
                          fontSize: "0.85rem",
                          fontWeight: 500,
                          display: "flex",
                          alignItems: "center",
                          gap: 6,
                          cursor: "pointer",
                          transition: "all 0.15s ease",
                        }}
                      >
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                        Editar
                      </button>

                      <button
                        type="button"
                        onClick={() => setDeletingVenta(venta)}
                        aria-label="Eliminar venta"
                        title="Eliminar venta"
                        style={{
                          background: "rgba(239, 68, 68, 0.1)",
                          border: "1px solid rgba(239, 68, 68, 0.25)",
                          borderRadius: 8,
                          padding: "8px 12px",
                          color: "#ef4444",
                          fontSize: "0.85rem",
                          fontWeight: 600,
                          display: "flex",
                          alignItems: "center",
                          gap: 6,
                          cursor: "pointer",
                          transition: "all 0.15s ease",
                        }}
                      >
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="3 6 5 6 21 6" />
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                        </svg>
                        Eliminar
                      </button>
                    </div>
                  </div>

                  {/* Desglose Financiero Estético */}
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
                      gap: 10,
                      padding: "12px 14px",
                      background: "rgba(0,0,0,0.25)",
                      borderRadius: 10,
                      border: "1px solid rgba(255,255,255,0.05)",
                    }}
                  >
                    <div>
                      <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600 }}>PRECIO UNITARIO</div>
                      <div style={{ fontSize: "0.95rem", fontWeight: 700, marginTop: 2 }}>{fmtCurrency(venta.precioUnitario, moneda)}</div>
                    </div>

                    <div>
                      <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600 }}>TOTAL VENTA</div>
                      <div style={{ fontSize: "0.95rem", fontWeight: 800, color: "#38bdf8", marginTop: 2 }}>{fmtCurrency(venta.total, moneda)}</div>
                    </div>

                    <div>
                      <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600 }}>COSTO TOTAL</div>
                      <div style={{ fontSize: "0.95rem", fontWeight: 700, color: tieneCosto ? "#ef4444" : "var(--text-muted)", marginTop: 2 }}>
                        {tieneCosto ? fmtCurrency(costoTotal, moneda) : "—"}
                      </div>
                    </div>

                    <div>
                      <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600 }}>GANANCIA NETA</div>
                      <div style={{ fontSize: "0.95rem", fontWeight: 800, color: tieneCosto ? (ganancia >= 0 ? "#4ade80" : "#ef4444") : "var(--text-muted)", marginTop: 2 }}>
                        {tieneCosto ? `${ganancia >= 0 ? "+" : ""}${fmtCurrency(ganancia, moneda)}` : "—"}
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      {/* Modal para Editar Venta */}
      {editingVenta && (
        <EditVentaModal
          venta={editingVenta}
          onClose={() => setEditingVenta(null)}
          monedaForzada={monedaForzada}
        />
      )}

      {/* Modal Confirmación de Eliminación */}
      {deletingVenta && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 250,
            background: "rgba(0, 0, 0, 0.75)",
            backdropFilter: "blur(6px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 16,
          }}
          onClick={() => setDeletingVenta(null)}
        >
          <div
            style={{
              width: "100%",
              maxWidth: 440,
              background: "#181a20",
              border: "1px solid var(--border)",
              borderRadius: 16,
              padding: 28,
              boxShadow: "0 20px 50px rgba(0, 0, 0, 0.6)",
              textAlign: "center",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: "50%",
                background: "rgba(239, 68, 68, 0.15)",
                border: "1px solid rgba(239, 68, 68, 0.3)",
                color: "#ef4444",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 16px auto",
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                <line x1="10" y1="11" x2="10" y2="17" />
                <line x1="14" y1="11" x2="14" y2="17" />
              </svg>
            </div>

            <h3 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: 8 }}>
              ¿Eliminar registro de venta?
            </h3>
            <p style={{ color: "var(--text-muted)", fontSize: "0.92rem", lineHeight: 1.5, marginBottom: 24 }}>
              Estás a punto de eliminar la venta de{" "}
              <b style={{ color: "var(--text)" }}>&quot;{deletingVenta.producto.modelo}&quot;</b>.
              <br />
              <span style={{ fontSize: "0.85rem", color: "#38bdf8", marginTop: 6, display: "block" }}>
                ℹ️ La cantidad vendida ({deletingVenta.cantidad} u.) se devolverá al stock del inventario.
              </span>
            </p>

            <div style={{ display: "flex", gap: 12 }}>
              <button
                type="button"
                onClick={() => setDeletingVenta(null)}
                className="admin-btn-secondary"
                style={{ flex: 1, justifyContent: "center" }}
                disabled={isPending}
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={isPending}
                style={{
                  flex: 1,
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "10px 16px",
                  borderRadius: "var(--radius-m)",
                  background: "#dc2626",
                  border: "none",
                  color: "#ffffff",
                  fontWeight: 600,
                  fontSize: "0.9rem",
                  cursor: isPending ? "wait" : "pointer",
                  opacity: isPending ? 0.7 : 1,
                  boxShadow: "0 4px 14px rgba(220, 38, 38, 0.35)",
                  transition: "all 0.15s ease",
                }}
              >
                {isPending ? "Eliminando..." : "Sí, eliminar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}