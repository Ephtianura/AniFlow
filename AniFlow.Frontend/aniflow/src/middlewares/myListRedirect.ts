import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function myListRedirect(request: NextRequest) {
  if (request.nextUrl.pathname === "/profile/mylist")
    return NextResponse.redirect(
      new URL("/profile/mylist/Watching", request.url),
    );

  return null;
}
