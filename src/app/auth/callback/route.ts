import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase/server";
export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const next = request.nextUrl.searchParams.get("next");
  if (code) {
    const db = await supabase();
    const { error } = await db.auth.exchangeCodeForSession(code);
    if (!error)
      return NextResponse.redirect(
        new URL(next === "/update-password" ? next : "/dashboard", request.url),
      );
  }
  return NextResponse.redirect(
    new URL(
      "/login?message=That%20link%20expired.%20Please%20try%20again.",
      request.url,
    ),
  );
}
