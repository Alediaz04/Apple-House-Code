# Módulo de Reparaciones

## Responsable

**Ramiro**

## Estado

**COMPLETADO Y PROBADO**

---

# 1. Objetivo del módulo

El objetivo de este módulo es incorporar un panel de administración para gestionar las reparaciones realizadas en Apple House.

El módulo permite registrar una reparación, consultar las reparaciones existentes, modificar sus datos, cambiar su estado, eliminar registros y consultar información económica mediante estadísticas y filtros de fecha.

La funcionalidad fue desarrollada utilizando:

- Next.js
- React
- TypeScript
- Prisma
- PostgreSQL
- Server Actions

---

# 2. Funcionalidades implementadas

El módulo permite realizar las siguientes operaciones:

- Crear una nueva reparación.
- Consultar las reparaciones registradas.
- Editar los datos de una reparación.
- Marcar una reparación como entregada.
- Volver una reparación al estado pendiente.
- Eliminar una reparación.
- Registrar la fecha de ingreso.
- Registrar el cobro realizado.
- Registrar el costo de los repuestos.
- Calcular el total facturado.
- Calcular el costo total de repuestos.
- Calcular la ganancia.
- Filtrar las estadísticas por período.
- Consultar todas las reparaciones.
- Consultar las reparaciones del día.
- Consultar las reparaciones de la semana.
- Consultar las reparaciones del mes.
- Consultar un rango de fechas personalizado.

---

# 3. Estructura del módulo

El módulo se encuentra dentro de:

`src/app/admin/reparaciones/`

La estructura principal es:

```text
src/
└── app/
    └── admin/
        └── reparaciones/
            ├── actions.ts
            ├── FiltroFecha.tsx
            ├── page.tsx
            ├── ReparacionForm.tsx
            └── ReparacionesList.tsx
```

Cada archivo tiene una responsabilidad específica dentro del módulo.

---

# 4. `page.tsx`

Archivo:

`src/app/admin/reparaciones/page.tsx`

Este archivo corresponde a la página principal del panel de Reparaciones.

Es responsable de:

- Obtener los parámetros de los filtros.
- Determinar el período seleccionado.
- Consultar las reparaciones mediante Prisma.
- Filtrar las reparaciones por fecha.
- Calcular las estadísticas.
- Formatear los valores monetarios.
- Mostrar el formulario.
- Mostrar los filtros.
- Mostrar las tarjetas de estadísticas.
- Mostrar el listado de reparaciones.

La página utiliza los parámetros recibidos desde la URL para determinar qué período consultar.

Los parámetros utilizados son:

- `rango`
- `desde`
- `hasta`

---

# 5. Formulario de reparaciones

Archivo:

`src/app/admin/reparaciones/ReparacionForm.tsx`

Este componente contiene el formulario utilizado para registrar nuevas reparaciones.

Los campos disponibles son:

| Campo | Obligatorio |
|---|---|
| Nombre del cliente | Sí |
| Número de celular | Sí |
| Email | No |
| Nombre del dispositivo | Sí |
| Fecha de ingreso | Sí |
| Cobro | No |
| Costo de repuestos | No |
| Descripción | No |

El estado de la reparación no se ingresa manualmente al crearla.

La reparación comienza automáticamente con:

`PENDIENTE`

---

# 6. Validaciones del formulario

Las validaciones principales se realizan en el servidor para evitar depender únicamente de las validaciones visuales del navegador.

Se comprueba que estén presentes los campos obligatorios:

- Nombre del cliente.
- Número de celular.
- Dispositivo.
- Fecha de ingreso.

Los campos opcionales pueden quedar vacíos.

Los importes también se convierten a valores numéricos antes de guardarse.

---

# 7. `actions.ts`

Archivo:

`src/app/admin/reparaciones/actions.ts`

Este archivo contiene las Server Actions utilizadas para modificar los datos de Reparaciones.

Las operaciones principales son:

- `crearReparacion`
- `editarReparacion`
- `cambiarEstadoReparacion`
- `eliminarReparacion`

