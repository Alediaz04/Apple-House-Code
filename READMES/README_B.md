Tarea Bautista — Menú lateral del panel admin

Se completó el componente AdminSidebar.tsx (ya existía una base hecha por otro compañero, se tomó esa y se terminó en vez de duplicarla).

Qué tiene
Links a: Stock, Ventas equipos, Ventas accesorios, Reparaciones y Estadísticas (esta última deshabilitada, "Próximamente")
Resalta el link activo según la página en la que estás
Botón hamburguesa que abre y cierra el menú en celular
No se muestra en /admin/login
Archivos tocados
src/components/AdminSidebar.tsx
src/app/globals.css (bloque nuevo al final, para el responsive)
src/app/admin/layout.tsx (ya existía, no se tocó)
Cómo probarlo

Rutas como /admin/stock todavía no cargan porque falta la conexión a la base de datos (tema de otra tarea). Para ver el sidebar andando bien, entrar a /admin/login.

Estado

Completo y probado en desktop y celular.