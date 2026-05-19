import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name) {
          return request.cookies.get(name)?.value;
        },
        set(name, value, options) {
          request.cookies.set({ name, value, ...options });
          response = NextResponse.next({ request });
          response.cookies.set({ name, value, ...options });
        },
        remove(name, options) {
          request.cookies.set({ name, value: "", ...options });
          response = NextResponse.next({ request });
          response.cookies.set({ name, value: "", ...options });
        }
      }
    }
  );

  const {
    data: { user }
  } = await supabase.auth.getUser();

  const isLogin = request.nextUrl.pathname === "/admin/login";
  const isAdminRoute = request.nextUrl.pathname.startsWith("/admin");

  if (!isAdminRoute) return response;

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
}

export const config = {
  matcher: ["/admin/:path*"]
};
