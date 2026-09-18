

# Módulo de Reparaciones

## Responsable

Ramiro

## Estado

✅ COMPLETADO Y PROBADO

El módulo de Reparaciones fue implementado de punta a punta:
base de datos, Prisma, Server Actions, formulario, listado,
edición, estados, eliminación, estadísticas y filtros por fecha.

También se realizó una prueba de compilación de producción
con `npm.cmd run build`, la cual finalizó correctamente.

---

# 1. Objetivo

Crear un panel de administración para registrar y gestionar
las reparaciones realizadas en Apple House.

El módulo permite:

- Registrar reparaciones.
- Consultar reparaciones existentes.
- Editar reparaciones.
- Cambiar el estado entre pendiente y entregado.
- Eliminar reparaciones.
- Consultar estadísticas económicas.
- Filtrar las reparaciones por períodos de tiempo.
- Utilizar rangos de fechas personalizados.

Ruta principal:

`/admin/reparaciones`

---

# 2. Estructura del módulo

El módulo está ubicado en:

`src/app/admin/reparaciones/`

Archivos principales:

```text
src/app/admin/reparaciones/
├── actions.ts
├── page.tsx
├── ReparacionForm.tsx
├── ReparacionesList.tsx
└── FiltroFecha.tsx
3. Base de datos

Se agregó el modelo Reparacion a:

prisma/schema.prisma

Modelo:

model Reparacion {
  id             String           @id @default(cuid())
  nombreCliente  String
  telefono       String
  email          String?
  dispositivo    String
  fechaIngreso   DateTime
  cobro          Float?
  costoRepuestos Float?
  descripcion    String?
  estado         EstadoReparacion @default(PENDIENTE)
  createdAt      DateTime         @default(now())
  updatedAt      DateTime         @updatedAt
}

También se agregó:

enum EstadoReparacion {
  PENDIENTE
  ENTREGADO
}
Campos
Campo	Tipo	Obligatorio
id	String	Sí
nombreCliente	String	Sí
telefono	String	Sí
email	String	No
dispositivo	String	Sí
fechaIngreso	DateTime	Sí
cobro	Float	No
costoRepuestos	Float	No
descripcion	String	No
estado	EstadoReparacion	Sí
createdAt	DateTime	Automático
updatedAt	DateTime	Automático

El estado inicial de una reparación es:

PENDIENTE

4. Migración de base de datos

Se creó la migración:

20260918003937_add_reparaciones

La migración agrega:

Enum EstadoReparacion
Tabla Reparacion
Relaciones necesarias del modelo
Importante: base de datos compartida

La base de datos de Supabase es compartida con el resto del equipo.

Durante el desarrollo se detectó que la migración de Reparaciones
figuraba en el historial de Prisma, pero la tabla Reparacion
todavía no existía físicamente en la base.

Por ese motivo se realizó la creación correspondiente de la estructura
faltante directamente en la base de datos.

MUY IMPORTANTE

No ejecutar sobre la base compartida sin verificar:

prisma migrate reset
prisma db push

ni otros comandos que puedan modificar o eliminar estructuras
de otros integrantes.

Antes de realizar cambios importantes en Prisma se debe revisar
el estado de la base y coordinar con el equipo.

5. Formulario de registro

Archivo:

src/app/admin/reparaciones/ReparacionForm.tsx

Permite registrar:

Nombre del cliente
Teléfono
Email
Dispositivo
Fecha de ingreso
Cobro
Costo de repuestos
Descripción

Los campos obligatorios son:

Nombre
Teléfono
Dispositivo
Fecha de ingreso

Los demás son opcionales.

6. Validaciones

Las validaciones principales se realizan en el servidor.

Archivo:

src/app/admin/reparaciones/actions.ts

Se valida:

Cliente

El nombre no puede estar vacío.

Teléfono

El teléfono es obligatorio.

Dispositivo

El dispositivo es obligatorio.

Fecha

La fecha debe existir y ser válida.

Cobro

Si se proporciona:

Debe ser numérico.
Debe ser mayor o igual a 0.
Costo de repuestos

Si se proporciona:

Debe ser numérico.
Debe ser mayor o igual a 0.
7. Server Actions

Archivo:

src/app/admin/reparaciones/actions.ts

El módulo utiliza Server Actions para modificar los datos.

Funciones implementadas:

crearReparacion()
editarReparacion()
cambiarEstadoReparacion()
eliminarReparacion()

Después de las operaciones se utiliza:

revalidatePath("/admin/reparaciones");

para actualizar los datos mostrados en el panel.

8. Corrección importante de zona horaria

Durante las pruebas se detectó un problema con las fechas.

El campo:

<input type="date">

devuelve fechas con formato:

YYYY-MM-DD

Anteriormente se utilizaba:

new Date(fechaIngresoRaw)

Esto podía interpretar la fecha como UTC.

Por ejemplo:

2026-09-18

podía terminar representándose en Argentina como una hora
del día anterior.

Esto provocaba que una reparación seleccionada para el día actual
apareciera registrada como el día anterior.

Solución

Se agregó:

function convertirFechaLocal(fecha: string) {
  const [year, month, day] = fecha.split("-").map(Number);

  return new Date(year, month - 1, day);
}

Ahora tanto al crear como al editar se utiliza:

const fechaIngreso = convertirFechaLocal(fechaIngresoRaw);

Esto evita la conversión incorrecta de la fecha.

NO reemplazar nuevamente por:
new Date(fechaIngresoRaw)

porque se puede volver a introducir el problema de zona horaria.

9. Listado de reparaciones

Archivo:

src/app/admin/reparaciones/ReparacionesList.tsx

Cada reparación muestra:

Cliente
Dispositivo
Teléfono
Email
Fecha de ingreso
Cobro
Costo de repuestos
Descripción
Estado

Las reparaciones se muestran ordenadas por:

fechaIngreso: "desc"

por lo que las más recientes aparecen primero.

10. Menú de acciones

Cada reparación tiene un menú individual.

Acciones disponibles:

Editar reparación

Abre un formulario de edición.

Marcar como entregada

Cambia:

PENDIENTE → ENTREGADO
Marcar como pendiente

Permite volver a:

ENTREGADO → PENDIENTE
Eliminar reparación

Abre una confirmación antes de eliminar.

11. Edición

La edición se realiza desde el menú de cada reparación.

Se pueden modificar todos los datos:

Cliente
Teléfono
Email
Dispositivo
Fecha
Cobro
Costo de repuestos
Descripción

La edición utiliza la misma Server Action:

editarReparacion()

y también utiliza:

convertirFechaLocal()

para evitar problemas de zona horaria.

12. Estados

Los estados disponibles son:

PENDIENTE
ENTREGADO

Toda reparación nueva comienza automáticamente como:

PENDIENTE

El estado puede cambiarse desde el menú de acciones.

13. Eliminación

La eliminación requiere confirmación.

Esto evita que una reparación sea eliminada accidentalmente.

La operación utiliza:

eliminarReparacion()
14. Estadísticas

En la parte superior del panel se muestran tres tarjetas.

Facturado total

Suma todos los valores de:

cobro

de las reparaciones incluidas en el período seleccionado.

Los valores nulos se consideran 0.

Costo de repuestos

Suma:

costoRepuestos

de las reparaciones incluidas en el período.

Ganancia

Se calcula:

Ganancia = Facturado total - Costo de repuestos
15. Filtros de fecha

Archivo:

src/app/admin/reparaciones/FiltroFecha.tsx

Opciones:

Todas
Hoy
Esta semana
Este mes
Personalizado
Hoy

Muestra únicamente las reparaciones correspondientes al día actual.

Semana

Utiliza la semana actual comenzando el lunes.

Mes

Utiliza el mes calendario actual.

Personalizado

Permite elegir:

Desde
Hasta

y aplicar el rango mediante:

Aplicar rango

Los campos de fecha utilizan estado local para evitar que el componente
se actualice mientras el usuario escribe una fecha.

Esto fue importante porque anteriormente el campo podía reiniciarse
durante la escritura del año.

16. Parámetros de URL

El filtro utiliza parámetros de búsqueda:

rango
desde
hasta

Ejemplos conceptuales:

?rango=hoy
?rango=semana
?rango=mes

Para un rango personalizado:

?rango=personalizado&desde=YYYY-MM-DD&hasta=YYYY-MM-DD

La página utiliza estos parámetros para determinar qué reparaciones
consultar.

17. Consulta de reparaciones

En:

page.tsx

se consulta Prisma:

prisma.reparacion.findMany()

Cuando existe un rango de fechas se aplica:

fechaIngreso: {
  gte: desde,
  lt: hasta,
}

El límite superior se maneja como el comienzo del día siguiente.

Esto permite incluir correctamente todas las reparaciones del día final
seleccionado.

18. Formato de dinero

Las estadísticas utilizan:

Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  maximumFractionDigits: 0,
});

Los importes de las reparaciones actualmente se muestran en el listado
con formato:

USD $X.XX

La representación visual de los importes del listado y de las estadísticas
debe mantenerse coherente con la moneda que finalmente utilice el sistema
de ventas/reparaciones.

19. Diseño / interfaz

El panel utiliza el sistema visual existente del administrador.

Se agregaron:

Tarjetas de estadísticas
Selector de período
Rango personalizado
Botón de aplicación del rango
Tarjetas individuales para reparaciones
Menú de acciones
Modal de edición
Modal de confirmación de eliminación
Estados visuales para pendiente/entregado

El layout de estadísticas utiliza:

gridTemplateColumns:
  "repeat(auto-fit, minmax(220px, 1fr))"

para que las tres tarjetas puedan adaptarse al ancho disponible.

20. Problemas encontrados y solucionados

Durante el desarrollo se encontraron varios problemas.

Problema 1 — tabla de Reparaciones inexistente

La migración aparecía registrada pero la estructura no estaba disponible
correctamente en la base compartida.

Se creó la estructura faltante.

Problema 2 — codificación UTF-8

Uno de los archivos nuevos tenía un problema de codificación.

Se convirtió el archivo a UTF-8 sin BOM.

Problema 3 — dependencia faltante

El proyecto necesitaba:

@supabase/ssr

Se instaló la dependencia para permitir la compilación correcta.

Problema 4 — opciones del selector ilegibles

Las opciones del selector de período aparecían con texto blanco sobre
fondo blanco.

Se ajustaron los estilos de las opciones para mantener contraste.

Problema 5 — fecha personalizada que se reiniciaba

Al escribir manualmente una fecha personalizada, el componente podía
actualizarse antes de terminar de escribir.

Se agregó estado local para:

desde
hasta

y el cambio se aplica solamente cuando se presiona:

Aplicar rango
Problema 6 — fechas guardadas como el día anterior

Se solucionó mediante:

convertirFechaLocal()

para evitar la interpretación UTC de los valores provenientes
de input type="date".

Problema 7 — tarjetas de estadísticas desbordadas

Las tres tarjetas inicialmente no entraban correctamente en el ancho
disponible.

Se modificó el grid para utilizar columnas adaptables:

repeat(auto-fit, minmax(220px, 1fr))
21. Dependencia instalada

Durante la implementación fue necesario instalar:

@supabase/ssr

No ejecutar automáticamente:

npm audit fix --force

sobre este proyecto sin revisar primero los cambios, porque puede introducir
actualizaciones incompatibles.

22. Build final

Se ejecutó:

npm.cmd run build

Resultado:

✓ Compiled successfully
✓ Finished TypeScript
✓ Collecting page data
✓ Generating static pages
✓ Finalizing page optimization

La ruta:

/admin/reparaciones

se generó correctamente como página dinámica.

Existe una advertencia relacionada con metadataBase de Next.js:

metadataBase property in metadata export is not set

Esta advertencia no está relacionada con Reparaciones y no impide
la compilación.

23. Pruebas realizadas

Se probaron:

✅ Crear reparación
✅ Crear reparación con fecha de hoy
✅ Editar reparación
✅ Editar reparación con fecha de hoy
✅ Verificar que la fecha no retroceda un día
✅ Cambiar a entregada
✅ Volver a pendiente
✅ Eliminar
✅ Confirmación de eliminación
✅ Estadísticas
✅ Filtro de hoy
✅ Filtro semanal
✅ Filtro mensual
✅ Rango personalizado
✅ Compilación de producción
24. División de responsabilidades
Ramiro

Responsable de:

Panel de Reparaciones
Formulario
CRUD de reparaciones
Estados
Estadísticas
Filtros
Fechas de reparaciones
Joaco

Responsable de:

Ventas de equipos
Descuento de stock
Productos vendidos
Categorías Play y Fundas
Bauti

Responsable de:

Buscador de stock
Categorías
Totales por categoría
Descuento de stock
Integración con Ventas equipos
Integración con Ventas accesorios
25. Requisito general de fechas en Ventas

Existe un requisito general del proyecto:

Todas las ventas deben registrar la fecha.

La implementación correspondiente pertenece al flujo de Ventas/Stock
asignado a Joaco y Bauti.

El módulo de Reparaciones ya registra obligatoriamente:

fechaIngreso

y utiliza esa fecha para los filtros y estadísticas.

Si se modifica el módulo de Ventas, se debe coordinar con los responsables
de ese módulo para evitar conflictos con los cambios de la base compartida.

26. Recomendaciones para futuros cambios

Antes de modificar Reparaciones:

Revisar prisma/schema.prisma.
Revisar actions.ts.
Revisar cómo se manejan las fechas.
Mantener convertirFechaLocal() para fechas provenientes de
input type="date".
No utilizar directamente new Date("YYYY-MM-DD") para guardar
fechas seleccionadas por el usuario.
Ejecutar:
npm.cmd run build

después de cambios importantes.

No ejecutar comandos destructivos de Prisma sobre la base compartida
sin verificar primero el estado de la base.
27. Resumen técnico

El módulo de Reparaciones quedó implementado con:

Next.js
React
TypeScript
Prisma
Supabase/PostgreSQL
Server Actions

Arquitectura:

Usuario
   ↓
/admin/reparaciones
   ↓
page.tsx
   ↓
ReparacionForm / ReparacionesList / FiltroFecha
   ↓
Server Actions
   ↓
Prisma
   ↓
Supabase / PostgreSQL

La fecha de ingreso se almacena como DateTime en PostgreSQL,
pero las fechas provenientes de formularios HTML se convierten
explícitamente a fecha local antes de guardarlas.
