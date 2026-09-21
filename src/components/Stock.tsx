"use client";

import { useMemo, useState } from "react";
import { productos, CAT_LABEL, Categoria, Estado, Producto, waLink, shouldShowBateria } from "@/lib/products";
import { ColorDisplay, parseColorString } from "@/components/ColorPalettePicker";

const CAT_ICONS: Record<Categoria, React.ReactNode> = {
  iphone: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="6" y="2" width="12" height="20" rx="3" /><path d="M11 18h2" />
    </svg>
  ),
  mac: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="3" y="4" width="18" height="12" rx="1.5" /><path d="M8 20h8M12 16v4" />
    </svg>
  ),
  ipad: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="4" y="2.5" width="16" height="19" rx="2.5" /><path d="M12 18.5h.01" />
    </svg>
  ),
  accesorios: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M4 20l3.5-1 10-10-2.5-2.5-10 10L4 20z" /><path d="M14 4l2.5 2.5" />
    </svg>
  ),
  play: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="4" y="5" width="16" height="14" rx="2" /><path d="M8 12h4M10 10v4M16 11h.01M18 13h.01" />
    </svg>
  ),
  fundas: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="6" y="2" width="12" height="20" rx="3" /><path d="M9 5h6" />
    </svg>
  ),
  otros: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M21 8l-9-5-9 5 9 5 9-5z" /><path d="M3 8v8l9 5 9-5V8" /><path d="M12 13v8" />
    </svg>
  ),
};

const CATS: { value: Categoria | "todos"; label: string }[] = [
  { value: "todos", label: "Todos" },
  { value: "iphone", label: "iPhone" },
  { value: "mac", label: "Mac" },
  { value: "ipad", label: "iPad" },
  { value: "accesorios", label: "Accesorios" },
  { value: "play", label: "Play" },
  { value: "fundas", label: "Fundas" },
  { value: "otros", label: "Otros" },
];

const ESTADOS: { value: Estado | "todos"; label: string }[] = [
  { value: "todos", label: "Nuevo y usado" },
  { value: "nuevo", label: "Solo nuevo" },
  { value: "usado", label: "Solo usado" },
];

function consultarLink(p: Producto, colorElegido?: string | null) {
  const m = p.moneda || "USD";
  const colorText = colorElegido ? `Color: ${colorElegido}` : p.color;
  const memText = p.memoria && p.memoria !== "—" && p.cat !== "fundas" ? `, ${p.memoria}` : "";
  return waLink(`Hola! Vi en la web que tienen ${p.modelo} (${colorText}${memText}) a ${m} $${p.precio}. ¿Sigue disponible?`);
}

