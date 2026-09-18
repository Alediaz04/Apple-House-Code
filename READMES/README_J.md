# Login de administración con Supabase Auth

## 1. Objetivo

Esta documentación explica cómo funciona el login de administración de Apple House,
qué archivos participan, por qué se eligió esta arquitectura y dónde tocar el código
si algo deja de funcionar.

El flujo implementado es:

1. El administrador escribe su email y contraseña en `/admin/login`.
2. El formulario envía esos datos a una Server Action de Next.js.
3. La Server Action usa Supabase Auth mediante `signInWithPassword`.
4. Si las credenciales son incorrectas, se devuelve un error y se muestra en pantalla.
5. Si son correctas, Supabase guarda la sesión en cookies y Next.js redirige a
   `/admin/agregar`.

> Importante: este documento describe el estado actual de la rama
> `joaco/login-admin`. La protección de todas las rutas administrativas y el cierre
> de sesión son tareas separadas y deben implementarse antes de considerar completo
> el sistema de administración.

## 2. Tecnologías utilizadas

- **Next.js 16.3.5** con App Router.
- **React 19.2.8**.
- **TypeScript**.
- **Supabase Auth** para email y contraseña.
- **`@supabase/ssr`** para conectar Supabase con las cookies de Next.js.
- **Server Actions** de Next.js para ejecutar el login en el servidor.
- **`useActionState`** de React para conectar el formulario con la Server Action.
- **Prisma** continúa siendo utilizado por las operaciones de productos; no es el
  responsable de autenticar este login.

Las dependencias de Supabase están declaradas en `package.json`:

```json
{
  "@supabase/ssr": "^0.12.7",
  "@supabase/supabase-js": "^2.116.0"
}
```

## 3. Archivos involucrados

```text
src/
├── app/
│   └── admin/
│       └── login/
│           ├── actions.ts   # Server Action del login
│           └── page.tsx     # Interfaz del formulario
└── lib/
    └── supabase/
        └── server.ts        # Cliente de Supabase para el servidor
```

### `src/app/admin/login/actions.ts`

Contiene la función `iniciarSesion`. Es el punto donde se reciben los datos del
formulario, se validan y se llama a Supabase Auth.

### `src/app/admin/login/page.tsx`

Contiene la pantalla visible por el administrador. Es un Client Component porque
utiliza `useActionState`, que necesita ejecutarse en el navegador para actualizar
el estado visual del formulario.

### `src/lib/supabase/server.ts`

Contiene `createClient`, un helper reutilizable que crea un cliente de Supabase
configurado para leer y escribir cookies de la petición actual.

## 4. Configuración inicial

### 4.1. Instalar dependencias

Desde la raíz del proyecto:

```bash
npm install
```

No hace falta instalar Supabase manualmente si las dependencias ya aparecen en
`package.json` y `package-lock.json`.

### 4.2. Configurar variables de entorno

Crear un archivo `.env.local` en la raíz del proyecto. No debe subirse a Git.

```env
NEXT_PUBLIC_SUPABASE_URL=https://TU-PROYECTO.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=TU_CLAVE_ANON
```

Los valores se obtienen desde el proyecto de Supabase, en:

```text
Project Settings > API
```

Usar:

- **Project URL** para `NEXT_PUBLIC_SUPABASE_URL`.
- **Publishable key/anon key** para `NEXT_PUBLIC_SUPABASE_ANON_KEY`.

No utilizar en este código la `service_role key`. Esa clave tiene permisos
elevados y nunca debe exponerse al navegador ni guardarse en archivos versionados.

Después de crear o modificar `.env.local`, reiniciar el servidor de desarrollo:

```bash
npm run dev
```

Next.js carga las variables de entorno al iniciar el proceso.

### 4.3. Crear el usuario administrador en Supabase

En el panel de Supabase:

1. Entrar en `Authentication`.
2. Abrir `Users`.
3. Crear un usuario con email y contraseña, o utilizar uno existente.
4. Usar exactamente esas credenciales en `/admin/login`.

Supabase Auth es quien decide si el email y la contraseña son válidos. No se
guarda ni se compara la contraseña desde nuestro código.

## 5. Server Action: explicación del código

La primera línea de `actions.ts` es:

```ts
"use server";
```

