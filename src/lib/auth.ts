import { redirect } from "next/navigation";
import { configured, supabase } from "./supabase/server";
export async function requireUser() {
  if (!configured())
    redirect(
      "/login?message=Connect%20Supabase%20to%20use%20your%20account%2C%20or%20explore%20the%20demo.",
    );
  const db = await supabase();
  const {
    data: { user },
  } = await db.auth.getUser();
  if (!user) redirect("/login");
  return { db, user };
}
