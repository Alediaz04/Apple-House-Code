"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

// Conserva el mismo formato de resultado usado por las actions del proyecto.
export type LoginState = { ok: boolean; error?: string } | null;

export async function iniciarSesion(
  _prev: LoginState,
  formData: FormData
): Promise<LoginState> {
  // Leemos los datos enviados por el formulario y quitamos espacios del email.
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  // Validamos también en el servidor, porque el navegador no es confiable.
  if (!email || !password) {
    return { ok: false, error: "Por favor, completa todos los campos." };
  }

  // Usamos el cliente de servidor para iniciar la sesión en Supabase Auth.
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  // Devolvemos el mensaje de Supabase para mostrarlo en el formulario.
  if (error) {
    return { ok: false, error: error.message };
  }

  // Con las credenciales correctas, enviamos al panel de administración.
  redirect("/admin/agregar");
}
