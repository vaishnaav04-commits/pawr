"use server";
import { z } from "zod";
import { redirect } from "next/navigation";
import { configured, supabase } from "@/lib/supabase/server";
const credentials = z.object({
  email: z.email(),
  password: z.string().min(8).max(128),
});
export async function authenticate(
  _: { error?: string; success?: string },
  form: FormData,
): Promise<{ error?: string; success?: string }> {
  if (!configured())
    return {
      error:
        "Connect Supabase first. You can explore the demo without an account.",
    };
  const mode = String(form.get("mode"));
  const email = String(form.get("email") ?? "");
  const password = String(form.get("password") ?? "");
  const db = await supabase();
  const origin = process.env.NEXT_PUBLIC_SITE_URL;
  if (!origin)
    return { error: "Set NEXT_PUBLIC_SITE_URL before using authentication." };
  if (mode === "reset") {
    if (!z.email().safeParse(email).success)
      return { error: "Enter a valid email address." };
    const { error } = await db.auth.resetPasswordForEmail(email, {
      redirectTo: origin + "/auth/callback?next=/update-password",
    });
    return error
      ? { error: error.message }
      : {
          success: "If an account exists, a password reset link has been sent.",
        };
  }
  if (!credentials.safeParse({ email, password }).success)
    return {
      error: "Enter a valid email and a password of at least 8 characters.",
    };
  if (mode === "signup") {
    const name = String(form.get("full_name") ?? "").trim();
    if (!name || name.length > 100)
      return { error: "Enter your name (up to 100 characters)." };
    const { error } = await db.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name },
        emailRedirectTo: origin + "/auth/callback",
      },
    });
    return error
      ? { error: error.message }
      : {
          success:
            "Account created. Check your email to confirm your address, then log in.",
        };
  }
  if (mode === "update") {
    const {
      data: { user },
    } = await db.auth.getUser();
    if (!user)
      return { error: "Your reset session has expired. Request another link." };
    const { error } = await db.auth.updateUser({ password });
    if (error) return { error: error.message };
    redirect("/dashboard");
  }
  const { error } = await db.auth.signInWithPassword({ email, password });
  if (error) return { error: error.message };
  redirect("/dashboard");
}
export async function logout() {
  const db = await supabase();
  await db.auth.signOut();
  redirect("/");
}
