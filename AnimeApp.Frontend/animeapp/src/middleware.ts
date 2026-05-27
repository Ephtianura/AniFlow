import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { randomAnimeMiddleware } from "./middlewares/randomAnime";

export async function middleware(request: NextRequest) {
  const randomResponse = await randomAnimeMiddleware(request);
  if (randomResponse) return randomResponse;

  return NextResponse.next();
}

export const config = {
  matcher: ["/anime/random", "/admin/:path*"],
};