Le indica a Next.js que las funciones de ese archivo se ejecutan en el servidor.
El navegador puede invocarlas a través del formulario, pero la implementación
real no se envía como JavaScript ejecutable al cliente.

La action tiene esta firma:

```ts
export async function iniciarSesion(
  _prev: LoginState,
  formData: FormData
): Promise<LoginState>
```

- `_prev`: estado anterior del formulario. React lo necesita para
  `useActionState`; el login actual no lo usa directamente.
- `formData`: contiene los valores enviados por los inputs.
- `Promise<LoginState>`: indica que la función es asíncrona y devuelve el estado
  definido por `LoginState`.

El estado sigue la convención de las actions existentes del equipo:

```ts
export type LoginState = { ok: boolean; error?: string } | null;
```

Un error se devuelve así:

```ts
return { ok: false, error: "Por favor, completa todos los campos." };
```

Esto permite que la interfaz sepa si debe mostrar un mensaje sin recibir objetos
internos de Supabase.

### Lectura de los campos

```ts
const email = String(formData.get("email") ?? "").trim();
const password = String(formData.get("password") ?? "");
```

Los nombres deben coincidir con los inputs de `page.tsx`:

```tsx
<input name="email" />
<input name="password" />
```

`trim()` elimina espacios accidentales al principio o al final del email. No se
aplica a la contraseña porque los espacios podrían formar parte de una contraseña
válida.

### Validación

```ts
if (!email || !password) {
  return { ok: false, error: "Por favor, completa todos los campos." };
}
```

La validación HTML (`required`) mejora la experiencia, pero no es suficiente:
una petición puede enviarse sin utilizar nuestra interfaz. Por eso la validación
se repite en el servidor.

### Autenticación

```ts
const supabase = await createClient();
const { error } = await supabase.auth.signInWithPassword({
  email,
  password,
});
```

`signInWithPassword` envía las credenciales a Supabase Auth. Si falla:

```ts
if (error) {
  return { ok: false, error: error.message };
}
```

El mensaje vuelve al componente y se muestra en el formulario.

Si no existe error:

```ts
redirect("/admin/agregar");
```

Next.js redirige al panel. La llamada a `redirect` finaliza el flujo de la
action, por lo que no se debe agregar lógica posterior esperando que se ejecute.

## 6. Cliente de Supabase para el servidor

`src/lib/supabase/server.ts` utiliza:

```ts
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
```

La función principal es:

```ts
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        },
      },
    }
  );
}
```

### ¿Por qué no crear el cliente directamente dentro de la página?

Porque este cliente necesita `cookies()` de Next.js, que solo está disponible en
el servidor. Centralizarlo en `server.ts` evita repetir la configuración y hace
que todas las Server Actions futuras puedan reutilizarlo:

```ts
const supabase = await createClient();
```

### ¿Qué hacen `getAll` y `setAll`?

- `getAll` permite que Supabase lea la sesión existente.
- `setAll` permite que Supabase guarde o renueve las cookies de sesión.

Sin `setAll`, el primer login podría parecer exitoso, pero las solicitudes
posteriores no tendrían la sesión persistida.

## 7. Formulario y respuesta visual

`page.tsx` comienza con:

```tsx
"use client";
```

Esto es diferente de `"use server"`:

- `"use client"` indica que el componente se ejecuta en el navegador.
- `"use server"` indica que la action se ejecuta en el servidor.

La página conecta la action así:

```tsx
const [state, formAction, pending] = useActionState(iniciarSesion, null);
```

Y el formulario así:

```tsx
<form action={formAction} className="admin-form">
```

Cuando el usuario presiona el botón:

1. El navegador recopila los inputs con `name`.
2. Next.js envía un `FormData` a `iniciarSesion`.
3. La action valida y llama a Supabase.
4. El resultado vuelve como `state`.
5. React vuelve a renderizar el mensaje o Next.js navega al panel.

El error se muestra con:

```tsx
{state?.error && (
  <div className="form-alert error">
    <p>{state.error}</p>
  </div>
)}
```

El operador `?.` evita intentar leer `error` cuando el estado inicial todavía es
`null`.

Mientras se espera la respuesta:

```tsx
<button disabled={pending}>
```

deshabilita el botón y evita envíos repetidos.

## 8. Flujo completo

