"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export type RegistrarVentaState = { ok: boolean; error?: string } | null;

export async function registrarVenta(
  _prev: RegistrarVentaState,
  formData: FormData
): Promise<RegistrarVentaState> {
  const productoId = String(formData.get("productoId") ?? "").trim();
  const cantidad = Number(formData.get("cantidad"));

  if (!productoId) {
    return { ok: false, error: "Seleccioná un producto." };
  }

  if (!Number.isInteger(cantidad) || cantidad <= 0) {
    return { ok: false, error: "La cantidad debe ser un número entero mayor a 0." };
  }

  try {
    await prisma.$transaction(async (tx) => {
      // La condición stock >= cantidad evita vender más unidades de las disponibles.
      const updated = await tx.producto.updateMany({
        where: {
          id: productoId,
          visible: true,
          stock: { gte: cantidad },
        },
        data: {
          stock: { decrement: cantidad },
        },
      });

      if (updated.count !== 1) {
        throw new Error("STOCK_INSUFICIENTE");
      }

      const producto = await tx.producto.findUnique({
        where: { id: productoId },
        select: { precioVenta: true },
      });

      if (!producto) {
        throw new Error("PRODUCTO_NO_ENCONTRADO");
      }

      await tx.venta.create({
        data: {
          productoId,
          cantidad,
          precioUnitario: producto.precioVenta,
          total: producto.precioVenta * cantidad,
        },
      });
    });
  } catch (error) {
    if (error instanceof Error && error.message === "STOCK_INSUFICIENTE") {
      return { ok: false, error: "No hay stock suficiente para registrar esta venta." };
    }

    if (error instanceof Error && error.message === "PRODUCTO_NO_ENCONTRADO") {
      return { ok: false, error: "El producto seleccionado ya no existe." };
    }

    console.error("Error al registrar venta:", error);
    return { ok: false, error: "No se pudo registrar la venta." };
  }

  // Actualizamos las pantallas que dependen del stock y del historial de ventas.
  revalidatePath("/admin/ventas");
  revalidatePath("/admin/stock");
  revalidatePath("/");
  return { ok: true };
}
