import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/middleware";

const PUBLIC_PATHS = ["/login", "/activar-cuenta"];

function isInternalPath(path: string): boolean {
  if (!path.startsWith("/")) return false;
  if (path.startsWith("//")) return false;
  if (/^[a-z][a-z0-9+.-]*:/i.test(path)) return false;
  return true;
}

export async function proxy(request: NextRequest) {
  const { supabase, supabaseResponse } = createClient(request);
  const { pathname, searchParams } = request.nextUrl;

  const { data } = await supabase.auth.getClaims();
  const claims = data?.claims;

  const isPublicPath = PUBLIC_PATHS.some((path) => pathname === path);

  if (!claims && !isPublicPath) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/login";
    redirectUrl.search = "";
    redirectUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(redirectUrl);
  }

  if (claims && isPublicPath) {
    const redirectParam = searchParams.get("redirect");
    if (redirectParam && isInternalPath(redirectParam)) {
      return NextResponse.redirect(new URL(redirectParam, request.url));
    }
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/";
    redirectUrl.search = "";
    return NextResponse.redirect(redirectUrl);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\.(?:png|jpg|jpeg|gif|svg|webp|ico)$).*)",
  ],
};
