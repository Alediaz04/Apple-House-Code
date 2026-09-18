"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export type CrearReparacionState = { ok: boolean; error?: string } | null;
function convertirFechaLocal(fecha: string) {
  const [year, month, day] = fecha.split("-").map(Number);

  return new Date(year, month - 1, day);
}

export async function crearReparacion(
  _prev: CrearReparacionState,
  formData: FormData
): Promise<CrearReparacionState> {
  function convertirFechaLocal(fecha: string) {
  const [year, month, day] = fecha.split("-").map(Number);

  return new Date(year, month - 1, day);
}
  const nombreCliente = String(formData.get("nombreCliente") || "").trim();
  const telefono = String(formData.get("telefono") || "").trim();
  const email = String(formData.get("email") || "").trim() || null;
  const dispositivo = String(formData.get("dispositivo") || "").trim();
  const fechaIngresoRaw = String(formData.get("fechaIngreso") || "").trim();
  const cobroRaw = formData.get("cobro");
  const costoRepuestosRaw = formData.get("costoRepuestos");
  const descripcion = String(formData.get("descripcion") || "").trim() || null;

  const fechaIngreso = convertirFechaLocal(fechaIngresoRaw);
  const cobro = cobroRaw ? Number(cobroRaw) : null;
  const costoRepuestos = costoRepuestosRaw ? Number(costoRepuestosRaw) : null;

  if (!nombreCliente) {
    return { ok: false, error: "Falta el nombre del cliente." };
  }

  if (!telefono) {
    return { ok: false, error: "Falta el telefono." };
  }

  if (!dispositivo) {
    return { ok: false, error: "Falta el dispositivo." };
  }

  if (!fechaIngresoRaw || Number.isNaN(fechaIngreso.getTime())) {
    return { ok: false, error: "La fecha de ingreso no es valida." };
  }

  if (cobro !== null && (!Number.isFinite(cobro) || cobro < 0)) {
    return { ok: false, error: "El cobro no es valido." };
  }

  if (
    costoRepuestos !== null &&
    (!Number.isFinite(costoRepuestos) || costoRepuestos < 0)
  ) {
    return { ok: false, error: "El costo de repuestos no es valido." };
  }

  try {
    await prisma.reparacion.create({
      data: {
        nombreCliente,
        telefono,
        email,
        dispositivo,
        fechaIngreso,
        cobro,
        costoRepuestos,
        descripcion,
      },
    });

    revalidatePath("/admin/reparaciones");

    return { ok: true };
  } catch (error) {
    console.error("Error al crear reparacion:", error);
    return {
      ok: false,
      error: "No se pudo guardar la reparacion.",
    };
  }
}

export async function editarReparacion(
  id: string,
  formData: FormData
): Promise<{ ok: boolean; error?: string }> {
  const nombreCliente = String(formData.get("nombreCliente") || "").trim();
  const telefono = String(formData.get("telefono") || "").trim();
  const email = String(formData.get("email") || "").trim() || null;
  const dispositivo = String(formData.get("dispositivo") || "").trim();
  const fechaIngresoRaw = String(formData.get("fechaIngreso") || "").trim();
  const cobroRaw = formData.get("cobro");
  const costoRepuestosRaw = formData.get("costoRepuestos");
  const descripcion = String(formData.get("descripcion") || "").trim() || null;

  const fechaIngreso = convertirFechaLocal(fechaIngresoRaw);
  const cobro = cobroRaw ? Number(cobroRaw) : null;
  const costoRepuestos = costoRepuestosRaw ? Number(costoRepuestosRaw) : null;

  if (!id) {
    return { ok: false, error: "Falta el identificador de la reparacion." };
  }

  if (!nombreCliente) {
    return { ok: false, error: "Falta el nombre del cliente." };
  }

  if (!telefono) {
    return { ok: false, error: "Falta el telefono." };
  }

  if (!dispositivo) {
    return { ok: false, error: "Falta el dispositivo." };
  }

  if (!fechaIngresoRaw || Number.isNaN(fechaIngreso.getTime())) {
    return { ok: false, error: "La fecha de ingreso no es valida." };
  }

  if (cobro !== null && (!Number.isFinite(cobro) || cobro < 0)) {
    return { ok: false, error: "El cobro no es valido." };
  }

  if (
    costoRepuestos !== null &&
    (!Number.isFinite(costoRepuestos) || costoRepuestos < 0)
  ) {
    return { ok: false, error: "El costo de repuestos no es valido." };
  }

  try {
    await prisma.reparacion.update({
      where: { id },
      data: {
        nombreCliente,
        telefono,
        email,
        dispositivo,
        fechaIngreso,
        cobro,
        costoRepuestos,
        descripcion,
      },
    });

    revalidatePath("/admin/reparaciones");

    return { ok: true };
  } catch (error) {
    console.error("Error al editar reparacion:", error);
    return {
      ok: false,
      error: "No se pudo actualizar la reparacion.",
    };
  }
}

export async function cambiarEstadoReparacion(
  id: string,
  estado: "PENDIENTE" | "ENTREGADO"
): Promise<{ ok: boolean; error?: string }> {
  if (!id) {
    return { ok: false, error: "Falta el identificador de la reparacion." };
  }

  if (!["PENDIENTE", "ENTREGADO"].includes(estado)) {
    return { ok: false, error: "El estado no es valido." };
  }

  try {
    await prisma.reparacion.update({
      where: { id },
      data: { estado },
    });

    revalidatePath("/admin/reparaciones");

    return { ok: true };
  } catch (error) {
    console.error("Error al cambiar estado de reparacion:", error);
    return {
      ok: false,
      error: "No se pudo cambiar el estado de la reparacion.",
    };
  }
}

export async function eliminarReparacion(
  id: string
): Promise<{ ok: boolean; error?: string }> {
  if (!id) {
    return { ok: false, error: "Falta el identificador de la reparacion." };
  }

  try {
    await prisma.reparacion.delete({
      where: { id },
    });

    revalidatePath("/admin/reparaciones");

    return { ok: true };
  } catch (error) {
    console.error("Error al eliminar reparacion:", error);
    return {
      ok: false,
      error: "No se pudo eliminar la reparacion.",
    };
  }
}