Estas funciones se ejecutan en el servidor y utilizan Prisma para comunicarse con la base de datos.

Después de modificar una reparación, se utiliza la revalidación de la ruta para que el listado vuelva a mostrar los datos actualizados.

---

# 8. Crear una reparación

La función:

`crearReparacion`

recibe los datos enviados desde el formulario.

El proceso realizado es:

1. Obtener los valores del formulario.
2. Limpiar los textos ingresados.
3. Validar los campos obligatorios.
4. Convertir los importes a números.
5. Convertir la fecha correctamente.
6. Crear el registro mediante Prisma.
7. Revalidar la página de Reparaciones.

La reparación creada comienza con el estado:

`PENDIENTE`

---

# 9. Edición de reparaciones

La función:

`editarReparacion`

permite modificar los datos de una reparación existente.

Se pueden modificar datos como:

- Nombre del cliente.
- Número de teléfono.
- Email.
- Dispositivo.
- Fecha de ingreso.
- Cobro.
- Costo de repuestos.
- Descripción.

También se mantienen las validaciones de los campos obligatorios.

---

# 10. Estado de una reparación

Las reparaciones utilizan el enum:

`EstadoReparacion`

con dos posibles valores:

- `PENDIENTE`
- `ENTREGADO`

Cuando una reparación es creada, su estado inicial es:

`PENDIENTE`

Desde el listado se puede cambiar el estado a:

`ENTREGADO`

También se puede volver a cambiar a:

`PENDIENTE`

Esto permite conocer si el equipo continúa en reparación o ya fue entregado al cliente.

---

# 11. Eliminación de reparaciones

La función:

`eliminarReparacion`

permite eliminar una reparación existente.

La eliminación se realiza mediante Prisma y posteriormente se revalida la página para actualizar el listado.

---

# 12. Manejo correcto de fechas

Durante el desarrollo se detectó un problema relacionado con las fechas y las zonas horarias.

El problema aparecía porque una fecha ingresada como:

`YYYY-MM-DD`

podía ser interpretada como una fecha UTC y terminar mostrándose como el día anterior dependiendo de la zona horaria.

Para evitar este problema se utiliza una conversión basada en los componentes de la fecha:

```ts
function convertirFechaLocal(fecha: string) {
  const [year, month, day] = fecha.split("-").map(Number);
  return new Date(year, month - 1, day);
}
```

De esta forma, la fecha se crea utilizando el año, mes y día correspondientes al calendario local.

Esto evita desplazamientos inesperados de fecha.

---

# 13. `ReparacionesList.tsx`

Archivo:

`src/app/admin/reparaciones/ReparacionesList.tsx`

Este componente se encarga de mostrar las reparaciones registradas.

Cada reparación muestra sus datos principales y las acciones disponibles.

Las acciones incluyen:

- Editar.
- Cambiar a entregado.
- Cambiar a pendiente.
- Eliminar.

La edición se realiza desde el propio listado.

---

# 14. Edición desde el listado

Cada reparación tiene acceso a una interfaz de edición.

La edición permite modificar los datos registrados sin necesidad de crear una nueva reparación.

Después de guardar los cambios:

1. Se actualiza el registro en la base de datos.
2. Se revalida la página.
3. El listado vuelve a mostrar los datos actualizados.

---

# 15. `FiltroFecha.tsx`

Archivo:

`src/app/admin/reparaciones/FiltroFecha.tsx`

Este componente permite seleccionar el período utilizado para las estadísticas.

Las opciones disponibles son:

- Todas.
- Hoy.
- Semana.
- Mes.
- Personalizado.

---

# 16. Filtro "Todas"

La opción:

`Todas`

elimina la restricción de fechas.

En este caso se consultan todas las reparaciones registradas.

Las estadísticas representan entonces el total histórico de las reparaciones disponibles.

---

# 17. Filtro "Hoy"

La opción:

`Hoy`

