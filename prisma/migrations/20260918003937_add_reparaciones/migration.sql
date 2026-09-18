-- CreateEnum
CREATE TYPE "EstadoReparacion" AS ENUM ('PENDIENTE', 'ENTREGADO');

-- CreateTable
CREATE TABLE "Reparacion" (
    "id" TEXT NOT NULL,
    "nombreCliente" TEXT NOT NULL,
    "telefono" TEXT NOT NULL,
    "email" TEXT,
    "dispositivo" TEXT NOT NULL,
    "fechaIngreso" TIMESTAMP(3) NOT NULL,
    "cobro" DOUBLE PRECISION,
    "costoRepuestos" DOUBLE PRECISION,
    "descripcion" TEXT,
    "estado" "EstadoReparacion" NOT NULL DEFAULT 'PENDIENTE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Reparacion_pkey" PRIMARY KEY ("id")
);
