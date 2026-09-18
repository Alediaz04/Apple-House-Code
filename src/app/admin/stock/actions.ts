"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function eliminarProducto(id: string) {
  try {
    await prisma.producto.delete({
      where: { id },
    });
    revalidatePath("/admin/stock");
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
  const bateria = String(formData.get("bateria") || "").trim() || null;
  const precioVenta = Number(formData.get("precioVenta"));
  const precioCostoRaw = formData.get("precioCosto");
  const precioCosto = precioCostoRaw ? Number(precioCostoRaw) : null;

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
      },
    });

    revalidatePath("/admin/stock");
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
    revalidatePath("/");
    return { ok: true };
  } catch (error) {
    console.error("Error al cambiar estado vendido:", error);
    return { ok: false, error: "No se pudo cambiar el estado del producto." };
  }
}