export default function Stock({ initialProductos }: { initialProductos?: Producto[] }) {
  const [filtroCat, setFiltroCat] = useState<Categoria | "todos">("todos");
  const [filtroEstado, setFiltroEstado] = useState<Estado | "todos">("todos");
  const [filtroTexto, setFiltroTexto] = useState("");
  const [modalIndex, setModalIndex] = useState<number | null>(null);
  const [colorSeleccionado, setColorSeleccionado] = useState<string | null>(null);
  const [menuColoresAbierto, setMenuColoresAbierto] = useState(false);

  // Un array vacío significa que la base no tiene productos disponibles.
  const lista = initialProductos ?? productos;

  const items = useMemo(() => {
    return lista.filter((p) => {
      if (filtroCat !== "todos" && p.cat !== filtroCat) return false;
      if (filtroEstado !== "todos" && p.estado !== filtroEstado) return false;
      if (filtroTexto) {
        const hay = `${p.modelo} ${p.color}`.toLowerCase().includes(filtroTexto.toLowerCase());
        if (!hay) return false;
      }
      return true;
    });
  }, [lista, filtroCat, filtroEstado, filtroTexto]);

  const modalProduct = modalIndex !== null ? items[modalIndex] : null;

  function abrirModal(index: number | null) {
    setColorSeleccionado(null);
    setMenuColoresAbierto(false);
    setModalIndex(index);
  }

  function stepModal(delta: number) {
    if (!items.length || modalIndex === null) return;
    setColorSeleccionado(null);
    setMenuColoresAbierto(false);
    setModalIndex((modalIndex + delta + items.length) % items.length);
  }

  return (
    <section id="stock">
      <div className="container">
        <div className="section-head">
          <h2>Stock disponible</h2>
          <p>Inventario actualizado. Elegí un equipo y consultá disponibilidad al instante.</p>
        </div>

        <div className="stock-controls">
          <div className="stock-filters-row">
            <div className="chip-row">
              {CATS.map((c) => (
                <button
                  key={c.value}
                  className={`chip${filtroCat === c.value ? " active" : ""}`}
                  onClick={() => setFiltroCat(c.value)}
                >
                  {c.label}
                </button>
              ))}
            </div>
            <div className="chip-row">
              {ESTADOS.map((e) => (
                <button
                  key={e.value}
                  className={`chip${filtroEstado === e.value ? " active" : ""}`}
                  onClick={() => setFiltroEstado(e.value)}
                >
                  {e.label}
                </button>
              ))}
            </div>
          </div>
          <div className="search-wrap">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <circle cx="11" cy="11" r="7" /><path d="M21 21l-4.35-4.35" />
            </svg>
            <input
              type="text"
              placeholder="Buscar por modelo (ej: iPhone 13, M2)..."
              value={filtroTexto}
              onChange={(e) => setFiltroTexto(e.target.value)}
            />
          </div>
        </div>

        <div className="stock-count">{items.length} equipos encontrados</div>

        {items.length ? (
          <div className="stock-grid">
            {items.map((p, idx) => {
              return (
                <div
                  className="card"
                  key={`${p.modelo}-${p.color}-${p.memoria}-${idx}`}
                  tabIndex={0}
                  role="button"
                  aria-label={`Ver ficha de ${p.modelo}`}
                  onClick={() => abrirModal(idx)}
                  onKeyDown={(e) => e.key === "Enter" && abrirModal(idx)}
                  style={{ display: "flex", flexDirection: "column" }}
                >
                  <div className="card-top">
                    <div className="card-icon">{CAT_ICONS[p.cat]}</div>
                    <span className={`badge ${p.estado}`}>{p.estado === "nuevo" ? "Nuevo" : "Usado"}</span>
                  </div>

                  {/* Recuadro chiquito con la foto del producto (si la posee) */}
                  {p.imagen && (
                    <div
                      style={{
                        width: "100%",
                        height: "140px",
                        borderRadius: "10px",
                        overflow: "hidden",
                        background: "#0a0a0c",
                        border: "1px solid rgba(255, 255, 255, 0.08)",
                        marginBottom: "12px",
                        marginTop: "4px",
                      }}
                    >
                      <img
                        src={p.imagen}
                        alt={p.modelo}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          transition: "transform 0.3s ease",
                        }}
                      />
                    </div>
                  )}

                  <div className="card-title">{p.modelo}</div>
                  <div className="card-sub">{shouldShowBateria(p.cat, p.bateria) ? `Batería ${p.bateria}` : CAT_LABEL[p.cat]}</div>
                  <div className="card-tags" style={{ display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap", marginTop: "auto" }}>
                    {p.color && p.color !== "—" && (
                      <ColorDisplay colorString={p.color} showName={false} size="sm" />
                    )}
                    {p.memoria && p.memoria !== "—" && p.cat !== "fundas" && <span>{p.memoria}</span>}
                  </div>
                  <div className="card-bottom">
                    <div className="card-price"><span>Precio</span>{p.moneda || "USD"} ${p.precio}</div>
                    <a
                      className="card-ask"
                      href={consultarLink(p)}
                      target="_blank"
                      rel="noopener"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Consultar
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                        <path d="M5 12h14M13 6l6 6-6 6" />
                      </svg>
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="empty-state" style={{ display: "block" }}>
            No hay equipos que coincidan con esa búsqueda. Probá con otro filtro.
          </div>
        )}
      </div>

      {/* Modal de Detalle */}
      {modalProduct && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 100,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1rem",
            background: "rgba(0, 0, 0, 0.75)",
            backdropFilter: "blur(6px)",
          }}
          onClick={() => abrirModal(null)}
        >
          <div
            className="modal-content"
            style={{
              background: "#121318",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: "16px",
              maxWidth: "480px",
              width: "100%",
              padding: "1.5rem",
              position: "relative",
              boxShadow: "0 20px 40px rgba(0, 0, 0, 0.5)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => abrirModal(null)}
              style={{
                position: "absolute",
                top: "16px",
                right: "16px",
                background: "transparent",
                border: "none",
                color: "#94a3b8",
                fontSize: "1.25rem",
                cursor: "pointer",
              }}
            >
              ✕
            </button>

            {modalProduct.imagen && (
              <div
                style={{
                  width: "100%",
                  maxHeight: "260px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "16px",
                  borderRadius: "12px",
                  overflow: "hidden",
                  background: "#0a0a0c",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                }}
              >
                <img
                  src={modalProduct.imagen}
                  alt={modalProduct.modelo}
                  style={{
                    maxWidth: "100%",
                    maxHeight: "260px",
                    width: "auto",
                    height: "auto",
                    objectFit: "contain",
                  }}
                />
              </div>
            )}

            {/* Información del producto ubicada prolijamente debajo de la foto */}
            <div className="card-top" style={{ marginBottom: 6 }}>
              <div className="card-icon">{CAT_ICONS[modalProduct.cat]}</div>
              <span className={`badge ${modalProduct.estado}`}>{modalProduct.estado === "nuevo" ? "Nuevo" : "Usado"}</span>
            </div>
            <h3 style={{ fontSize: "1.3rem", fontWeight: 700, margin: "6px 0 12px 0" }}>{modalProduct.modelo}</h3>

            {/* Selector interactivo de colores (Menú "Ver colores") */}
            {modalProduct.color && modalProduct.color !== "—" && (() => {
              const parsed = parseColorString(modalProduct.color);
              if (parsed.length === 0) return null;

              if (parsed.length === 1) {
                return (
                  <div style={{ marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px", fontSize: "0.95rem" }}>
                    <span style={{ color: "var(--text-faint)", fontWeight: 500 }}>Color:</span>
                    <ColorDisplay colorString={modalProduct.color} showName={true} size="sm" />
                  </div>
                );
              }

              return (
                <div style={{ position: "relative", marginBottom: "16px" }}>
                  <label style={{ display: "block", fontSize: "0.82rem", color: "var(--text-faint)", marginBottom: "6px" }}>
                    Elegir color de preferencia:
                  </label>

                  {/* Botón Ver Colores */}
                  <button
                    type="button"
                    onClick={() => setMenuColoresAbierto(!menuColoresAbierto)}
                    style={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "10px 14px",
                      background: "rgba(255, 255, 255, 0.06)",
                      border: "1px solid rgba(255, 255, 255, 0.15)",
                      borderRadius: "10px",
                      color: "#fff",
                      fontSize: "0.95rem",
                      fontWeight: 600,
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                    }}
                  >
                    <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      🎨 {colorSeleccionado ? `Color seleccionado: ${colorSeleccionado}` : "Ver colores"}
                    </span>
                    <span style={{ fontSize: "0.85rem", color: "#94a3b8" }}>
                      {menuColoresAbierto ? "▲" : "▼"}
                    </span>
                  </button>

                  {/* Desplegable con todos los colores disponibles */}
                  {menuColoresAbierto && (
                    <div
                      style={{
                        position: "absolute",
                        top: "calc(100% + 6px)",
                        left: 0,
                        right: 0,
                        zIndex: 60,
                        background: "#181920",
                        border: "1px solid rgba(255, 255, 255, 0.15)",
                        borderRadius: "12px",
                        padding: "8px",
                        boxShadow: "0 16px 32px rgba(0, 0, 0, 0.7)",
                        maxHeight: "220px",
                        overflowY: "auto",
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))",
                        gap: "6px",
                      }}
                    >
                      {parsed.map((item, idx) => {
                        const nombreColor = item.type === "color" ? item.color.nombre : item.text;
                        const hexColor = item.type === "color" ? item.color.hex : "#888";
                        const isSelected = colorSeleccionado === nombreColor;

                        return (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => {
                              setColorSeleccionado(nombreColor);
                              setMenuColoresAbierto(false);
                            }}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "8px",
                              padding: "8px 10px",
                              borderRadius: "8px",
                              background: isSelected ? "rgba(34, 197, 94, 0.2)" : "rgba(255, 255, 255, 0.04)",
                              border: isSelected ? "1px solid #22c55e" : "1px solid rgba(255, 255, 255, 0.08)",
                              color: isSelected ? "#4ade80" : "#fff",
                              fontSize: "0.85rem",
                              fontWeight: isSelected ? 700 : 500,
                              cursor: "pointer",
                              textAlign: "left",
                              transition: "all 0.15s ease",
                            }}
                          >
                            <span
                              style={{
                                width: "14px",
                                height: "14px",
                                borderRadius: "50%",
                                background: hexColor,
                                backgroundColor: hexColor,
                                border: hexColor.toLowerCase() === "#ffffff" ? "1.5px solid #cbd5e1" : "1.5px solid rgba(255, 255, 255, 0.3)",
                                flexShrink: 0,
                              }}
                            />
                            <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                              {nombreColor}
                            </span>
                            {isSelected && <span style={{ marginLeft: "auto", fontSize: "0.8rem", color: "#22c55e" }}>✓</span>}
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {/* Recuadro de Color Elegido cuando ya seleccionó uno */}
                  {colorSeleccionado && (
                    <div
                      style={{
                        marginTop: "10px",
                        padding: "8px 12px",
                        borderRadius: "8px",
                        background: "rgba(34, 197, 94, 0.12)",
                        border: "1px solid rgba(34, 197, 94, 0.3)",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        fontSize: "0.88rem",
                        color: "#4ade80",
                        fontWeight: 600,
                      }}
                    >
                      <span>Color elegido:</span>
                      <ColorDisplay colorString={colorSeleccionado} showName={true} size="sm" />
                    </div>
                  )}
                </div>
              );
            })()}

            <div className="modal-specs" style={{ marginBottom: "20px" }}>
              {modalProduct.memoria && modalProduct.memoria !== "—" && modalProduct.cat !== "fundas" && (
                <div><span>Memoria</span><b>{modalProduct.memoria}</b></div>
              )}
              {shouldShowBateria(modalProduct.cat, modalProduct.bateria) && (
                <div><span>Batería</span><b>{modalProduct.bateria}</b></div>
              )}
              <div><span>Precio</span><b style={{ color: "#22c55e", fontSize: "1.15rem", fontWeight: 700 }}>{modalProduct.moneda || "USD"} ${modalProduct.precio}</b></div>
            </div>
            <a
              className="btn btn-primary"
              style={{ width: "100%", justifyContent: "center" }}
              href={consultarLink(modalProduct, colorSeleccionado)}
              target="_blank"
              rel="noopener"
            >
              Consultar por WhatsApp
            </a>
          </div>
          <button className="modal-nav-btn" aria-label="Siguiente producto" onClick={(e) => { e.stopPropagation(); stepModal(1); }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M9 6l6 6-6 6" /></svg>
          </button>
        </div>
      )}
    </section>
  );
}
