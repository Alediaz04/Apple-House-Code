# 📝 Resumen de Cambios — Sesión de Trabajo (Apple House Admin)

**Fecha:** 18 de Septiembre, 2026  
**Proyecto:** Apple House — Sistema de Gestión de Stock y Ventas

---

## 🚀 Resumen Ejecutivo

En esta sesión de trabajo se transformó la arquitectura de administración de stock y ventas de Apple House, añadiendo un control financiero integral (**Costo**, **Precio Venta**, **Ganancia Neta**), gestión multimoneda (**USD** / **ARS**), diferenciación entre **Ventas Equipos** y **Ventas Accesorios**, edición/eliminación de ventas registradas con ajuste automático de stock, y un sistema avanzado de filtrado por rango de fechas con botón explícito de búsqueda.

---

## ✨ Funcionalidades y Mejoras Implementadas

### 1. ⚙️ Sincronización y Regeneración del Cliente de Prisma
- **Problema resuelto:** Se solucionó el error de TypeScript `Property 'venta' does not exist on type 'PrismaClient'`.
- **Acción:** Se ejecutaron `npx prisma generate` y `npx prisma db push` para actualizar los tipos de `@prisma/client` y la tabla `Venta` en la base de datos de PostgreSQL/Supabase.

### 2. 🛍️ Modal para Registrar Ventas desde Inventario (`VentaModal.tsx`)
- Al hacer clic en **"Marcar como vendido"** en la sección de Stock, ya no se resta todo el stock a 0 automáticamente.
- Se abre un modal flotante ([VentaModal.tsx](file:///c:/Users/Alejandro/Desktop/Apple-house-pipo/apple-house-code/apple-house/src/app/admin/stock/VentaModal.tsx)) que permite seleccionar la **cantidad a vender**.
- **Validaciones**:
  - No permite vender números negativos ni cero (mínimo 1).
  - No permite superar el stock disponible del producto (máximo `p.stock`).
  - Muestra en vivo el precio unitario y el total estimado.
  - Descuenta únicamente las unidades vendidas y crea el registro en la tabla `Venta`.

### 3. ⌨️ Solución de Cero Inicial en Campos Numéricos
- Se corrigió el problema donde al borrar el valor de un campo numérico controlado (para tipear un valor como `10`) quedaba un cero inicial transformándose en `010`.
- Se configuró el estado local como `number | ""` para permitir campos limpios al escribir.

### 4. 💱 Soporte Multimoneda Completo (`USD` / `ARS`)
- **Edición de producto** ([EditModal.tsx](file:///c:/Users/Alejandro/Desktop/Apple-house-pipo/apple-house-code/apple-house/src/app/admin/stock/EditModal.tsx)): Se agregó el selector de moneda (`USD` / `ARS`), actualizando las etiquetas de precio dinámicamente (`Precio Venta (ARS)` o `Precio Venta (USD)`).
- **Lista de Stock y Tienda Pública**: Se formaten los precios mostrando la moneda del producto (ej: `ARS $10.000` o `USD $800`).
- **Acción Server**: `editarProducto` actualiza la moneda en la base de datos.

### 5. 🗂️ Separación de Paneles: Ventas Equipos vs. Ventas Accesorios
- **Ventas Equipos** ([/admin/ventas](file:///c:/Users/Alejandro/Desktop/Apple-house-pipo/apple-house-code/apple-house/src/app/admin/ventas/page.tsx) y [/admin/ventas-equipos](file:///c:/Users/Alejandro/Desktop/Apple-house-pipo/apple-house-code/apple-house/src/app/admin/ventas-equipos/page.tsx)):
  - Agrupa productos y ventas en **USD** de las categorías **IPHONE**, **MAC**, **IPAD** y **PLAY**.
- **Ventas Accesorios** ([/admin/ventas-accesorios](file:///c:/Users/Alejandro/Desktop/Apple-house-pipo/apple-house-code/apple-house/src/app/admin/ventas-accesorios/page.tsx)):
  - Agrupa productos y ventas realizadas en **ARS (Pesos)** **O** pertenecientes a las categorías **ACCESORIOS**, **FUNDAS** y **OTROS**.
  - Muestra todos los valores formateados en **`ARS $`**.

### 6. ✏️ Edición y Eliminación de Ventas Registradas
- **Edición** ([EditVentaModal.tsx](file:///c:/Users/Alejandro/Desktop/Apple-house-pipo/apple-house-code/apple-house/src/app/admin/ventas/EditVentaModal.tsx)):
  - Permite modificar la **cantidad**, el **precio unitario** y la **fecha/hora** (`datetime-local`) de una venta.
  - Calcula la diferencia de cantidad y **reajusta el stock** del producto automáticamente en la base de datos.
- **Eliminación**:
  - Modal de confirmación para eliminar registros de venta.
  - Al eliminar una venta, **se devuelve automáticamente la cantidad vendida al stock del inventario**.

### 7. 📊 Desglose Financiero y Métricas Neta
- **Cabecera de Resumen**: 3 tarjetas de métricas globales (**Total Ventas**, **Costo Total** y **Ganancia Neta**).
- **Tarjetas de Ventas Concretadas**: Cada registro muestra:
  - **Precio Unitario**
  - **Total Venta**
  - **Costo Total** (`precioCosto * cantidad`)
  - **Ganancia Neta** (destacada en color verde `#4ade80`).

### 8. 📅 Filtro de Fechas y Rango Personalizado con Botón de Búsqueda
- Selector de períodos en la cabecera:
  - **Todas las ventas**
  - **Hoy**
  - **Ayer**
  - **Últimos 7 días**
  - **Este mes**
  - **Rango personalizado…** (Abre entradas `Desde` y `Hasta`).
- **Botón explícito `🔍 Realizar búsqueda`**: Permite elegir fechas sin que la interfaz parpadee o re-calcule hasta presionar el botón.
- Botón **`Limpiar rango`** para restablecer la vista.

### 9. 🔐 Autenticación y Protección de Rutas con Supabase Auth
- **Middleware de Sesión** ([src/lib/supabase/middleware.ts](file:///c:/Users/Alejandro/Desktop/Apple-house-pipo/apple-house-code/apple-house/src/lib/supabase/middleware.ts) y [src/middleware.ts](file:///c:/Users/Alejandro/Desktop/Apple-house-pipo/apple-house-code/apple-house/src/middleware.ts)):
  - Implementación de `updateSession` mediante `@supabase/ssr` para verificar y mantener activa la sesión utilizando cookies.
  - Protección automática de todas las rutas `/admin/*`: si un usuario no autenticado intenta ingresar a cualquier subruta de administración, es redirigido a `/admin/login`. Si un usuario con sesión activa ingresa a `/admin/login`, es redirigido directamente al panel.

### 10. 🚪 Cierre de Sesión (Logout) desde el Panel de Control Administrador
- **Acción Server `cerrarSesion`** ([src/app/admin/login/actions.ts](file:///c:/Users/Alejandro/Desktop/Apple-house-pipo/apple-house-code/apple-house/src/app/admin/login/actions.ts)):
  - Función de servidor que ejecuta `supabase.auth.signOut()` para destruir la sesión y redirigir al login.
- **Menú de Perfil Desplegable** ([AdminSidebar.tsx](file:///c:/Users/Alejandro/Desktop/Apple-house-pipo/apple-house-code/apple-house/src/components/AdminSidebar.tsx)):
  - Se convirtió el pie de la barra lateral (`admin-sidebar-footer`) en un botón desplegable con indicador de flecha (chevron).
  - Al presionar el perfil del usuario, se abre un popover flotante con la opción **"Cerrar sesión"** (con icono de salida y estado interactivo `Cerrando sesión...`).
  - Incluye cierre automático al hacer clic en cualquier parte fuera del menú (`click-outside`).
- **Estilos Estéticos** ([globals.css](file:///c:/Users/Alejandro/Desktop/Apple-house-pipo/apple-house-code/apple-house/src/app/globals.css)):
  - Animación suave `adminMenuFadeIn`, bordes con efecto cristal e integración visual con el tema oscuro del panel.

---

## 📁 Archivos Modificados y Creados

| Archivo | Tipo | Descripción de Cambios |
| :--- | :---: | :--- |
| [src/app/admin/stock/actions.ts](file:///c:/Users/Alejandro/Desktop/Apple-house-pipo/apple-house-code/apple-house/src/app/admin/stock/actions.ts) | Modificado | Agregado de `registrarVentaStock`, actualización de `editarProducto` para validar `stock` y `moneda`, y revalidación de rutas de ventas. |
| [src/app/admin/stock/EditModal.tsx](file:///c:/Users/Alejandro/Desktop/Apple-house-pipo/apple-house-code/apple-house/src/app/admin/stock/EditModal.tsx) | Modificado | Incorporación de campo **Cantidad en Stock** y selector de **Moneda** (`USD`/`ARS`) con etiquetas dinámicas. |
| [src/app/admin/stock/VentaModal.tsx](file:///c:/Users/Alejandro/Desktop/Apple-house-pipo/apple-house-code/apple-house/src/app/admin/stock/VentaModal.tsx) | **Nuevo** | Modal para ingresar cantidad a vender desde la lista de stock con validaciones y formateo de monedas. |
| [src/app/admin/stock/StockList.tsx](file:///c:/Users/Alejandro/Desktop/Apple-house-pipo/apple-house-code/apple-house/src/app/admin/stock/StockList.tsx) | Modificado | Integración de `VentaModal` al presionar "Marcar como vendido" y formateo de precios con moneda del producto. |
| [src/app/admin/ventas/actions.ts](file:///c:/Users/Alejandro/Desktop/Apple-house-pipo/apple-house-code/apple-house/src/app/admin/ventas/actions.ts) | Modificado | Implementación de Server Actions `editarVenta` (con ajuste diferencial de stock) y `eliminarVenta` (con devolución de stock). |
| [src/app/admin/ventas/EditVentaModal.tsx](file:///c:/Users/Alejandro/Desktop/Apple-house-pipo/apple-house-code/apple-house/src/app/admin/ventas/EditVentaModal.tsx) | **Nuevo** | Modal para editar ventas concretadas (cantidad, precio unitario, fecha/hora) con vista previa financiera en vivo. |
| [src/app/admin/ventas/VentasPanel.tsx](file:///c:/Users/Alejandro/Desktop/Apple-house-pipo/apple-house-code/apple-house/src/app/admin/ventas/VentasPanel.tsx) | Modificado | Rediseño estético completo del panel reutilizable, desglose financiero (Costo, Venta, Ganancia Neta), selector de períodos por fecha, rango personalizado con botón **Realizar búsqueda** y acciones de edición/eliminación. |
| [src/app/admin/ventas/page.tsx](file:///c:/Users/Alejandro/Desktop/Apple-house-pipo/apple-house-code/apple-house/src/app/admin/ventas/page.tsx) | Modificado | Configuración para **Ventas — Equipos** (filtra USD y categorías IPHONE, MAC, IPAD, PLAY). |
| [src/app/admin/ventas-equipos/page.tsx](file:///c:/Users/Alejandro/Desktop/Apple-house-pipo/apple-house-code/apple-house/src/app/admin/ventas-equipos/page.tsx) | Modificado | Re-exportación de la página principal de Ventas Equipos para la ruta `/admin/ventas-equipos`. |
| [src/app/admin/ventas-accesorios/page.tsx](file:///c:/Users/Alejandro/Desktop/Apple-house-pipo/apple-house-code/apple-house/src/app/admin/ventas-accesorios/page.tsx) | Modificado | Panel para **Ventas — Accesorios** (filtra ventas ARS o categorías ACCESORIOS, FUNDAS, OTROS) pasando `monedaForzada="ARS"`. |
| [src/app/admin/login/actions.ts](file:///c:/Users/Alejandro/Desktop/Apple-house-pipo/apple-house-code/apple-house/src/app/admin/login/actions.ts) | Modificado | Agregado de Server Action `cerrarSesion` con `supabase.auth.signOut()` y redirección a `/admin/login`. |
| [src/components/AdminSidebar.tsx](file:///c:/Users/Alejandro/Desktop/Apple-house-pipo/apple-house-code/apple-house/src/components/AdminSidebar.tsx) | Modificado | Implementación de tarjeta desplegable en el perfil de usuario con la opción "Cerrar sesión", indicador chevron y detector click-outside. |
| [src/middleware.ts](file:///c:/Users/Alejandro/Desktop/Apple-house-pipo/apple-house-code/apple-house/src/middleware.ts) | **Nuevo** | Middleware global de Next.js para actualizar sesión y proteger rutas `/admin/*`. |
| [src/lib/supabase/middleware.ts](file:///c:/Users/Alejandro/Desktop/Apple-house-pipo/apple-house-code/apple-house/src/lib/supabase/middleware.ts) | **Nuevo** | Helper con `@supabase/ssr` para verificar cookies de sesión y redireccionar usuarios sin autenticar. |
| [src/lib/supabase/server.ts](file:///c:/Users/Alejandro/Desktop/Apple-house-pipo/apple-house-code/apple-house/src/lib/supabase/server.ts) | **Nuevo** | Cliente Supabase para Next.js Server Components y Server Actions. |
| [src/lib/products.ts](file:///c:/Users/Alejandro/Desktop/Apple-house-pipo/apple-house-code/apple-house/src/lib/products.ts) | Modificado | Agregado de propiedad `moneda` a la interfaz y mapeo desde la base de datos en `getProductosDb()`. |
| [src/components/Stock.tsx](file:///c:/Users/Alejandro/Desktop/Apple-house-pipo/apple-house-code/apple-house/src/components/Stock.tsx) | Modificado | Formateo dinámico de moneda en la vista pública de stock y en los mensajes automáticos de WhatsApp. |
| [src/app/globals.css](file:///c:/Users/Alejandro/Desktop/Apple-house-pipo/apple-house-code/apple-house/src/app/globals.css) | Modificado | Incorporación de estilos para el menú emergente de usuario, botones de logout, animaciones e interacción visual. |

---

## 🛠️ Verificación y Compilación

- **Pruebas compilación**: Se ejecutó `npx tsc --noEmit` de manera exitosa con **0 errores de TypeScript**.
- **Control de versiones**: Todos los archivos creados y modificados fueron verificados y agregados al área de preparación de Git (`git add .`).