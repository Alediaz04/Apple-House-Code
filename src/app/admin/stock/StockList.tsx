"use client";

import { useState, useEffect, useRef, useTransition, useMemo } from "react";
import EditModal from "./EditModal";
import { eliminarProducto, cambiarEstadoVendido } from "./actions";
import { ColorDisplay } from "@/components/ColorPalettePicker";

interface Producto {
  id: string;
  modelo: string;
  categoria: string;
  estado: string;
  color: string | null;
  memoria: string | null;
  bateria: string | null;
  precioVenta: number;
  precioCosto: number | null;
  stock: number;
  visible: boolean;
}

const CATEGORIAS: { key: string; label: string }[] = [
  { key: "IPHONE", label: "iPhone" },
  { key: "MAC", label: "Mac" },
  { key: "IPAD", label: "iPad" },
  { key: "ACCESORIOS", label: "Accesorios" },
  { key: "OTROS", label: "Otros" },
];

function estaVendido(p: Producto) {
  return p.stock === 0 || !p.visible;
}

export default function StockList({ productos }: { productos: Producto[] }) {
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [editingProduct, setEditingProduct] = useState<Producto | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<Producto | null>(null);
  const [isPending, startTransition] = useTransition();
  const [search, setSearch] = useState("");
  const [selectedCategoria, setSelectedCategoria] = useState<string | null>(null);

  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenMenuId(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Cuánto queda disponible por categoría (lo vendido no suma)
  const totalesPorCategoria = useMemo(() => {
    const map: Record<string, number> = {};
    for (const cat of CATEGORIAS) map[cat.key] = 0;
    for (const p of productos) {
      if (!estaVendido(p) && map[p.categoria] !== undefined) {
        map[p.categoria] += 1;
      }
    }
    return map;
  }, [productos]);

  const productosFiltrados = useMemo(() => {
    return productos.filter((p) => {
      const coincideBusqueda = p.modelo.toLowerCase().includes(search.trim().toLowerCase());
      const coincideCategoria = !selectedCategoria || p.categoria === selectedCategoria;
      return coincideBusqueda && coincideCategoria;
    });
  }, [productos, search, selectedCategoria]);

  const handleToggleVendido = (p: Producto) => {
    const vendidoActual = estaVendido(p);
    setOpenMenuId(null);
    startTransition(async () => {
      await cambiarEstadoVendido(p.id, !vendidoActual);
    });
  };

  const handleConfirmDelete = () => {
    if (!deletingProduct) return;
    const targetId = deletingProduct.id;
    startTransition(async () => {
      await eliminarProducto(targetId);
      setDeletingProduct(null);
    });
  };

  if (productos.length === 0) {
    return (
      <div style={{ padding: 40, background: "rgba(255,255,255,0.03)", border: "1px solid var(--border)", borderRadius: 12, textAlign: "center", color: "var(--text-muted)" }}>
        No hay productos guardados en la base de datos todavía.
      </div>
    );
  }

  return (
    <>
      {/* Buscador */}
      <div style={{ marginBottom: 20 }}>
        <div className="search-wrap" style={{ flex: "none", width: "100%", maxWidth: 340 }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="7" />
            <path d="M21 21l-4.3-4.3" />
          </svg>
          <input
            type="text"
            placeholder="Buscar por modelo..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Tarjetas de categoría con total */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
          gap: 12,
          marginBottom: 28,
        }}
      >
        {CATEGORIAS.map((cat) => {
          const activa = selectedCategoria === cat.key;
          return (
            <button
              key={cat.key}
              type="button"
              onClick={() => setSelectedCategoria(activa ? null : cat.key)}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 6,
                padding: "16px 18px",
                borderRadius: 12,
                border: activa ? "1px solid var(--accent-strong)" : "1px solid var(--border)",
                background: activa ? "rgba(106,166,255,0.12)" : "rgba(255,255,255,0.03)",
                color: "var(--text)",
                textAlign: "left",
                cursor: "pointer",
                transition: "all 0.15s ease",
              }}
            >
              <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>{cat.label}</span>
              <span style={{ fontSize: "1.6rem", fontWeight: 700 }}>{totalesPorCategoria[cat.key]}</span>
            </button>
          );
        })}
      </div>

      {productosFiltrados.length === 0 ? (
        <div style={{ padding: 40, background: "rgba(255,255,255,0.03)", border: "1px solid var(--border)", borderRadius: 12, textAlign: "center", color: "var(--text-muted)" }}>
          No se encontraron productos con ese filtro.
        </div>
      ) : (
        <div style={{ display: "grid", gap: 14 }}>
          {productosFiltrados.map((p) => {
            const vendida = estaVendido(p);
            const isMenuOpen = openMenuId === p.id;

            return (
              <div
                key={p.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "16px 20px",
                  background: vendida ? "rgba(255,255,255,0.02)" : "rgba(255,255,255,0.03)",
                  borderRadius: 12,
                  border: vendida ? "1px solid rgba(239,68,68,0.2)" : "1px solid rgba(255,255,255,0.08)",
                  position: "relative",
                  zIndex: isMenuOpen ? 50 : 1,
                  transition: "background 0.15s ease, border-color 0.15s ease",
                }}
              >
                <div style={{ flex: 1, minWidth: 0, paddingRight: 16, opacity: vendida ? 0.75 : 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                    <span style={{ fontWeight: 600, fontSize: "1.1rem" }}>{p.modelo}</span>

                    <span
                      style={{
                        fontSize: "0.78rem",
                        fontWeight: 600,
                        padding: "2px 8px",
                        borderRadius: 6,
                        background: p.estado === "NUEVO" ? "rgba(34, 197, 94, 0.15)" : "rgba(234, 179, 8, 0.15)",
                        color: p.estado === "NUEVO" ? "#4ade80" : "#facc15",
                        border: p.estado === "NUEVO" ? "1px solid rgba(34, 197, 94, 0.3)" : "1px solid rgba(234, 179, 8, 0.3)",
                      }}
                    >
                      {p.estado}
                    </span>

                    {vendida && (
                      <span
                        style={{
                          fontSize: "0.78rem",
                          fontWeight: 700,
                          padding: "2px 8px",
                          borderRadius: 6,
                          background: "rgba(239, 68, 68, 0.15)",
                          color: "#ef4444",
                          border: "1px solid rgba(239, 68, 68, 0.3)",
                        }}
                      >
                        VENDIDO
                      </span>
                    )}
                  </div>

                  <div style={{ fontSize: "0.88rem", color: "var(--text-muted)", marginTop: 6, display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
                    <span>Cat: <b>{p.categoria}</b></span>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                      Color: <ColorDisplay colorString={p.color} showName={true} size="sm" />
                    </span>
                    <span>Memoria: <b>{p.memoria || "—"}</b></span>
                    <span>Batería: <b>{p.bateria || "—"}</b></span>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontWeight: 700, fontSize: "1.2rem", color: "#38bdf8" }}>
                      USD {p.precioVenta}
                    </div>
                    {p.precioCosto && (
                      <div style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
                        Costo: USD {p.precioCosto}
                      </div>
                    )}
                  </div>

                  <div style={{ position: "relative" }} ref={isMenuOpen ? menuRef : null}>
                    <button
                      type="button"
                      onClick={() => setOpenMenuId(isMenuOpen ? null : p.id)}
                      aria-label="Opciones de producto"
                      style={{
                        background: isMenuOpen ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.05)",
                        border: "1px solid var(--border)",
                        borderRadius: 8,
                        width: 36,
                        height: 36,
                        color: "var(--text)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        transition: "all 0.15s ease",
                      }}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                        <circle cx="12" cy="5" r="2" />
                        <circle cx="12" cy="12" r="2" />
                        <circle cx="12" cy="19" r="2" />
                      </svg>
                    </button>

                    {isMenuOpen && (
                      <div
                        style={{
                          position: "absolute",
                          right: 0,
                          top: "calc(100% + 6px)",
                          minWidth: 200,
                          background: "#181a20",
                          border: "1px solid var(--border)",
                          borderRadius: 12,
                          boxShadow: "0 14px 35px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(255, 255, 255, 0.05)",
                          padding: 6,
                          zIndex: 100,
                          display: "flex",
                          flexDirection: "column",
                          gap: 2,
                        }}
                      >
                        <button
                          type="button"
                          onClick={() => {
                            setOpenMenuId(null);
                            setEditingProduct(p);
                          }}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 10,
                            width: "100%",
                            padding: "10px 14px",
                            border: "none",
                            background: "transparent",
                            borderRadius: 8,
                            color: "var(--text)",
                            fontSize: "0.88rem",
                            fontWeight: 500,
                            cursor: "pointer",
                            textAlign: "left",
                            whiteSpace: "nowrap",
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.07)")}
                          onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                        >
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                          </svg>
                          Editar producto
                        </button>

                        <button
                          type="button"
                          onClick={() => handleToggleVendido(p)}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 10,
                            width: "100%",
                            padding: "10px 14px",
                            border: "none",
                            background: "transparent",
                            borderRadius: 8,
                            color: "var(--text)",
                            fontSize: "0.88rem",
                            fontWeight: 500,
                            cursor: "pointer",
                            textAlign: "left",
                            whiteSpace: "nowrap",
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.07)")}
                          onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                        >
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            {vendida ? (
                              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                            ) : (
                              <path d="M9 11l3 3L22 4" />
                            )}
                          </svg>
                          {vendida ? "Marcar como disponible" : "Marcar como vendido"}
                        </button>

                        <div style={{ height: 1, background: "var(--border)", margin: "4px 0" }} />

                        <button
                          type="button"
                          onClick={() => {
                            setOpenMenuId(null);
                            setDeletingProduct(p);
                          }}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 10,
                            width: "100%",
                            padding: "10px 14px",
                            border: "none",
                            background: "transparent",
                            borderRadius: 8,
                            color: "#ef4444",
                            fontSize: "0.88rem",
                            fontWeight: 600,
                            cursor: "pointer",
                            textAlign: "left",
                            whiteSpace: "nowrap",
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(239, 68, 68, 0.12)")}
                          onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                        >
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2">
                            <polyline points="3 6 5 6 21 6" />
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                          </svg>
                          Eliminar producto
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {editingProduct && (
        <EditModal producto={editingProduct} onClose={() => setEditingProduct(null)} />
      )}

      {deletingProduct && (
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
          onClick={() => setDeletingProduct(null)}
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
              ¿Eliminar producto?
            </h3>
            <p style={{ color: "var(--text-muted)", fontSize: "0.92rem", lineHeight: 1.5, marginBottom: 24 }}>
              Estás a punto de eliminar el equipo <b style={{ color: "var(--text)" }}>"{deletingProduct.modelo}"</b>. Esta acción no se puede deshacer.
            </p>

            <div style={{ display: "flex", gap: 12 }}>
              <button
                type="button"
                onClick={() => setDeletingProduct(null)}
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
    </>
  );
}