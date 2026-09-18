"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import {
  cambiarEstadoReparacion,
  editarReparacion,
  eliminarReparacion,
} from "./actions";


interface Reparacion {
  id: string;
  nombreCliente: string;
  telefono: string;
  email: string | null;
  dispositivo: string;
  fechaIngreso: Date | string;
  cobro: number | null;
  costoRepuestos: number | null;
  descripcion: string | null;
  estado: "PENDIENTE" | "ENTREGADO";
}

function formatearFecha(fecha: Date | string) {
  const date = new Date(fecha);

  return date.toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function formatearFechaInput(fecha: Date | string) {
  const date = new Date(fecha);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}


function formatearMonto(monto: number | null) {
  if (monto === null) return "-";

  return `$${monto.toFixed(2)}`;
}

export default function ReparacionesList({
  reparaciones,
}: {
  reparaciones: Reparacion[];
}) {
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [deletingReparacion, setDeletingReparacion] =
    useState<Reparacion | null>(null);
    const [editingReparacion, setEditingReparacion] =
  useState<Reparacion | null>(null);
  const [isPending, startTransition] = useTransition();
  const menuRef = useRef<HTMLDivElement | null>(null);
  

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        setOpenMenuId(null);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  function confirmarEliminacion() {
    if (!deletingReparacion) return;

    const id = deletingReparacion.id;

    startTransition(async () => {
      const result = await eliminarReparacion(id);

      if (!result.ok) {
        alert(result.error || "No se pudo eliminar la reparacion.");
        return;
      }

      setDeletingReparacion(null);
      setOpenMenuId(null);
    });
  }


  async function cambiarEstado(reparacion: Reparacion) {
    const nuevoEstado =
      reparacion.estado === "PENDIENTE" ? "ENTREGADO" : "PENDIENTE";

    startTransition(async () => {
      const result = await cambiarEstadoReparacion(
        reparacion.id,
        nuevoEstado
      );

      if (!result.ok) {
        alert(result.error || "No se pudo cambiar el estado.");
      }
    });
  }


async function guardarEdicion(event: React.FormEvent<HTMLFormElement>) {
  event.preventDefault();

  if (!editingReparacion) return;

  const formData = new FormData(event.currentTarget);

  startTransition(async () => {
    const result = await editarReparacion(
      editingReparacion.id,
      formData
    );

    if (!result.ok) {
      alert(result.error || "No se pudo actualizar la reparacion.");
      return;
    }

    setEditingReparacion(null);
  });
}


  if (reparaciones.length === 0) {
    return (
      <div className="admin-form-card">
        <p style={{ color: "var(--text-muted)", margin: 0 }}>
          Todavia no hay reparaciones registradas.
        </p>
      </div>
    );
  }

  return (
    <>
      <div style={{ display: "grid", gap: 20 }}>
        {reparaciones.map((reparacion) => (
          <article
            key={reparacion.id}
            className="admin-form-card"
            style={{
              margin: 0,
              padding: 28,
              position: "relative",
            }}
          >
            {/* Encabezado */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                gap: 20,
                paddingBottom: 20,
                borderBottom: "1px solid var(--border)",
              }}
            >
              <div>
                <p
                  style={{
                    margin: "0 0 6px",
                    fontSize: 12,
                    fontWeight: 700,
                    letterSpacing: "0.08em",
                    color: "var(--text-muted)",
                    textTransform: "uppercase",
                  }}
                >
                  Cliente
                </p>

                <h3
                  style={{
                    margin: 0,
                    fontSize: 22,
                    lineHeight: 1.2,
                  }}
                >
                  {reparacion.nombreCliente}
                </h3>
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                <span
  style={{
    padding: "7px 12px",
    borderRadius: 999,
    fontSize: 12,
    fontWeight: 700,
    background:
      reparacion.estado === "PENDIENTE"
        ? "rgba(234, 179, 8, 0.15)"
        : "rgba(34, 197, 94, 0.15)",
    color:
      reparacion.estado === "PENDIENTE"
        ? "#facc15"
        : "#4ade80",
    border:
      reparacion.estado === "PENDIENTE"
        ? "1px solid rgba(234, 179, 8, 0.3)"
        : "1px solid rgba(34, 197, 94, 0.3)",
  }}
>
                  {reparacion.estado}
                </span>

                <div ref={openMenuId === reparacion.id ? menuRef : null}>
                  <button
  type="button"
  onClick={() =>
    setOpenMenuId(
      openMenuId === reparacion.id
        ? null
        : reparacion.id
    )
  }
  aria-label="Abrir acciones"
  title="Acciones"
  style={{
    width: 36,
    height: 36,
    border: "1px solid #3a3d43",
    borderRadius: 8,
    background: "transparent",
    color: "#ffffff",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  }}
>
  <span
    style={{
      fontSize: 22,
      lineHeight: 1,
      transform: "translateY(-2px)",
    }}
  >
    ⋮
  </span>
</button>

                  {openMenuId === reparacion.id && (
                    <div
                 style={{
  position: "absolute",
  top: 76,
  right: 28,
  width: 210,
  background: "#15171b",
  border: "1px solid #30343a",
  borderRadius: 10,
  boxShadow: "0 12px 30px rgba(0,0,0,0.35)",
  zIndex: 20,
  padding: 6,
}}
                    >

<button
  type="button"
  onClick={() => {
    setEditingReparacion(reparacion);
    setOpenMenuId(null);
  }}
  style={{
    width: "100%",
    border: "none",
    borderRadius: 7,
    background: "transparent",
    color: "#ffffff",
    padding: "11px 12px",
    textAlign: "left",
    cursor: "pointer",
    fontSize: 14,
    fontWeight: 600,
  }}
>
  Editar reparacion
</button>

<button
  type="button"
  onClick={() => {
    cambiarEstado(reparacion);
    setOpenMenuId(null);
  }}
  style={{
    width: "100%",
    border: "none",
    borderRadius: 7,
    background: "transparent",
    color: "#ffffff",
    padding: "11px 12px",
    textAlign: "left",
    cursor: "pointer",
    fontSize: 14,
    fontWeight: 600,
  }}
>
  {reparacion.estado === "PENDIENTE"
    ? "Marcar como entregada"
    : "Marcar como pendiente"}
</button>

     <button
  type="button"
  onClick={() => {
    setDeletingReparacion(reparacion);
    setOpenMenuId(null);
  }}
  style={{
    width: "100%",
    border: "none",
    borderRadius: 7,
    background: "rgba(255, 80, 80, 0.08)",
    color: "#ffffff",
    padding: "11px 12px",
    textAlign: "left",
    cursor: "pointer",
    fontSize: 14,
    fontWeight: 600,
  }}
>
  Eliminar reparacion
</button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Dispositivo */}
            <div
              style={{
                padding: "20px 0",
                borderBottom: "1px solid var(--border)",
              }}
            >
              <p
                style={{
                  margin: "0 0 7px",
                  fontSize: 12,
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  color: "var(--text-muted)",
                  textTransform: "uppercase",
                }}
              >
                Dispositivo
              </p>

              <p
                style={{
                  margin: 0,
                  fontSize: 17,
                  fontWeight: 600,
                }}
              >
                {reparacion.dispositivo}
              </p>
            </div>

            {/* Datos principales */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                gap: 24,
                padding: "20px 0",
                borderBottom: "1px solid var(--border)",
              }}
            >
              <div>
                <p
                  style={{
                    margin: "0 0 6px",
                    fontSize: 12,
                    fontWeight: 700,
                    letterSpacing: "0.08em",
                    color: "var(--text-muted)",
                    textTransform: "uppercase",
                  }}
                >
                  Contacto
                </p>

                <p style={{ margin: "0 0 5px" }}>
                  <strong>Telefono:</strong> {reparacion.telefono}
                </p>

                {reparacion.email && (
                  <p style={{ margin: 0 }}>
                    <strong>Email:</strong> {reparacion.email}
                  </p>
                )}
              </div>

              <div>
                <p
                  style={{
                    margin: "0 0 6px",
                    fontSize: 12,
                    fontWeight: 700,
                    letterSpacing: "0.08em",
                    color: "var(--text-muted)",
                    textTransform: "uppercase",
                  }}
                >
                  Reparacion
                </p>

                <p style={{ margin: "0 0 5px" }}>
                  <strong>Ingreso:</strong>{" "}
                  {formatearFecha(reparacion.fechaIngreso)}
                </p>

                <p style={{ margin: "0 0 5px" }}>
                  <strong>Cobro:</strong> {formatearMonto(reparacion.cobro)}
                </p>

                <p style={{ margin: 0 }}>
                  <strong>Repuestos:</strong>{" "}
                  {formatearMonto(reparacion.costoRepuestos)}
                </p>
              </div>
            </div>

            {/* Descripcion */}
            {reparacion.descripcion && (
  <div
    style={{
      marginTop: 20,
      padding: "16px 18px",
      borderRadius: 10,
      border: "1px solid #2f3238",
      background: "rgba(255, 255, 255, 0.025)",
    }}
  >
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        marginBottom: 8,
      }}
    >
      <span
        style={{
          width: 7,
          height: 7,
          borderRadius: "50%",
          background: "var(--text-muted)",
          display: "block",
        }}
      />

      <p
        style={{
          margin: 0,
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: "0.1em",
          color: "var(--text-muted)",
          textTransform: "uppercase",
        }}
      >
        Detalle de la reparacion
      </p>
    </div>

    <p
      style={{
        margin: 0,
        lineHeight: 1.6,
        color: "var(--text-muted)",
        fontSize: 14,
      }}
    >
      {reparacion.descripcion}
    </p>
  </div>
)}
          </article>
        ))}
      </div>

      {/* Modal de confirmacion */}
      {deletingReparacion && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.45)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 20,
            zIndex: 100,
          }}
        >
          <div
            style={{
  background: "#15171b",
  color: "#ffffff",
  border: "1px solid #30343a",
  borderRadius: 14,
  padding: 28,
  width: "100%",
  maxWidth: 420,
  boxShadow: "0 16px 50px rgba(0,0,0,0.45)",
}}
          >
            <p
              style={{
                margin: "0 0 8px",
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: "0.08em",
                color: "var(--text-muted)",
                textTransform: "uppercase",
              }}
            >
              Confirmacion
            </p>

            <h3
  style={{
    margin: "0 0 12px",
    color: "#fff8f8",
  }}
