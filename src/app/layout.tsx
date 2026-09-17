import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Apple House — Ciudad, Mendoza",
  description:
    "Venta de iPhone, Mac, iPad y accesorios nuevos y usados en Mendoza. Service técnico propio, garantía de 30 días en equipos usados.",
  openGraph: {
    title: "Apple House — Ciudad, Mendoza",
    description:
      "iPhone, Mac, iPad y accesorios nuevos y usados. Service técnico propio en el local, 9 de Julio 1063.",
    url: "https://applehouse.com.ar", // reemplazar por el dominio real cuando lo tengan
    siteName: "Apple House",
    images: [
      {
        url: "/logo.png",
        width: 512,
        height: 512,
        alt: "Apple House Mendoza",
      },
    ],
    locale: "es_AR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es-AR">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
