import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function randomAnimeMiddleware(request: NextRequest) {
  if (request.nextUrl.pathname === '/anime/random') {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/anime/random/slug`, { cache: 'no-store' });
      const anime = await res.json();
      if (anime?.slug) {
        return NextResponse.redirect(new URL(`/anime/${anime.slug}`, request.url));
      }
    } catch (e) {}
    return NextResponse.redirect(new URL('/animes', request.url));
  }
  
  return null;
}