selecciona únicamente las reparaciones cuya fecha de ingreso corresponde al día actual.

El rango utilizado comienza al inicio del día y termina al comienzo del día siguiente.

Esto permite incluir correctamente todas las reparaciones ingresadas durante el día.

---

# 18. Filtro "Semana"

La opción:

`Semana`

calcula la semana actual.

La semana se considera desde el lunes hasta el comienzo del lunes siguiente.

Esto permite consultar las reparaciones ingresadas durante la semana actual.

---

# 19. Filtro "Mes"

La opción:

`Mes`

selecciona el mes actual.

El rango comienza en el primer día del mes y termina en el primer día del mes siguiente.

De esta forma se incluyen todas las reparaciones correspondientes al mes seleccionado.

---

# 20. Filtro personalizado

La opción:

`Personalizado`

permite seleccionar manualmente:

- Fecha desde.
- Fecha hasta.

El usuario puede escribir o seleccionar ambas fechas y luego utilizar el botón:

`Aplicar rango`

El rango se guarda mediante parámetros de URL.

Ejemplo:

```text
/admin/reparaciones?rango=personalizado&desde=2026-02-01&hasta=2026-02-27
```

---

# 21. Parámetros utilizados por los filtros

Los filtros utilizan los siguientes parámetros:

### `rango`

Determina el tipo de período seleccionado.

Ejemplos:

```text
todos
hoy
semana
mes
personalizado
```

### `desde`

Representa la fecha inicial de un rango personalizado.

### `hasta`

Representa la fecha final de un rango personalizado.

Esto permite mantener el período seleccionado mediante la URL.

---

# 22. Estadísticas

En la parte superior del panel se muestran tres tarjetas principales:

1. Facturado total.
2. Costo de repuestos.
3. Ganancia.

Estas estadísticas se calculan utilizando únicamente las reparaciones correspondientes al período seleccionado.

---

# 23. Facturado total

El valor:

`Facturado total`

se obtiene sumando el campo:

`cobro`

de las reparaciones incluidas en el período.

Las reparaciones que no tienen un cobro registrado se consideran con valor cero para el cálculo.

---

# 24. Costo de repuestos

El valor:

`Costo de repuestos`

se obtiene sumando el campo:

`costoRepuestos`

de las reparaciones incluidas en el período.

Los registros que no tienen costo de repuestos se consideran con valor cero.

---

# 25. Ganancia

La ganancia se calcula utilizando:

```text
Ganancia = Facturado total - Costo de repuestos
```

Por lo tanto, el sistema permite conocer el importe restante después de descontar los costos de repuestos registrados.

---

# 26. Consulta de estadísticas

Las estadísticas no utilizan todos los registros cuando existe un filtro de fecha.

Primero se obtiene el conjunto de reparaciones correspondiente al período seleccionado.

Luego se realizan las sumas sobre ese conjunto.

Por ejemplo:

- Si se selecciona "Hoy", las estadísticas corresponden al día actual.
- Si se selecciona "Semana", corresponden a la semana actual.
- Si se selecciona "Mes", corresponden al mes actual.
- Si se selecciona un rango personalizado, corresponden únicamente a ese rango.

---

# 27. Consulta mediante Prisma

La página utiliza Prisma para consultar las reparaciones.

Cuando existe un período:

- `fechaIngreso >= desde`
- `fechaIngreso < hasta`

Esto permite trabajar con límites de fecha claros.

En el caso del rango personalizado, se agrega un día a la fecha final para que el último día seleccionado quede incluido completamente.

---

# 28. Modelo de base de datos

El modelo utilizado es:

```prisma
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
```

---

# 29. Enum de estado

El estado se define mediante:

```prisma
enum EstadoReparacion {
  PENDIENTE
  ENTREGADO
}
```

El valor predeterminado es:

`PENDIENTE`

---

# 30. Campos del modelo

### `id`

Identificador único de la reparación.

### `nombreCliente`

Nombre del cliente que dejó el equipo.

### `telefono`

