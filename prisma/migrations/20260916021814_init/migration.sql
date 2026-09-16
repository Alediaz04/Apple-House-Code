-- CreateEnum
CREATE TYPE "Categoria" AS ENUM ('IPHONE', 'MAC', 'IPAD', 'ACCESORIOS', 'OTROS');

-- CreateEnum
CREATE TYPE "Estado" AS ENUM ('NUEVO', 'USADO');

-- CreateTable
CREATE TABLE "Producto" (
    "id" TEXT NOT NULL,
    "modelo" TEXT NOT NULL,
    "categoria" "Categoria" NOT NULL,
    "estado" "Estado" NOT NULL,
    "color" TEXT,
    "memoria" TEXT,
    "bateria" TEXT,
    "precioCosto" DOUBLE PRECISION,
    "precioVenta" DOUBLE PRECISION NOT NULL,
    "stock" INTEGER NOT NULL DEFAULT 1,
    "visible" BOOLEAN NOT NULL DEFAULT true,
    "imagen" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Producto_pkey" PRIMARY KEY ("id")
);
