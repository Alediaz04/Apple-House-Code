"use server"; // <- clave: esto hace que la función corra en el servidor, no en el navegador

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { sanitizeBateria } from "@/lib/products";

export type CrearProductoState = { ok: boolean; error?: string } | null;

export async function crearProducto(
  _prev: CrearProductoState,
  formData: FormData
): Promise<CrearProductoState> {
  // Leemos y limpiamos cada campo del formulario
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

  // NUEVO: Leemos la moneda, el stock y la foto del formulario
  const moneda = String(formData.get("moneda") || "USD");
  const stock = Number(formData.get("stock")) || 1;
  const imagen = String(formData.get("imagen") || "").trim() || null;

  // Validaciones básicas del lado del servidor (nunca confiar solo en el formulario)
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

  // Guardamos en la base de datos
  await prisma.producto.create({
    data: {
      modelo,
      categoria: categoria as "IPHONE" | "MAC" | "IPAD" | "ACCESORIOS" | "PLAY" | "FUNDAS" | "OTROS",
      estado: estado as "NUEVO" | "USADO",
      color,
      memoria,
      bateria,
      precioVenta,
      precioCosto,
      moneda,
      stock,
      imagen,
    },
  });

  // Le avisamos a Next.js que estas páginas cambiaron y hay que refrescar sus datos
  revalidatePath("/");
  revalidatePath("/admin/agregar");
  revalidatePath("/admin/stock");
  return { ok: true };
}