Número de celular del cliente.

Es obligatorio.

### `email`

Correo electrónico del cliente.

Es opcional.

### `dispositivo`

Equipo ingresado para reparación.

### `fechaIngreso`

Fecha en la que ingresó el equipo.

Es obligatoria y se utiliza también para los filtros estadísticos.

### `cobro`

Importe cobrado por la reparación.

Es opcional.

### `costoRepuestos`

Costo de los repuestos utilizados.

Es opcional.

### `descripcion`

Descripción o información adicional de la reparación.

Es opcional.

### `estado`

Indica si la reparación está pendiente o fue entregada.

### `createdAt`

Fecha de creación del registro.

### `updatedAt`

Fecha de última actualización del registro.

---

# 31. Migración

Se agregó una migración para incorporar la funcionalidad de Reparaciones.

La migración incorpora:

- El enum `EstadoReparacion`.
- La tabla `Reparacion`.
- Las relaciones y campos necesarios para almacenar las reparaciones.

La base de datos utiliza PostgreSQL mediante Prisma.

---

# 32. Base de datos compartida

El proyecto utiliza una base de datos compartida con otros integrantes del equipo.

Por este motivo, se debe evitar realizar operaciones destructivas sobre la base de datos, como:

```text
prisma migrate reset
```

o acciones equivalentes que puedan eliminar información perteneciente a otros módulos.

Antes de realizar cambios estructurales en la base de datos se debe comprobar qué modificaciones fueron realizadas por los demás integrantes.

---

# 33. Formato de dinero

Las tarjetas de estadísticas utilizan `Intl.NumberFormat` para mostrar los importes con formato argentino.

La configuración utilizada permite mostrar los valores como moneda y sin decimales en las estadísticas.

---

# 34. Interfaz

El panel mantiene el estilo general del área administrativa.

La página contiene:

1. Encabezado.
2. Acceso al inventario.
3. Filtro de período.
4. Tres tarjetas de estadísticas.
5. Formulario de nueva reparación.
6. Listado de reparaciones.

Las tarjetas de estadísticas utilizan una distribución adaptable para evitar que se desborden en pantallas pequeñas.

---

# 35. Problemas encontrados y solucionados

Durante el desarrollo se encontraron varios problemas que fueron corregidos.

## Codificación UTF-8

Se detectaron problemas de codificación en archivos que contenían caracteres especiales.

Se realizaron correcciones para evitar caracteres corruptos como:

```text
MÃ³dulo
```

en lugar de:

```text
Módulo
```

---

## Selector de período

Las opciones del selector tenían problemas de contraste en determinados entornos.

Se ajustó la apariencia de las opciones para mantener una lectura correcta.

---

## Rango personalizado

Los campos de fecha personalizados se reiniciaban al escribir determinados valores.

El componente fue adaptado para mantener las fechas en estado local hasta que el usuario presione:

`Aplicar rango`

Esto permite escribir las fechas completas sin que la navegación de la página interrumpa la edición.

---

## Problema de zona horaria

Se detectó que algunas fechas podían mostrarse como el día anterior.

Se solucionó mediante la conversión local de la fecha antes de almacenarla.

---

## Tarjetas de estadísticas

Las tres estadísticas podían ocupar demasiado espacio horizontal.

Se ajustó la distribución para utilizar una cuadrícula adaptable:

- Las tarjetas se distribuyen automáticamente.
- Se mantiene un ancho mínimo.
- En pantallas pequeñas pueden acomodarse en varias filas.

---

# 36. Pruebas realizadas

Se probaron las principales funcionalidades del módulo.

## Crear reparación

Se comprobó que se puede registrar una reparación correctamente.

## Editar reparación

Se comprobó que los datos pueden modificarse y guardarse.

## Cambiar estado

Se comprobó el cambio:

`PENDIENTE → ENTREGADO`

y también:

`ENTREGADO → PENDIENTE`

## Eliminar reparación

Se comprobó que una reparación puede eliminarse.

## Estadísticas

