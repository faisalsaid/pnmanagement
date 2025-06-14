// export { auth as middleware } from '@/auth'; // old midleware auth.js

// new midleware combain user session idle
import { auth as nextAuth } from '@/auth'; // <— middleware dari NextAuth
import { NextRequest, NextResponse } from 'next/server';

const IDLE_LIMIT_MS = 30 * 60 * 1000; // 30 menit
// const IDLE_LIMIT_MS = 1 * 60 * 1000; // 30 menit
// const IDLE_LIMIT_MS = 10_000; // 30 menit

export async function middleware(req: NextRequest) {
  /* 1)  Jalankan NextAuth middleware terlebih dulu
   *     (gunakan cast supaya TS tidak tersinggung)          */
  const authRes = await (
    nextAuth as unknown as (r: NextRequest) => Promise<Response | undefined>
  )(req);

  // Kalau NextAuth sudah memutuskan redirect / block, ikuti saja.
  if (authRes) return authRes as NextResponse;

  /* 2)  Lanjutkan ke logika idle‑session */
  const res = NextResponse.next();
  const now = Date.now();
  const lastVisit = Number(req.cookies.get('lastVisit')?.value ?? 0);
  const sidCookie = req.cookies.get('sid')?.value;
  const idleTooLong = now - lastVisit > IDLE_LIMIT_MS;

  let sid = sidCookie;
  if (!sid || idleTooLong) {
    sid = crypto.randomUUID();
    res.cookies.set({
      name: 'sid',
      value: sid,
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
    });
  }

  res.cookies.set({
    name: 'lastVisit',
    value: String(now),
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
  });

  // Opsional – biar sisi klien (JS) bisa baca ID sesi kalau perlu
  res.headers.set('x-session-id', sid);

  return res;
}

/* Jalankan di semua path HTML + API, kecuali asset statik */
export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
