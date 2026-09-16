import { prisma } from "@/lib/prisma";

export type Categoria = "iphone" | "mac" | "ipad" | "accesorios" | "otros";
export type Estado = "nuevo" | "usado";

export interface Producto {
  id?: string;
  modelo: string;
  cat: Categoria;
  estado: Estado;
  bateria: string;
  color: string;
  memoria: string;
  precio: number;
}

export async function getProductosDb(): Promise<Producto[]> {
  try {
    const dbProducts = await prisma.producto.findMany({
      where: { visible: true },
      orderBy: { createdAt: "desc" },
    });

    if (dbProducts.length > 0) {
      return dbProducts.map((p) => ({
        id: p.id,
        modelo: p.modelo,
        cat: p.categoria.toLowerCase() as Categoria,
        estado: p.estado.toLowerCase() as Estado,
        bateria: p.bateria || "—",
        color: p.color || "—",
        memoria: p.memoria || "—",
        precio: p.precioVenta,
      }));
    }
  } catch (error) {
    console.error("Error cargando productos de la base de datos:", error);
  }

  return productos;
}

// NOTA: en la Etapa 2 (panel admin) este array pasa a venir de la base de datos.
export const productos: Producto[] = [
  { modelo: "iPhone 12 mini", cat: "iphone", estado: "usado", bateria: "100%", color: "Purple", memoria: "64 GB", precio: 250 },
  { modelo: "iPhone 13 mini", cat: "iphone", estado: "usado", bateria: "88%", color: "Blue", memoria: "128 GB", precio: 300 },
  { modelo: "iPhone 13", cat: "iphone", estado: "usado", bateria: "93%", color: "White", memoria: "128 GB", precio: 350 },
  { modelo: "iPhone 13 Pro Max", cat: "iphone", estado: "usado", bateria: "100%", color: "Gold", memoria: "128 GB", precio: 510 },
  { modelo: "iPhone 13 Pro Max", cat: "iphone", estado: "usado", bateria: "100%", color: "Green (detalle estético)", memoria: "128 GB", precio: 450 },
  { modelo: "iPhone 14", cat: "iphone", estado: "usado", bateria: "100%", color: "Black", memoria: "128 GB", precio: 430 },
  { modelo: "iPhone 14 Pro", cat: "iphone", estado: "usado", bateria: "100%", color: "Black", memoria: "256 GB", precio: 600 },
  { modelo: "iPhone 15 Pro", cat: "iphone", estado: "usado", bateria: "88%", color: "Black", memoria: "128 GB", precio: 650 },
  { modelo: "iPhone 15 Pro Max", cat: "iphone", estado: "usado", bateria: "85%", color: "Natural Titanium", memoria: "256 GB", precio: 750 },
  { modelo: "iPhone 16", cat: "iphone", estado: "usado", bateria: "91%", color: "Pink", memoria: "128 GB", precio: 700 },
  { modelo: "iPhone 17 Pro", cat: "iphone", estado: "nuevo", bateria: "100%", color: "Deep Blue", memoria: "256 GB", precio: 1290 },
  { modelo: "iPhone 17 Pro Max", cat: "iphone", estado: "nuevo", bateria: "100%", color: "Deep Blue", memoria: "256 GB", precio: 1390 },
  { modelo: "MacBook Neo", cat: "mac", estado: "nuevo", bateria: "100%", color: "Indigo", memoria: "256 GB", precio: 930 },
  { modelo: "MacBook Neo", cat: "mac", estado: "nuevo", bateria: "100%", color: "Indigo", memoria: "512 GB", precio: 1070 },
  { modelo: "MacBook Air M5", cat: "mac", estado: "nuevo", bateria: "100%", color: "4 colores disponibles", memoria: "512 GB", precio: 1475 },
  { modelo: "iPad A16", cat: "ipad", estado: "nuevo", bateria: "100%", color: "Pink, Blue, Silver", memoria: "128 GB", precio: 610 },
  { modelo: "Apple Pencil USB-C", cat: "accesorios", estado: "nuevo", bateria: "—", color: "—", memoria: "—", precio: 175 },
  { modelo: "Apple Pencil Pro", cat: "accesorios", estado: "nuevo", bateria: "—", color: "—", memoria: "—", precio: 210 },
  { modelo: "PlayStation 5 Digital", cat: "otros", estado: "nuevo", bateria: "—", color: "—", memoria: "825 GB", precio: 850 },
  { modelo: "JBL Boombox 4", cat: "otros", estado: "nuevo", bateria: "—", color: "Naranja / Negro", memoria: "—", precio: 650 },
  { modelo: "Samsung S26 Ultra", cat: "otros", estado: "nuevo", bateria: "—", color: "Cobalt Violet / Black", memoria: "256 GB", precio: 1150 },
];

export const CAT_LABEL: Record<Categoria, string> = {
  iphone: "iPhone",
  mac: "Mac",
  ipad: "iPad",
  accesorios: "Accesorio",
  otros: "Otro",
};

export const WA_NUMBER = "5492613407016";

export function waLink(text: string) {
  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`;
}
