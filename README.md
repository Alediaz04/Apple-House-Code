# Apple House - E-Commerce & Inventory Management

Apple House es una aplicación web híbrida diseñada para gestionar las ventas, reparaciones y el inventario de un negocio de dispositivos Apple, ofreciendo a su vez una vidriera pública atractiva para los clientes.

Actualmente, el proyecto se encuentra en su **Fase 1 (Prototipo Frontend)**. Funciona como una landing page dinámica y un catálogo con datos estáticos (hardcodeados), optimizado para SEO y alta velocidad de carga. 

La **Fase 2** transformará esta interfaz en una aplicación de gestión completa con base de datos real, panel de administración y control de stock en tiempo real.

## 🚀 Tecnologías (Stack Actual)

El frontend está construido con tecnologías modernas para garantizar rendimiento y escalabilidad:

*   **Framework:** [Next.js 15](https://nextjs.org/) (App Router)
*   **Lenguaje:** [TypeScript](https://www.typescriptlang.org/)
*   **Estilos:** [Tailwind CSS](https://tailwindcss.com/)
*   **Componentes Adicionales:** Lucide React (Iconos), Embla Carousel (Carrusel de reseñas).

*(En el futuro se integrarán PostgreSQL y Supabase/NextAuth para el backend).*

## 📁 Estructura del Proyecto

```text
apple-house/
├── public/                 # Assets estáticos (imágenes, iconos, logos)
├── src/
│   ├── app/                # Rutas de Next.js (App Router)
│   │   ├── favicon.ico
│   │   ├── globals.css     # Estilos globales y utilidades personalizadas
│   │   ├── layout.tsx      # Estructura principal del documento
│   │   └── page.tsx        # Landing page principal
│   ├── components/         # Componentes reutilizables de UI
│   │   ├── About.tsx
│   │   ├── Contact.tsx
│   │   ├── Footer.tsx
│   │   ├── Header.tsx
│   │   ├── Hero.tsx
│   │   ├── Reviews.tsx         # Sección de reseñas (Server Component)
│   │   ├── ReviewsCarousel.tsx # Lógica del slider de reseñas (Client Component)
│   │   ├── Service.tsx
│   │   ├── Stock.tsx           # Catálogo de productos
│   │   ├── WaIcon.tsx
│   │   └── WhyUs.tsx
│   └── lib/                # Lógica de negocio y utilidades
│       └── products.ts     # Mock data actual del catálogo
```

# Pasos

1. **Clonar el repositorio*
   

2. **Instalar las dependencias:**
   ```bash
   npm install
   ```
   
3. **Ejecutar el servidor de desarrollo:**
   ```bash
   npm run dev
   ```

4. **Abrir la aplicación:**
   