>
  Eliminar reparacion
</h3>

            <p
              style={{
                margin: 0,
                lineHeight: 1.5,
                color: "var(--text-muted)",
              }}
            >
              ¿Estas seguro de que queres eliminar la reparacion de{" "}
              <strong>{deletingReparacion.nombreCliente}</strong>?
            </p>

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: 10,
                marginTop: 24,
              }}
            >
            <button
  type="button"
  onClick={() => setDeletingReparacion(null)}
  disabled={isPending}
  style={{
    border: "1px solid #333",
    borderRadius: 8,
    padding: "10px 16px",
    cursor: isPending ? "default" : "pointer",
    fontWeight: 600,
    background: "#fff",
    color: "#222",
    opacity: isPending ? 0.6 : 1,
  }}
>
  Cancelar
</button>

              <button
                type="button"
                onClick={confirmarEliminacion}
                disabled={isPending}
                style={{
                  border: "none",
                  borderRadius: 8,
                  padding: "10px 16px",
                  cursor: isPending ? "default" : "pointer",
                  fontWeight: 600,
                  background: "#222",
                  color: "#fff",
                  opacity: isPending ? 0.6 : 1,
                }}
              >
                {isPending ? "Eliminando..." : "Eliminar"}
              </button>
            </div>
          </div>
        </div>
      )}
          {editingReparacion && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.45)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 20,
            zIndex: 100,
          }}
        >
          <div
            style={{
              background: "#15171b",
              color: "#ffffff",
              border: "1px solid #30343a",
              borderRadius: 14,
              padding: 28,
              width: "100%",
              maxWidth: 620,
              maxHeight: "90vh",
              overflowY: "auto",
              boxShadow: "0 16px 50px rgba(0,0,0,0.45)",
            }}
          >
            <p
              style={{
                margin: "0 0 8px",
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: "0.08em",
                color: "var(--text-muted)",
                textTransform: "uppercase",
              }}
            >
              Editar reparacion
            </p>

            <h3
              style={{
                margin: "0 0 24px",
                fontSize: 22,
              }}
            >
              Datos de la reparacion
            </h3>

            <form onSubmit={guardarEdicion}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                  gap: 16,
                }}
              >
                <div>
                  <label
                    htmlFor="editar-nombreCliente"
                    style={{
                      display: "block",
                      marginBottom: 7,
                      fontSize: 13,
                      fontWeight: 600,
                    }}
                  >
                    Nombre del cliente
                  </label>

                  <input
                    id="editar-nombreCliente"
                    name="nombreCliente"
                    defaultValue={editingReparacion.nombreCliente}
                    required
                    className="form-input"
                  />
                </div>

                <div>
                  <label
                    htmlFor="editar-telefono"
                    style={{
                      display: "block",
                      marginBottom: 7,
                      fontSize: 13,
                      fontWeight: 600,
                    }}
                  >
                    Telefono
                  </label>

                  <input
                    id="editar-telefono"
                    name="telefono"
                    type="tel"
                    defaultValue={editingReparacion.telefono}
                    required
                    className="form-input"
                  />
                </div>

                <div style={{ gridColumn: "1 / -1" }}>
                  <label
                    htmlFor="editar-email"
                    style={{
                      display: "block",
                      marginBottom: 7,
                      fontSize: 13,
                      fontWeight: 600,
                    }}
                  >
                    Email
                  </label>

                  <input
                    id="editar-email"
                    name="email"
                    type="email"
                    defaultValue={editingReparacion.email ?? ""}
                    className="form-input"
                  />
                </div>

                <div style={{ gridColumn: "1 / -1" }}>
                  <label
                    htmlFor="editar-dispositivo"
                    style={{
                      display: "block",
                      marginBottom: 7,
                      fontSize: 13,
                      fontWeight: 600,
                    }}
                  >
                    Dispositivo
                  </label>

                  <input
                    id="editar-dispositivo"
                    name="dispositivo"
                    defaultValue={editingReparacion.dispositivo}
                    required
                    className="form-input"
                  />
                </div>

                <div>
                  <label
                    htmlFor="editar-fechaIngreso"
                    style={{
                      display: "block",
                      marginBottom: 7,
                      fontSize: 13,
                      fontWeight: 600,
                    }}
                  >
                    Fecha de ingreso
                  </label>

                  <input
                    id="editar-fechaIngreso"
                    name="fechaIngreso"
                    type="date"
                    defaultValue={formatearFechaInput(
                      editingReparacion.fechaIngreso
                    )}
                    required
                    className="form-input"
                  />
                </div>

                <div>
                  <label
                    htmlFor="editar-cobro"
                    style={{
                      display: "block",
                      marginBottom: 7,
                      fontSize: 13,
                      fontWeight: 600,
                    }}
                  >
                    Cobro
                  </label>

                  <input
                    id="editar-cobro"
                    name="cobro"
                    type="number"
                    step="0.01"
                    min="0"
                    defaultValue={editingReparacion.cobro ?? ""}
                    className="form-input"
                  />
                </div>

                <div>
                  <label
                    htmlFor="editar-costoRepuestos"
                    style={{
                      display: "block",
                      marginBottom: 7,
                      fontSize: 13,
                      fontWeight: 600,
                    }}
                  >
                    Costo de repuestos
                  </label>

                  <input
                    id="editar-costoRepuestos"
                    name="costoRepuestos"
                    type="number"
                    step="0.01"
                    min="0"
                    defaultValue={editingReparacion.costoRepuestos ?? ""}
                    className="form-input"
                  />
                </div>

                <div style={{ gridColumn: "1 / -1" }}>
                  <label
                    htmlFor="editar-descripcion"
                    style={{
                      display: "block",
                      marginBottom: 7,
                      fontSize: 13,
                      fontWeight: 600,
                    }}
                  >
                    Descripcion
                  </label>

                  <textarea
                    id="editar-descripcion"
                    name="descripcion"
                    rows={4}
                    defaultValue={editingReparacion.descripcion ?? ""}
                    className="form-input"
                  />
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: 10,
                  marginTop: 24,
                }}
              >
                <button
                  type="button"
                  onClick={() => setEditingReparacion(null)}
                  disabled={isPending}
                  style={{
                    border: "1px solid #3a3d43",
                    borderRadius: 8,
                    padding: "10px 16px",
                    cursor: isPending ? "default" : "pointer",
                    fontWeight: 600,
                    background: "transparent",
                    color: "#ffffff",
                    opacity: isPending ? 0.6 : 1,
                  }}
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  disabled={isPending}
                  style={{
                    border: "none",
                    borderRadius: 8,
                    padding: "10px 16px",
                    cursor: isPending ? "default" : "pointer",
                    fontWeight: 600,
                    background: "#ffffff",
                    color: "#15171b",
                    opacity: isPending ? 0.6 : 1,
                  }}
                >
                  {isPending ? "Guardando..." : "Guardar cambios"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}


    </>
  );
}
