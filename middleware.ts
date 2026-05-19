import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

function getSupabaseEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) return null;
  return { url, anonKey };
}

export async function middleware(request: NextRequest) {
  const isLogin = request.nextUrl.pathname === "/admin/login";
  const env = getSupabaseEnv();

  // Sin variables en Vercel el middleware no debe romper: deja cargar el login.
  if (!env) {
    if (isLogin) return NextResponse.next();
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set(
      "error",
      "Configura NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY en Vercel."
    );
    return NextResponse.redirect(loginUrl);
  }

  let response = NextResponse.next({ request });

  try {
    const supabase = createServerClient(env.url, env.anonKey, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        }
      }
    });

    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user && !isLogin) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    if (user) {
      const { data: admin, error } = await supabase
        .from("admin_users")
        .select("user_id")
        .eq("user_id", user.id)
        .maybeSingle();

      if (isLogin) {
        if (admin) return NextResponse.redirect(new URL("/admin/dashboard", request.url));
        return response;
      }

      if (!admin || error) {
        const loginUrl = new URL("/admin/login", request.url);
        loginUrl.searchParams.set(
          "error",
          error?.code === "PGRST205"
            ? "Primero ejecuta supabase/schema.sql en Supabase."
            : "Tu usuario no tiene permisos de administrador."
        );
        return NextResponse.redirect(loginUrl);
      }
    }

    return response;
  } catch {
    if (isLogin) return NextResponse.next();
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("error", "Error de conexión con Supabase. Revisa la configuración.");
    return NextResponse.redirect(loginUrl);
  }
}

export const config = {
  matcher: ["/admin/:path*"]
};
