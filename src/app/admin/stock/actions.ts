"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { sanitizeBateria } from "@/lib/products";

export async function eliminarProducto(id: string) {
  try {
    await prisma.producto.delete({
      where: { id },
    });
    revalidatePath("/admin/stock");
    revalidatePath("/admin/ventas");
    revalidatePath("/");
    return { ok: true };
  } catch (error) {
    console.error("Error al eliminar producto:", error);
    return { ok: false, error: "No se pudo eliminar el producto." };
  }
}

export type EditarProductoState = { ok: boolean; error?: string } | null;

export async function editarProducto(
  id: string,
  _prev: EditarProductoState,
  formData: FormData
): Promise<EditarProductoState> {
  const modelo = String(formData.get("modelo") || "").trim();
  const categoria = String(formData.get("categoria") || "");
  const estado = String(formData.get("estado") || "");
  const color = String(formData.get("color") || "").trim() || null;

  // Procesamos la cantidad y unidad de memoria
  const memoriaCantidad = String(formData.get("memoriaCantidad") || formData.get("memoria") || "").trim();
  const memoriaUnidad = String(formData.get("memoriaUnidad") || "GB").trim();
  let memoria: string | null = null;
  if (memoriaCantidad) {
    if (/\b(GB|TB|MB)\b/i.test(memoriaCantidad)) {
      memoria = memoriaCantidad;
    } else {
      memoria = `${memoriaCantidad} ${memoriaUnidad}`;
    }
  }
  const bateriaRaw = String(formData.get("bateria") || "").trim();
  const bateria = sanitizeBateria(categoria, bateriaRaw);
  const precioVenta = Number(formData.get("precioVenta"));
  const precioCostoRaw = formData.get("precioCosto");
  const precioCosto = precioCostoRaw ? Number(precioCostoRaw) : null;
  const moneda = String(formData.get("moneda") || "USD");
  const stockRaw = formData.get("stock");
  const stock = stockRaw !== null ? Number(stockRaw) : undefined;
  
  const imagenRaw = formData.get("imagen");
  const eliminarImagen = formData.get("eliminarImagen") === "true";
  let imagen: string | null | undefined = undefined;
  if (eliminarImagen) {
    imagen = null;
  } else if (typeof imagenRaw === "string" && imagenRaw.trim() !== "") {
    imagen = imagenRaw.trim();
  }

  if (!modelo) return { ok: false, error: "Falta el modelo." };
  if (!["IPHONE", "MAC", "IPAD", "ACCESORIOS", "PLAY", "FUNDAS", "OTROS"].includes(categoria)) {
    return { ok: false, error: "Categoría inválida." };
  }
  if (!["NUEVO", "USADO"].includes(estado)) {
    return { ok: false, error: "Estado inválido." };
  }
  if (!precioVenta || precioVenta <= 0) {
    return { ok: false, error: "El precio de venta tiene que ser mayor a 0." };
  }
  if (stock !== undefined && (isNaN(stock) || stock < 0)) {
    return { ok: false, error: "El stock no puede ser un número negativo." };
  }

  try {
    await prisma.producto.update({
      where: { id },
      data: {
        modelo,
        categoria: categoria as "IPHONE" | "MAC" | "IPAD" | "ACCESORIOS" | "PLAY" | "FUNDAS" | "OTROS",
        estado: estado as "NUEVO" | "USADO",
        color,
        memoria,
        bateria,
        precioVenta,
        precioCosto,
        moneda: ["USD", "ARS"].includes(moneda) ? moneda : "USD",
        ...(stock !== undefined ? { stock, visible: stock > 0 } : {}),
        ...(imagen !== undefined ? { imagen } : {}),
      },
    });

    revalidatePath("/admin/stock");
    revalidatePath("/admin/ventas");
    revalidatePath("/");
    return { ok: true };
  } catch (error) {
    console.error("Error actualizando producto:", error);
    return { ok: false, error: "No se pudieron guardar los cambios del producto." };
  }
}

export async function cambiarEstadoVendido(id: string, vendido: boolean) {
  try {
    await prisma.producto.update({
      where: { id },
      data: {
        visible: !vendido,
        stock: vendido ? 0 : 1,
      },
    });
    revalidatePath("/admin/stock");
    revalidatePath("/admin/ventas");
    revalidatePath("/");
    return { ok: true };
  } catch (error) {
    console.error("Error al cambiar estado vendido:", error);
    return { ok: false, error: "No se pudo cambiar el estado del producto." };
  }
}

export async function registrarVentaStock(productoId: string, cantidad: number) {
  if (!Number.isInteger(cantidad) || cantidad <= 0) {
    return { ok: false, error: "La cantidad debe ser un número entero mayor a 0." };
  }

  try {
    await prisma.$transaction(async (tx) => {
      const updated = await tx.producto.updateMany({
        where: {
          id: productoId,
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

    revalidatePath("/admin/stock");
    revalidatePath("/admin/ventas");
    revalidatePath("/");
    return { ok: true };
  } catch (error) {
    if (error instanceof Error && error.message === "STOCK_INSUFICIENTE") {
      return { ok: false, error: "La cantidad supera el stock disponible." };
    }
    console.error("Error al registrar venta desde stock:", error);
    return { ok: false, error: "No se pudo registrar la venta." };
  }
}
