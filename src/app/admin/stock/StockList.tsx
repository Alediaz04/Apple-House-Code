"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { eliminarProducto } from "./actions";
import EditModal from "./EditModal";

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
  moneda: string;
  stock: number;
  visible: boolean;
}

const CATEGORIAS = [
  { value: "IPHONE", label: "iPhone", icon: "📱" },
  { value: "MAC", label: "Mac", icon: "💻" },
  { value: "IPAD", label: "iPad", icon: "✏️" },
  { value: "ACCESORIOS", label: "Accesorios", icon: "🎧" },
  { value: "PLAY", label: "Play", icon: "🎮" },
  { value: "FUNDAS", label: "Fundas", icon: "📱" },
  { value: "OTROS", label: "Otros", icon: "📦" },
] as const;

function normalizarCategoria(categoria: string) {
  const valor = categoria.trim().toUpperCase();
  return valor === "OTRO" ? "OTROS" : valor;
}

export default function StockList({ productos }: { productos: Producto[] }) {
  const [search, setSearch] = useState("");
  const [selectedCategoria, setSelectedCategoria] = useState<string | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [editingProduct, setEditingProduct] = useState<Producto | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<Producto | null>(null);
  const [isPending, startTransition] = useTransition();
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function closeMenu(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenMenuId(null);
      }
    }
    document.addEventListener("mousedown", closeMenu);
    return () => document.removeEventListener("mousedown", closeMenu);
  }, []);

  const productosFiltrados = productos.filter((producto) => {
    const matchesCategory =
      !selectedCategoria || normalizarCategoria(producto.categoria) === selectedCategoria;
    const textoBusqueda = search.trim().toLowerCase();
    const textoProducto = [
      producto.modelo,
      producto.categoria,
      producto.color ?? "",
      producto.memoria ?? "",
      producto.bateria ?? "",
    ]
      .join(" ")
      .toLowerCase();
    const matchesSearch = !textoBusqueda || textoProducto.includes(textoBusqueda);
    return matchesCategory && matchesSearch;
  });
  const stockTotal = productos
    .filter((producto) => producto.stock > 0)
    .reduce((total, producto) => total + producto.stock, 0);
  const stockCategoria = selectedCategoria
    ? productos
        .filter(
          (producto) =>
            normalizarCategoria(producto.categoria) === selectedCategoria && producto.stock > 0,
        )
        .reduce((total, producto) => total + producto.stock, 0)
    : stockTotal;
  const categoriaSeleccionada = CATEGORIAS.find(
    (categoria) => categoria.value === selectedCategoria,
  );

  function confirmarEliminacion() {
    if (!deletingProduct) return;
    const id = deletingProduct.id;
    startTransition(async () => {
      const result = await eliminarProducto(id);
      if (result.ok) setDeletingProduct(null);
    });
  }

  if (productos.length === 0) {
    return <div className="admin-form-card">No hay productos guardados en la base de datos todavía.</div>;
  }

  return (
    <>
      <p style={{ color: "var(--text-muted)", marginBottom: 20 }}>
        {categoriaSeleccionada
          ? `Stock disponible en ${categoriaSeleccionada.label}: ${stockCategoria} ${
              stockCategoria === 1 ? "unidad" : "unidades"
            }.`
          : `Listado completo de equipos en stock: ${stockTotal} ${
              stockTotal === 1 ? "unidad" : "unidades"
            }.`}
      </p>

      <div style={{ marginBottom: 20 }}>
        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Buscar por modelo..."
          className="form-input"
          style={{ maxWidth: 340 }}
        />
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
          gap: 12,
          marginBottom: 24,
        }}
      >
        {CATEGORIAS.map((categoria) => {
          const items = productos.filter(
            (producto) => normalizarCategoria(producto.categoria) === categoria.value,
          );
          const stockTotal = items.reduce((total, producto) => total + producto.stock, 0);
          const selected = selectedCategoria === categoria.value;
          return (
            <button
              key={categoria.value}
              type="button"
              onClick={() => setSelectedCategoria(selected ? null : categoria.value)}
              style={{
                padding: 16,
                textAlign: "left",
                cursor: "pointer",
                color: "var(--text)",
                background: selected ? "rgba(56,189,248,0.14)" : "rgba(255,255,255,0.03)",
                border: selected ? "1px solid #38bdf8" : "1px solid var(--border)",
                borderRadius: 12,
              }}
            >
              <div style={{ fontSize: "1.4rem" }}>{categoria.icon}</div>
              <strong>{categoria.label}</strong>
              <div style={{ color: "var(--text-muted)", fontSize: ".82rem", marginTop: 6 }}>
                {items.length} equipo(s)
              </div>
              <div style={{ color: "#38bdf8", fontWeight: 700, marginTop: 4 }}>
                {stockTotal} disponible(s)
              </div>
            </button>
          );
        })}
      </div>

      <div style={{ display: "grid", gap: 14 }}>
        {productosFiltrados.map((producto) => {
          const agotado = producto.stock === 0 || !producto.visible;
          const menuOpen = openMenuId === producto.id;
          return (
            <article
              key={producto.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: 16,
                alignItems: "center",
                padding: "16px 20px",
                background: "rgba(255,255,255,0.03)",
                border: "1px solid var(--border)",
                borderRadius: 12,
                opacity: agotado ? 0.7 : 1,
              }}
            >
              <div style={{ minWidth: 0 }}>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
                  <strong>{producto.modelo}</strong>
                  <span style={{ color: producto.stock > 0 ? "#38bdf8" : "#ef4444" }}>
                    Stock: {producto.stock}
                  </span>
                  <span>{producto.estado}</span>
                </div>
                <div style={{ color: "var(--text-muted)", fontSize: ".88rem", marginTop: 6 }}>
                  Cat: <b>{producto.categoria}</b> · Color: <b>{producto.color || "—"}</b> ·
                  Memoria: <b>{producto.memoria || "—"}</b> · Batería: <b>{producto.bateria || "—"}</b>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <strong style={{ color: "#38bdf8", whiteSpace: "nowrap" }}>
                  {producto.moneda} {producto.precioVenta}
                </strong>
                <div style={{ position: "relative" }} ref={menuOpen ? menuRef : null}>
                  <button
                    type="button"
                    onClick={() => setOpenMenuId(menuOpen ? null : producto.id)}
                    aria-label="Opciones de producto"
                    className="admin-btn-secondary"
                  >
                    ⋮
                  </button>
                  {menuOpen && (
                    <div
                      style={{
                        position: "absolute",
                        right: 0,
                        top: "calc(100% + 6px)",
                        zIndex: 10,
                        minWidth: 170,
                        padding: 6,
                        background: "#181a20",
                        border: "1px solid var(--border)",
                        borderRadius: 10,
                      }}
                    >
                      <button
                        type="button"
                        className="admin-btn-secondary"
                        style={{ width: "100%", justifyContent: "flex-start" }}
                        onClick={() => {
                          setOpenMenuId(null);
                          setEditingProduct(producto);
                        }}
                      >
                        Editar producto
                      </button>
                      <button
                        type="button"
                        style={{ width: "100%", marginTop: 4, color: "#ef4444" }}
                        className="admin-btn-secondary"
                        onClick={() => {
                          setOpenMenuId(null);
                          setDeletingProduct(producto);
                        }}
                      >
                        Eliminar producto
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {productosFiltrados.length === 0 && (
        <div className="admin-form-card" style={{ color: "var(--text-muted)", textAlign: "center" }}>
          No se encontraron equipos con ese criterio de búsqueda.
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
            zIndex: 100,
            display: "grid",
            placeItems: "center",
            padding: 16,
            background: "rgba(0,0,0,.75)",
          }}
          onClick={() => setDeletingProduct(null)}
        >
          <div className="admin-form-card" onClick={(event) => event.stopPropagation()}>
            <h3>¿Eliminar producto?</h3>
            <p style={{ color: "var(--text-muted)", margin: "12px 0 20px" }}>
              Esta acción no se puede deshacer.
            </p>
            <div style={{ display: "flex", gap: 12 }}>
              <button type="button" className="admin-btn-secondary" onClick={() => setDeletingProduct(null)}>
                Cancelar
              </button>
              <button type="button" className="admin-submit-btn" disabled={isPending} onClick={confirmarEliminacion}>
                {isPending ? "Eliminando..." : "Sí, eliminar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