```text
Administrador
    |
    | completa email y contraseña
    v
page.tsx: <form action={formAction}>
    |
    | envía FormData
    v
actions.ts: iniciarSesion()
    |
    | valida campos
    v
lib/supabase/server.ts: createClient()
    |
    | configura cookies y cliente SSR
    v
Supabase Auth: signInWithPassword()
    |
    +--> error: { ok: false, error } --> state.error --> mensaje en pantalla
    |
    +--> éxito: cookie de sesión --> redirect("/admin/agregar")
```

## 9. Cómo probarlo

Iniciar el proyecto:

```bash
npm run dev
```

Abrir:

```text
http://localhost:3000/admin/login
```

### Prueba de credenciales vacías

El navegador debería impedir el envío por `required`. Si se fuerza una petición
sin datos, la action devuelve:

```text
Por favor, completa todos los campos.
```

### Prueba de credenciales incorrectas

Usar un email existente con una contraseña incorrecta. Debe permanecer en el
login y mostrar el error devuelto por Supabase.

### Prueba exitosa

Usar un usuario válido de Supabase. Debe redirigir a:

```text
/admin/agregar
```

## 10. Problemas frecuentes y dónde revisar

### `Invalid API key` o error de URL de Supabase

Revisar:

1. Que exista `.env.local` en la raíz.
2. Que los nombres sean exactamente:
   `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
3. Que los valores correspondan al mismo proyecto de Supabase.
4. Reiniciar `npm run dev` después de cambiar variables.

### `Invalid login credentials`

Revisar:

1. Que el usuario exista en `Authentication > Users`.
2. Que el email esté escrito correctamente.
3. Que la contraseña sea la correcta.
4. Que el proveedor Email de Supabase esté habilitado.

### El login parece exitoso pero no conserva la sesión

Revisar [server.ts](../src/lib/supabase/server.ts), especialmente:

- `getAll()`, que lee las cookies.
- `setAll()`, que las escribe.
- Que `createClient()` sea el helper importado por la action.

También revisar la pestaña de cookies del navegador y la configuración de
dominio si se está probando en un entorno desplegado.

### El formulario no muestra el error

Revisar en [page.tsx](../src/app/admin/login/page.tsx):

```tsx
const [state, formAction, pending] = useActionState(iniciarSesion, null);
```

y:

```tsx
{state?.error && <p>{state.error}</p>}
```

Además, los inputs deben conservar:

```tsx
name="email"
name="password"
```

### No se puede importar `@/lib/supabase/server`

Revisar que:

1. El archivo exista en `src/lib/supabase/server.ts`.
2. El alias `@/*` siga apuntando a `./src/*` en `tsconfig.json`.
3. El servidor de desarrollo se haya reiniciado.

### La redirección no ocurre

Revisar:

1. Que `signInWithPassword` no devuelva un error.
2. Que la ruta exista en `src/app/admin/agregar`.
3. Que `redirect("/admin/agregar")` no esté dentro de un `try/catch`.

`redirect` utiliza una excepción interna de control de flujo; envolverlo
incorrectamente en un `catch` puede impedir el comportamiento esperado.

## 11. Seguridad y límites actuales

- La contraseña no se guarda en nuestra base de datos ni se imprime en logs.
- No se debe agregar `console.log(password)` ni enviar la contraseña a un
  servicio externo.
- No se debe usar `service_role key` en el navegador ni en este cliente.
- Las Server Actions deben seguir validando sus entradas porque pueden recibir
  peticiones directas.
- `NEXT_PUBLIC_*` indica que el valor puede formar parte de la aplicación cliente;
  nunca colocar secretos con permisos elevados en esas variables.
- El login crea una sesión, pero actualmente este cambio no implementa por sí solo
  un middleware/proxy que bloquee `/admin/agregar` a usuarios no autenticados.
- Tampoco se implementa aquí logout, recuperación de contraseña, confirmación de
  email, roles o autorización por permisos.

### Trabajo recomendado antes de producción

1. Agregar una verificación de sesión para las rutas administrativas.
2. Implementar logout y borrar la sesión correctamente.
3. Definir si todos los usuarios de Supabase pueden entrar o solo usuarios con
   rol de administrador.
4. Revisar políticas RLS de Supabase si se accede directamente a tablas.
5. Configurar dominios y URLs de redirección para staging y producción.
6. Agregar rate limiting o protección adicional contra intentos repetidos.

## 12. Validaciones realizadas

Se ejecutó correctamente el chequeo de TypeScript:

```bash
npx tsc --noEmit
```

También se verificó que el diff no contenga errores de espacios con:

```bash
git diff --check
```

El lint específico de los archivos modificados quedó pendiente de completar si
el entorno interrumpe la ejecución. Para repetirlo:

```bash
npx eslint src/app/admin/login/actions.ts src/app/admin/login/page.tsx src/lib/supabase/server.ts
```

Para ejecutar el lint configurado para todo el proyecto:

```bash
npm run lint
```

## 13. Regla práctica para futuros cambios

Si se modifica el nombre de un campo del formulario:

1. Cambiar el atributo `name` en `page.tsx`.
2. Cambiar el mismo nombre en `formData.get(...)` dentro de `actions.ts`.
3. Probar el login con campos vacíos, credenciales incorrectas y credenciales
   válidas.

Si se cambia la forma del error:

1. Actualizar `LoginState` en `actions.ts`.
2. Actualizar todos los `return` de la action.
3. Actualizar la lectura de `state` en `page.tsx`.

Si se cambia la configuración de Supabase:

1. Revisar `.env.local`.
2. Revisar `src/lib/supabase/server.ts`.
3. Reiniciar el servidor.
4. Probar que la cookie se cree después de un login exitoso.

## 14. Inventario, ventas y stock

### Modelo de datos

`Producto.stock` es la cantidad disponible. Una venta no cambia el `Estado` del
equipo (`NUEVO` o `USADO`): crea un registro en `Venta` y descuenta la cantidad
vendida del stock.

El modelo `Venta` guarda:

- `productoId`: producto vendido.
- `cantidad`: unidades vendidas.
- `precioUnitario`: precio vigente en el momento de la venta.
- `total`: precio unitario multiplicado por la cantidad.
- `createdAt`: fecha de la operación.

La migración está en:

```text
prisma/migrations/20260917220000_add_sales_and_categories/migration.sql
```

Para aplicar migraciones en otro entorno:

```bash
npx prisma migrate deploy
npx prisma generate
```

### Registrar una venta

La pantalla `/admin/ventas` usa:

- `src/app/admin/ventas/page.tsx`: consulta productos con stock y ventas
  concretadas.
- `src/app/admin/ventas/VentasPanel.tsx`: formulario y listado visual.
- `src/app/admin/ventas/actions.ts`: `registrarVenta`.

`registrarVenta` utiliza `prisma.$transaction`. Primero ejecuta un `updateMany`
con la condición `stock >= cantidad`; si no actualiza exactamente un producto,
la operación falla y no se crea la venta. Después crea `Venta` con el precio
actual del producto. Así se evita vender más unidades de las disponibles incluso
si dos solicitudes llegan al mismo tiempo.

Después de una venta se ejecuta `revalidatePath` para:

- Refrescar el historial de `/admin/ventas`.
- Actualizar las tarjetas y cantidades de `/admin/stock`.
- Ocultar el producto en la web pública cuando su stock llega a cero.

### Stock del panel administrativo

`src/app/admin/stock/StockList.tsx` muestra una tarjeta por categoría:

- iPhone
- Mac
- iPad
- Accesorios
- Play
- Fundas
- Otros

Cada tarjeta muestra cuántos productos tiene y el total de unidades disponibles.
Al seleccionarla, se despliegan los productos de esa categoría y cada producto
muestra su stock individual. La selección es solamente visual; los datos vienen
del servidor y se vuelven a renderizar después de una Server Action.

La opción antigua `Marcar como vendido` fue retirada del stock porque ponía
`stock = 0` sin crear un registro histórico. Las ventas deben registrarse desde
`/admin/ventas`.

### Catálogo público

`src/lib/products.ts` consulta únicamente:

```ts
where: { visible: true, stock: { gt: 0 } }
```

Por lo tanto, un producto con stock cero no se muestra a los clientes. Si la
consulta falla, la función devuelve una lista vacía en vez de mostrar productos
estáticos cuyo stock real no se conoce.

### Categorías nuevas

Las categorías `PLAY` y `FUNDAS` deben existir en los tres lugares:

1. Enum `Categoria` de `prisma/schema.prisma`.
2. Selectores de alta y edición de producto.
3. Tipos y filtros del catálogo público.

Si se agrega otra categoría, actualizar esos mismos puntos, crear una migración
Prisma y regenerar el cliente.