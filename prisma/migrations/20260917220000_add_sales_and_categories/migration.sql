-- Add the new inventory categories.
ALTER TYPE "Categoria" ADD VALUE IF NOT EXISTS 'PLAY';
ALTER TYPE "Categoria" ADD VALUE IF NOT EXISTS 'FUNDAS';

-- Keep each completed sale linked to the product and its sold quantity.
CREATE TABLE "Venta" (
    "id" TEXT NOT NULL,
    "productoId" TEXT NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "precioUnitario" DOUBLE PRECISION NOT NULL,
    "total" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Venta_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "Venta_productoId_idx" ON "Venta"("productoId");
CREATE INDEX "Venta_createdAt_idx" ON "Venta"("createdAt");

ALTER TABLE "Venta"
ADD CONSTRAINT "Venta_productoId_fkey"
FOREIGN KEY ("productoId") REFERENCES "Producto"("id")
ON DELETE CASCADE ON UPDATE CASCADE;
