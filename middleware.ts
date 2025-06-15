// export { auth as middleware } from '@/auth'; // old midleware auth.js

// new midleware combain user session idle
import { auth as nextAuth } from '@/auth';
import { NextRequest, NextResponse } from 'next/server';

// const IDLE_LIMIT_MS = 30 * 60 * 1000; // 30 menit
const IDLE_LIMIT_MS = 1 * 60 * 1000; // 1 menit

export async function middleware(req: NextRequest) {
  /* 1.  Jalankan NextAuth */
  const authRes = await (
    nextAuth as unknown as (r: NextRequest) => Promise<Response | undefined>
  )(req);

  /* 2.  Pilih response dasar */
  let res: NextResponse;
  if (authRes) {
    // NextAuth mengembalikan redirect / block
    //  → bungkus ulang supaya bisa set cookie
    const headers = new Headers(authRes.headers);
    const body = authRes.body ?? null; // redirect biasanya null
    res = new NextResponse(body, {
      status: authRes.status,
      headers, // salin semua header*
    });
  } else {
    // Lolos autentikasi
    res = NextResponse.next();
  }

  /* 3.  Logika idle‑session */
  const now = Date.now();
  const lastVisit = Number(req.cookies.get('lastVisit')?.value ?? 0);
  const sidCookie = req.cookies.get('sid')?.value;
  const idleTooLong = now - lastVisit > IDLE_LIMIT_MS;

  let sid = sidCookie;
  if (!sid || idleTooLong) {
    sid = crypto.randomUUID();
    res.cookies.set('sid', sid, {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
    });
  }

  res.cookies.set('lastVisit', String(now), {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
  });

  // opsional – kirim ke client
  res.headers.set('x-session-id', sid);

  return res;
}

/* Jalankan di semua path HTML + API, kecuali asset statik */
export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
