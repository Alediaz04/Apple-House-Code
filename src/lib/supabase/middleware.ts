import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// Revisa si hay sesión activa y protege las rutas /admin/*
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Refresca la sesión si hace falta y nos dice si hay alguien logueado
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;
  const esRutaAdmin = pathname.startsWith("/admin");
  const esPaginaLogin = pathname === "/admin/login";

  // Sin sesión, tratando de entrar a cualquier /admin/* que no sea el login -> al login
  if (esRutaAdmin && !esPaginaLogin && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    return NextResponse.redirect(url);
  }

  // Con sesión, tratando de entrar al login -> directo al panel
  // (uso "/admin/agregar" porque es donde tu login ya redirige después de iniciar sesión)
  if (esPaginaLogin && user) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/agregar";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}