Se comprobaron:

- Facturado total.
- Costo de repuestos.
- Ganancia.

## Filtros

Se probaron:

- Todas.
- Hoy.
- Semana.
- Mes.
- Personalizado.

## Fechas

Se comprobó que las fechas ingresadas no se desplacen al día anterior.

## Compilación

Se realizó una compilación de producción mediante:

```text
npm.cmd run build
```

La compilación finalizó correctamente.

---

# 37. Dependencias y herramientas utilizadas

El módulo utiliza las dependencias ya presentes en el proyecto para:

- Next.js.
- React.
- TypeScript.
- Prisma.
- PostgreSQL.

También se incorporaron las dependencias necesarias para el funcionamiento general de autenticación y acceso a los servicios utilizados por el proyecto cuando correspondía.

---

# 38. Responsabilidad dentro del equipo

La división general de tareas del proyecto fue:

## Ramiro

Responsable del módulo de Reparaciones:

- Panel de Reparaciones.
- Formulario.
- Registro de reparaciones.
- Edición.
- Estados.
- Eliminación.
- Estadísticas.
- Filtros por fecha.
- Manejo de fechas.
- Documentación.

## Joaco

Responsable de las funcionalidades relacionadas con:

- Ventas de equipos.
- Registro de productos vendidos.
- Relación de ventas con stock.

## Bauti

Responsable de las funcionalidades relacionadas con:

- Buscador de stock.
- Categorías.
- Visualización de productos por categoría.
- Actualización del stock según ventas.

---

# 39. Requisito general de fechas para ventas

La consigna general del proyecto establece que las ventas deben registrar la fecha.

El objetivo es permitir posteriormente realizar consultas y resúmenes por:

- Día.
- Semana.
- Mes.
- Otros períodos.

La implementación específica de Ventas corresponde a los integrantes responsables de ese módulo.

En Reparaciones, la fecha obligatoria utilizada para las estadísticas es:

`fechaIngreso`

---

# 40. Resultado final

El módulo de Reparaciones quedó implementado dentro del panel de administración.

Actualmente permite:

- Registrar reparaciones.
- Validar datos obligatorios.
- Guardar información de clientes y dispositivos.
- Registrar fechas de ingreso.
- Registrar cobros.
- Registrar costos de repuestos.
- Agregar descripciones.
- Consultar reparaciones.
- Editar reparaciones.
- Cambiar estados.
- Marcar reparaciones como entregadas.
- Eliminar reparaciones.
- Calcular facturación.
- Calcular costos de repuestos.
- Calcular ganancias.
- Filtrar estadísticas por período.
- Utilizar rangos personalizados.
- Mantener correctamente las fechas locales.
- Persistir los datos mediante Prisma y PostgreSQL.

El módulo fue probado y la compilación de producción finalizó correctamente.

---

# 41. Archivos principales

| Archivo | Función |
|---|---|
| `page.tsx` | Página principal, consultas y estadísticas |
| `ReparacionForm.tsx` | Formulario de alta |
| `ReparacionesList.tsx` | Listado y acciones |
| `FiltroFecha.tsx` | Filtros por período |
| `actions.ts` | Operaciones del servidor |
| `schema.prisma` | Modelo de base de datos |

---

# 42. Ruta del panel

El módulo está disponible en:

```text
/admin/reparaciones
```

---

# 43. Resumen técnico

El módulo sigue una estructura basada en:

```text
Usuario
   ↓
Formulario / filtros
   ↓
Server Actions / página
   ↓
Prisma
   ↓
PostgreSQL
   ↓
Datos de Reparaciones
```

Las estadísticas se calculan sobre los registros obtenidos para el período seleccionado.

La fecha de ingreso funciona como referencia principal para los filtros temporales.

---

# 44. Estado final del trabajo

**MÓDULO DE REPARACIONES: COMPLETADO Y PROBADO**

El trabajo correspondiente a Reparaciones fue implementado, probado, documentado y enviado al branch:

`rami/page-user`