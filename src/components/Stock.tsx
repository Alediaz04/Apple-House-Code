"use client";

import { useMemo, useState } from "react";
import { productos, CAT_LABEL, Categoria, Estado, Producto, waLink } from "@/lib/products";

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
  { value: "otros", label: "Otros" },
];

const ESTADOS: { value: Estado | "todos"; label: string }[] = [
  { value: "todos", label: "Nuevo y usado" },
  { value: "nuevo", label: "Solo nuevo" },
  { value: "usado", label: "Solo usado" },
];

function consultarLink(p: Producto) {
  return waLink(`Hola! Vi en la web que tienen ${p.modelo} (${p.color}, ${p.memoria}) a USD ${p.precio}. ¿Sigue disponible?`);
}

export default function Stock({ initialProductos }: { initialProductos?: Producto[] }) {
  const [filtroCat, setFiltroCat] = useState<Categoria | "todos">("todos");
  const [filtroEstado, setFiltroEstado] = useState<Estado | "todos">("todos");
  const [filtroTexto, setFiltroTexto] = useState("");
  const [modalIndex, setModalIndex] = useState<number | null>(null);

  const lista = initialProductos && initialProductos.length > 0 ? initialProductos : productos;

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

  function stepModal(delta: number) {
    if (!items.length || modalIndex === null) return;
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
            <circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" />
          </svg>
          <input
            type="text"
            placeholder="Buscar modelo o color…"
            value={filtroTexto}
            onChange={(e) => setFiltroTexto(e.target.value)}
          />
        </div>

        <div className="stock-meta">
          {items.length ? `${items.length} ${items.length === 1 ? "equipo encontrado" : "equipos encontrados"}` : ""}
        </div>

        {items.length ? (
          <div className="stock-grid">
            {items.map((p, idx) => {
              const tags = [p.color, p.memoria].filter((v) => v && v !== "—");
              return (
                <div
                  className="card"
                  key={`${p.modelo}-${p.color}-${p.memoria}-${idx}`}
                  tabIndex={0}
                  role="button"
                  aria-label={`Ver ficha de ${p.modelo}`}
                  onClick={() => setModalIndex(idx)}
                  onKeyDown={(e) => e.key === "Enter" && setModalIndex(idx)}
                >
                  <div className="card-top">
                    <div className="card-icon">{CAT_ICONS[p.cat]}</div>
                    <span className={`badge ${p.estado}`}>{p.estado === "nuevo" ? "Nuevo" : "Usado"}</span>
                  </div>
                  <div className="card-title">{p.modelo}</div>
                  <div className="card-sub">{p.bateria !== "—" ? `Batería ${p.bateria}` : CAT_LABEL[p.cat]}</div>
                  <div className="card-tags">
                    {tags.map((t) => (
                      <span key={t}>{t}</span>
                    ))}
                  </div>
                  <div className="card-bottom">
                    <div className="card-price"><span>Precio</span>USD {p.precio}</div>
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

      {modalProduct && (
        <div className="open" id="productModal" onClick={() => setModalIndex(null)}>
          <button className="modal-nav-btn" aria-label="Producto anterior" onClick={(e) => { e.stopPropagation(); stepModal(-1); }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M15 6l-6 6 6 6" /></svg>
          </button>
          <div className="modal-panel" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" aria-label="Cerrar" onClick={() => setModalIndex(null)}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M6 6l12 12M18 6L6 18" /></svg>
            </button>
            <div className="modal-counter">{(modalIndex ?? 0) + 1} / {items.length}</div>
            <div>
              <div className="card-top" style={{ marginBottom: 6 }}>
                <div className="card-icon">{CAT_ICONS[modalProduct.cat]}</div>
                <span className={`badge ${modalProduct.estado}`}>{modalProduct.estado === "nuevo" ? "Nuevo" : "Usado"}</span>
              </div>
              <h3>{modalProduct.modelo}</h3>
              <div className="modal-specs">
                <div><span>Color</span><b>{modalProduct.color}</b></div>
                <div><span>Memoria</span><b>{modalProduct.memoria}</b></div>
                <div><span>Batería</span><b>{modalProduct.bateria}</b></div>
                <div><span>Precio</span><b>USD {modalProduct.precio}</b></div>
              </div>
              <a
                className="btn btn-primary"
                style={{ width: "100%", justifyContent: "center" }}
                href={consultarLink(modalProduct)}
                target="_blank"
                rel="noopener"
              >
                Consultar por WhatsApp
              </a>
            </div>
          </div>
          <button className="modal-nav-btn" aria-label="Siguiente producto" onClick={(e) => { e.stopPropagation(); stepModal(1); }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M9 6l6 6-6 6" /></svg>
          </button>
        </div>
      )}
    </section>
  );
}
