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

export async function cambiarEstadoVendido(id: string, marcarComoVendido: boolean) {
  try {
    await prisma.producto.update({
      where: { id },
      data: {
        stock: marcarComoVendido ? 0 : 1,
        visible: marcarComoVendido ? false : true,
      },
    });
    revalidatePath("/admin/stock");
    revalidatePath("/");
    return { ok: true };
  } catch (error) {
    console.error("Error al cambiar estado de venta:", error);
    return { ok: false, error: "No se pudo actualizar el estado del producto." };
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
  const memoria = String(formData.get("memoria") || "").trim() || null;
  const bateria = String(formData.get("bateria") || "").trim() || null;
  const precioVenta = Number(formData.get("precioVenta"));
  const precioCostoRaw = formData.get("precioCosto");
  const precioCosto = precioCostoRaw ? Number(precioCostoRaw) : null;

  if (!modelo) return { ok: false, error: "Falta el modelo." };
  if (!["IPHONE", "MAC", "IPAD", "ACCESORIOS", "OTROS"].includes(categoria)) {
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
        categoria: categoria as "IPHONE" | "MAC" | "IPAD" | "ACCESORIOS" | "OTROS",
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
