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

Tarea Bautista 2 — Buscador, categorías y páginas de ventas
Qué se hizo

Se completó el pedido de agregar buscador y categorías al stock, y de separar las ventas en dos secciones (equipos y accesorios).

Archivos tocados
src/app/admin/stock/StockList.tsx — se agregó buscador por modelo y tarjetas de categoría con el total de cada una
src/app/admin/ventas-equipos/page.tsx — nuevo
src/app/admin/ventas-accesorios/page.tsx — nuevo
Qué tiene
Buscador que filtra la lista de stock por nombre del modelo, en tiempo real
5 tarjetas (iPhone, Mac, iPad, Accesorios, Otros) que muestran cuántos productos disponibles hay en cada categoría
Al clickear una tarjeta, la lista de abajo se filtra mostrando solo esa categoría
/admin/ventas-equipos: junta todo lo vendido de iPhone, Mac e iPad, con el total en USD
/admin/ventas-accesorios: junta todo lo vendido de Accesorios y Otros, con el total en USD
Sobre restar del stock al marcar vendido

No hizo falta tocar la base de datos para esto. La función cambiarEstadoVendido (ya existente en actions.ts) pone stock: 0 y visible: false al marcar un producto como vendido. Los totales de las tarjetas y las páginas de ventas ya excluyen automáticamente esos productos, así que la resta pasa sola.

Cómo se probó

Sin acceso todavía al DATABASE_URL real, se armó una página temporal (/admin/test-stock, ya borrada) que le pasaba productos falsos directo al componente StockList para probar el buscador y las tarjetas sin depender de la base de datos.

Pendiente (no es de esta tarea)

Falta que el equipo complete el .env con DATABASE_URL para poder ver y probar todo esto con productos reales en /admin/stock, /admin/ventas-equipos y /admin/ventas-accesorios.

Estado

Completo y probado (con datos falsos). Falta la prueba final con datos reales, que depende del .env.