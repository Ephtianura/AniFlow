import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { randomAnimeMiddleware } from "./middlewares/randomAnime";
import { myListRedirect } from "./middlewares/myListRedirect";

export async function proxy(request: NextRequest) {
  const randomResponse = await randomAnimeMiddleware(request);
  if (randomResponse) return randomResponse;

  const myListResponse = await myListRedirect(request);
  if (myListResponse) return myListResponse;

  return NextResponse.next();
}

export const config = {
  matcher: ["/anime/random", "/admin/:path*", "/profile/mylist"],
};

