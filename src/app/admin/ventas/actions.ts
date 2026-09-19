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
        select: { precioVenta: true, stock: true },
      });

      if (!producto) {
        throw new Error("PRODUCTO_NO_ENCONTRADO");
      }

      if (producto.stock === 0) {
        await tx.producto.update({
          where: { id: productoId },
          data: { visible: false },
        });
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

  revalidatePath("/admin/ventas");
  revalidatePath("/admin/ventas-equipos");
  revalidatePath("/admin/ventas-accesorios");
  revalidatePath("/admin/stock");
  revalidatePath("/");
  return { ok: true };
}

export type EditarVentaState = { ok: boolean; error?: string } | null;

export async function editarVenta(
  id: string,
  _prev: EditarVentaState,
  formData: FormData
): Promise<EditarVentaState> {
  const cantidad = Number(formData.get("cantidad"));
  const precioUnitario = Number(formData.get("precioUnitario"));
  const fechaRaw = String(formData.get("fecha") || "").trim();

  if (!Number.isInteger(cantidad) || cantidad <= 0) {
    return { ok: false, error: "La cantidad debe ser un número entero mayor a 0." };
  }
  if (isNaN(precioUnitario) || precioUnitario <= 0) {
    return { ok: false, error: "El precio unitario debe ser un número mayor a 0." };
  }

  const fecha = fechaRaw ? new Date(fechaRaw) : undefined;
  if (fecha && isNaN(fecha.getTime())) {
    return { ok: false, error: "La fecha ingresada no es válida." };
  }

  try {
    await prisma.$transaction(async (tx) => {
      const ventaActual = await tx.venta.findUnique({
        where: { id },
        include: { producto: true },
      });

      if (!ventaActual) {
        throw new Error("VENTA_NO_ENCONTRADA");
      }

      const diffCantidad = cantidad - ventaActual.cantidad;

      if (diffCantidad > 0) {
        if (ventaActual.producto.stock < diffCantidad) {
          throw new Error("STOCK_INSUFICIENTE");
        }
        const nuevoStock = ventaActual.producto.stock - diffCantidad;
        await tx.producto.update({
          where: { id: ventaActual.productoId },
          data: {
            stock: { decrement: diffCantidad },
            visible: nuevoStock > 0,
          },
        });
      } else if (diffCantidad < 0) {
        const devolver = Math.abs(diffCantidad);
        await tx.producto.update({
          where: { id: ventaActual.productoId },
          data: {
            stock: { increment: devolver },
            visible: true,
          },
        });
      }

      const total = cantidad * precioUnitario;

      await tx.venta.update({
        where: { id },
        data: {
          cantidad,
          precioUnitario,
          total,
          ...(fecha ? { createdAt: fecha } : {}),
        },
      });
    });

    revalidatePath("/admin/ventas");
    revalidatePath("/admin/ventas-equipos");
    revalidatePath("/admin/ventas-accesorios");
    revalidatePath("/admin/stock");
    revalidatePath("/");
    return { ok: true };
  } catch (error) {
    if (error instanceof Error && error.message === "STOCK_INSUFICIENTE") {
      return { ok: false, error: "No hay stock suficiente para aumentar la cantidad de esta venta." };
    }
    if (error instanceof Error && error.message === "VENTA_NO_ENCONTRADA") {
      return { ok: false, error: "La venta no fue encontrada." };
    }
    console.error("Error al editar venta:", error);
    return { ok: false, error: "No se pudo actualizar la venta." };
  }
}

export async function eliminarVenta(id: string) {
  try {
    await prisma.$transaction(async (tx) => {
      const venta = await tx.venta.findUnique({
        where: { id },
        select: { productoId: true, cantidad: true },
      });

      if (!venta) {
        throw new Error("VENTA_NO_ENCONTRADA");
      }

      await tx.producto.update({
        where: { id: venta.productoId },
        data: {
          stock: { increment: venta.cantidad },
          visible: true,
        },
      });

      await tx.venta.delete({
        where: { id },
      });
    });

    revalidatePath("/admin/ventas");
    revalidatePath("/admin/ventas-equipos");
    revalidatePath("/admin/ventas-accesorios");
    revalidatePath("/admin/stock");
    revalidatePath("/");
    return { ok: true };
  } catch (error) {
    console.error("Error al eliminar venta:", error);
    return { ok: false, error: "No se pudo eliminar la venta." };
  }
}
