// app/_actions/logVisit.ts
'use server';

import { cookies, headers } from 'next/headers';
import { UAParser } from 'ua-parser-js';
import prisma from '@/lib/prisma';
import { WebServiceClient } from '@maxmind/geoip2-node';
import { auth } from '@/auth';
import { startOfDay, endOfDay, subDays } from 'date-fns';
import { Prisma } from '@prisma/client';
import { fromZonedTime, toZonedTime } from 'date-fns-tz';
import { DateTime } from 'luxon';

const accountId = process.env.ACCOUNT_ID;
const licenseKey = process.env.LICENSE_KEY;

if (!accountId || !licenseKey) {
  throw new Error(
    'Missing MaxMind credentials: ACCOUNT_ID or LICENSE_KEY is not defined',
  );
}

const client = new WebServiceClient(accountId, licenseKey, {
  host: 'geolite.info',
});

const TZ = 'Asia/Jayapura';

function getStartOfTodayUtc(tz: string = TZ): Date {
  // 1) Ambil waktu sekarang (UTC → zoned)
  const zonedNow = toZonedTime(new Date(), tz);

  // 2) Potong ke 00:00 zona lokal
  const zonedStart = startOfDay(zonedNow);

  // 3) Konversi lagi ke UTC untuk dipakai di DB
  return fromZonedTime(zonedStart, tz);
}

/////////////////////////////////////////////////////////////////////////////////////////////
export type ClientLogPayload = {
  url: string;
  path: string;
  pageType: 'article' | 'page' | 'category' | 'other';
  referrer?: string | null;
  timezone: string;
  language: string;
  screen: string;
  articleSlug?: string | null;
};

// HANDLE LOG VISIT

export async function logVisit(payload: Omit<ClientLogPayload, 'sessionId'>) {
  // 1)  user login?
  const session = await auth();
  const userId = session?.user?.id ?? null;

  const cookieStore = await cookies();
  // const sidCookie = cookieStore.get('sid');
  const sessionId = cookieStore.get('sid')?.value ?? crypto.randomUUID();
  // console.log(sessionId);

  // 3)  header server‑side
  const h = await headers();

  /** 3a) IP */
  let ip =
    (h.get('x-forwarded-for') || '').split(',')[0].trim() ||
    h.get('x-real-ip') ||
    '127.0.0.1';

  if (ip.startsWith('::ffff:')) ip = ip.replace('::ffff:', '');

  /** 3b) user agent */
  const ua = new UAParser(h.get('user-agent') || '').getResult();

  /** 3c) geolocation (safe fail) */
  let city: string | null = null;
  let country: string | null = null;
  try {
    const geo = await client.city(ip);
    city = geo.city?.names?.en || null;
    country = geo.country?.isoCode || null;
  } catch (err) {
    console.warn('MaxMind lookup failed:', err);
  }

  /** 4) opsional: lookup article ID */
  let articleId: string | null = null;
  if (payload.articleSlug) {
    const article = await prisma.article.findUnique({
      where: { slug: payload.articleSlug },
      select: { id: true },
    });
    articleId = article?.id ?? null;
  }

  /** 5) write to DB */
  await prisma.pageVisit.create({
    data: {
      sessionId, // <— from cookeie
      userId,
      visitTime: new Date(),
      url: payload.url,
      path: payload.path,
      pageType: payload.pageType,
      referrer: payload.referrer,
      articleId,
      timezone: payload.timezone,
      language: payload.language,
      screen: payload.screen,
      ip,
      city,
      country,
      deviceType: ua.device.type || 'desktop',
      os: ua.os.name,
      browser: ua.browser.name,
    },
  });
}

////////////////////////////////////////////////////////////////////////////////////////////////
// GET VISITOR THIS DAY

export async function getVistorTodayBySessionId() {
  const todayStart = startOfDay(new Date());
  const todayEnd = endOfDay(new Date());

  const sessions = await prisma.pageVisit.findMany({
    where: {
      visitTime: {
        gte: todayStart,
        lte: todayEnd,
      },
    },
    distinct: ['sessionId'],
    select: {
      sessionId: true,
    },
  });

  const count = sessions.length;
  // console.log('Unique sessions today:', count);
  return count;
}

// //////////////////////////////////////////////
// hit hourly

const tz = 'Asia/Jayapura'; // zona target laporan
const date = new Date();

// export const getHitHourly = async () => {
//   /* 1️⃣  ambil hanya jam yang ada hits */
//   const raw = await prisma.$queryRaw<
//     { hour: string; hits: bigint }[]
//   >(Prisma.sql`
//     SELECT to_char(date_trunc('hour', "visitTime" AT TIME ZONE ${tz}), 'HH24') AS hour,
//            COUNT(*) AS hits
//     FROM   "PageVisit"
//     -- WHERE  "visitTime" AT TIME ZONE ${tz} >= ${date}::date
//     --   AND  "visitTime" AT TIME ZONE ${tz} <  (${date}::date + interval '1 day')
//     GROUP  BY hour
//     ORDER  BY hour
//   `);

//   /* 2️⃣  buat array 24 jam default 0 */
//   const full = Array.from({ length: 24 }, (_, i) => ({
//     hour: i.toString().padStart(2, '0'), // '00' … '23'
//     hits: 0,
//   }));

//   /* 3️⃣  isi jam yang punya data */
//   raw.forEach(({ hour, hits }) => {
//     full[Number(hour)].hits = Number(hits);
//   });

//   return full; // panjang selalu 24 elemen
// };

// export async function getHitsTodayUntilNow() {
//   /* 1) Sekarang dalam UTC */
//   const nowUtc = new Date();

//   /* 2) Sekarang versi zona target (optional, kalau mau pakai) */
//   const nowLocal = toZonedTime(nowUtc, tz);

//   /* 3) 00:00 hari ini di zona target */
//   const startLocal = startOfDay(nowLocal);

//   /* 4) Konversi 00:00 lokal → UTC */
//   const startUtc = fromZonedTime(startLocal, tz);

//   /* 5) Query semua hit (hanya kolom sessionId) */
//   const rows = await prisma.pageVisit.findMany({
//     where: {
//       visitTime: {
//         gte: startUtc, // ≥ 00:00 WIT, tapi dalam UTC
//         lte: nowUtc, // ≤ sekarang
//       },
//     },
//     select: { sessionId: true, visitTime: true },
//   });

//   return rows; // [{ sessionId: 'abc' }, { sessionId: 'def' }, ...]
// }

//////////////////////////////////////////////

// export async function getSimpleAnalitic() {
//   // Tentukan jendela waktu sekali saja supaya konsisten di seluruh query
//   const now = new Date();
//   const since24h = subDays(now, 1);
//   const since30day = subDays(startOfDay(now), 30);

//   const [
//     // 1. Page views (PV) 24 jam
//     pageViewsLast24h,

//     // 2. Unique sessions (UV) 24 jam
//     uniqueSessionsLast24h,

//     // 3. 10 negara dengan kunjungan terbanyak
//     topCountries,

//     // 4. 10 URL/path terpopuler
//     topPaths,

//     // 5. Distribusi perangkat
//     deviceBreakdown,

//     // 6. Tren kunjungan harian 30 hari terakhir
//     visitsPerDay,
//   ] = await Promise.all([
//     prisma.pageVisit.count({
//       where: { visitTime: { gte: since24h } },
//     }),

//     prisma.pageVisit
//       .groupBy({
//         by: ['sessionId'],
//         where: { visitTime: { gte: since24h } },
//         _count: { _all: true }, // atau kosong saja—kita cuma butuh grupnya
//       })
//       .then((groups) => groups.length),

//     prisma.pageVisit.groupBy({
//       by: ['country'],
//       _count: { _all: true },
//       orderBy: { _count: { id: 'desc' } },
//       take: 10,
//       where: { country: { not: null } }, // filter null biar rapi
//     }),

//     prisma.pageVisit.groupBy({
//       by: ['path'],
//       _count: { _all: true },
//       orderBy: { _count: { id: 'desc' } },
//       take: 10,
//     }),

//     prisma.pageVisit.groupBy({
//       by: ['deviceType'],
//       _count: { _all: true },
//     }),

//     // ―――― Time series harian ――――
//     prisma.pageVisit
//       .groupBy({
//         by: ['visitTime'],
//         _count: { _all: true },
//         orderBy: { visitTime: 'asc' },
//         where: { visitTime: { gte: since30day } },
//       })
//       .then((rows) =>
//         // Normalisasi ke “YYYY‑MM‑DD” + lengkapi hari tanpa data
//         rows.reduce<Record<string, number>>((acc, { visitTime, _count }) => {
//           const d = visitTime.toISOString().slice(0, 10);
//           acc[d] = _count._all;
//           return acc;
//         }, {}),
//       ),
//   ]);

//   return {
//     pageViewsLast24h,
//     uniqueSessionsLast24h,
//     topCountries,
//     topPaths,
//     deviceBreakdown,
//     visitsPerDay,
//   };
// }

// export async function getDeviceType(
//   tz = 'Asia/Jayapura', // zona lokal WIT
// ) {
//   return prisma.$queryRaw<
//     { date: string; desktop: number; mobile: number }[]
//   >(Prisma.sql`
// WITH params AS (
//   SELECT ${tz}::text AS tz
// ),
// -- 1) Buat deret 7 hari (paling lama = hari‑6, paling baru = hari ini – zona lokal)
// days AS (
//   SELECT
//     generate_series(
//       (now() AT TIME ZONE (SELECT tz FROM params))::date - interval '6 day',
//       (now() AT TIME ZONE (SELECT tz FROM params))::date,
//       '1 day'
//     )::date AS local_day
// ),
// -- 2) Hitung kunjungan per device per hari
// agg AS (
//   SELECT
//     date_trunc('day', "visitTime" AT TIME ZONE (SELECT tz FROM params))::date AS local_day,
//     "deviceType",
//     COUNT(*) AS cnt
//   FROM "PageVisit"
//   WHERE "visitTime" >= (SELECT MIN(local_day) FROM days)  -- hanya 7 hari ke belakang
//   GROUP BY 1, 2
// ),
// -- 3) Pivot desktop / mobile
// pivot AS (
//   SELECT
//     local_day,
//     SUM(CASE WHEN "deviceType" = 'desktop' THEN cnt ELSE 0 END) AS desktop,
//     SUM(CASE WHEN "deviceType" = 'mobile'  THEN cnt ELSE 0 END) AS mobile
//   FROM agg
//   GROUP BY local_day
// )
// -- 4) Gabungkan kerangka tanggal + pivot; isi kosong = 0
// SELECT
//   to_char(d.local_day, 'YYYY-MM-DD')        AS date,
//   COALESCE(p.desktop, 0)::int               AS desktop,
//   COALESCE(p.mobile , 0)::int               AS mobile
// FROM days d
// LEFT JOIN pivot p USING (local_day)
// ORDER BY d.local_day;
// `);
// }

export const getUserActive = async () => {
  const start = getStartOfTodayUtc(); // 2025‑06‑16T15:00:00Z (karena UTC+9)
  const now = new Date();

  const rows = await prisma.pageVisit.groupBy({
    by: ['userId'],
    where: {
      visitTime: {
        gte: start,
        lte: now,
      },
      userId: {
        not: null,
      },
    },
  });

  return rows.length;
};

export async function getTodayHits() {
  // 1) Waktu sekarang (UTC) ➜ konversi ke zona Jayapura (UTC+9)
  const zonedNow = toZonedTime(new Date(), TZ);

  // 2) Mundur ke 00:00 hari ini (zona Jayapura)
  const startOfTodayZoned = startOfDay(zonedNow);

  // 3) Konversi kembali ke UTC (karena kolom visitTime disimpan UTC)
  const startOfTodayUtc = fromZonedTime(startOfTodayZoned, TZ);

  // 4) Hitung TOTAL baris (hits) dari 00:00 lokal sampai sekarang
  const totalHits = await prisma.pageVisit.count({
    where: {
      visitTime: {
        gte: startOfTodayUtc,
        lte: new Date(), // sekarang (UTC)
      },
    },
  });

  return totalHits;
}

////////////////////////////////////////////////////////////

// GET last 24 activites group by hour

export async function getHourlyVisits24h() {
  const rows = await prisma.$queryRaw<{ hour_bucket: Date; visits: bigint }[]>`
    WITH bounds AS (
      SELECT date_trunc('hour', now()) - INTERVAL '24 hours' AS start_time,
             date_trunc('hour', now()) + INTERVAL '1 hour'   AS end_time
    ),
    hours AS (
      SELECT generate_series(start_time,
                             end_time - INTERVAL '1 hour',
                             INTERVAL '1 hour') AS hour_bucket
      FROM bounds
    ),
    visits AS (
      SELECT date_trunc('hour', "visitTime") AS hour_bucket,
             COUNT(*)                        AS visits
      FROM   "PageVisit", bounds
      WHERE  "visitTime" >= bounds.start_time
        AND  "visitTime" <  bounds.end_time
      GROUP  BY hour_bucket
    )
    SELECT h.hour_bucket,
           COALESCE(v.visits, 0) AS visits
    FROM   hours h
    LEFT JOIN visits v USING (hour_bucket)
    ORDER  BY h.hour_bucket;
  `;

  const start = rows.at(0)!.hour_bucket;
  const end = new Date(start.getTime() + 24 * 60 * 60 * 1000); // 24 jam dari start

  return {
    range: {
      start: start.toISOString(),
      end: end.toISOString(),
    },
    data: rows.map((r) => ({
      hour: r.hour_bucket.toISOString(),
      visits: Number(r.visits),
    })),
  };
}

/////////////////////////////////////

// GET VISIT

type TimeRange = '24h' | '7d' | '30d' | '3mo' | '6mo' | '1y';

export async function getVisits(range: TimeRange) {
  let timeInterval: string;
  let groupBy: 'hour' | 'day' | 'month';

  switch (range) {
    case '24h':
      timeInterval = `'24 hours'`;
      groupBy = 'hour';
      break;
    case '7d':
      timeInterval = `'7 days'`;
      groupBy = 'day';
      break;
    case '30d':
      timeInterval = `'30 days'`;
      groupBy = 'day';
      break;
    case '3mo':
      timeInterval = `'3 months'`;
      groupBy = 'day';
      break;
    case '6mo':
      timeInterval = `'6 months'`;
      groupBy = 'month';
      break;
    case '1y':
      timeInterval = `'12 months'`;
      groupBy = 'month';
      break;
    default:
      throw new Error('Invalid range');
  }

  const rows = await prisma.$queryRawUnsafe<
    { bucket: Date; visits: bigint }[]
  >(`
  WITH bounds AS (
    SELECT date_trunc('${groupBy}', now()) - INTERVAL '${range}' AS start_time,
           date_trunc('${groupBy}', now()) + INTERVAL '1 ${groupBy}' AS end_time
  ),
  buckets AS (
    SELECT generate_series(start_time,
                           end_time - INTERVAL '1 ${groupBy}',
                           INTERVAL '1 ${groupBy}') AS bucket
    FROM bounds
  ),
  visits AS (
    SELECT date_trunc('${groupBy}', "visitTime") AS bucket,
           COUNT(*) AS visits
    FROM "PageVisit", bounds
    WHERE "visitTime" >= bounds.start_time
      AND "visitTime" < bounds.end_time
    GROUP BY bucket
  )
  SELECT b.bucket,
         COALESCE(v.visits, 0) AS visits
  FROM buckets b
  LEFT JOIN visits v USING (bucket)
  ORDER BY b.bucket;
`);

  const start = rows.at(0)!.bucket;
  const end = rows.at(-1)!.bucket;

  return {
    range: {
      start: start.toISOString(),
      end: new Date(end.getTime() + getIntervalMs(groupBy)).toISOString(),
    },
    data: rows.map((r) => ({
      time: r.bucket.toISOString(),
      visits: Number(r.visits),
    })),
  };
}

// GET Yeseterday Rush Hour, top 6

export async function getTopHoursYesterday() {
  const tz = 'Asia/Jakarta';

  /* ── 1. Hitung rentang waktu “kemarin” ─────────────────────────────── */
  const now = DateTime.now().setZone(tz); // waktu lokal
  const startLocal = now.minus({ days: 1 }).startOf('day'); // 00:00 kemarin (lokal)
  const endLocal = startLocal.plus({ days: 1 }); // 00:00 hari ini (lokal)

  // Konversi ke UTC (JS Date) untuk dipakai di query
  const startUtc = startLocal.toUTC().toJSDate();
  const endUtc = endLocal.toUTC().toJSDate();

  /* ── 2. SQL: group‑by per jam, urutkan desc, ambil 6 ───────────────── */
  const rows = await prisma.$queryRaw<{ hour: Date; visits: bigint }[]>`
    SELECT DATE_TRUNC('hour', "visitTime") AS hour,
           COUNT(*)                       AS visits
    FROM   "PageVisit"
    WHERE  "visitTime" >= ${startUtc}
      AND  "visitTime" <  ${endUtc}
    GROUP  BY hour
    ORDER  BY visits DESC
    LIMIT  6;
  `;

  /* ── 3. Format hasil untuk klien ───────────────────────────────────── */
  return rows.map((r) => ({
    hour: DateTime.fromJSDate(r.hour).setZone(tz).toFormat('HH:mm'),
    visits: Number(r.visits),
  }));
}

// //////////////////////////////////////////////////////////////////////////////////////

function getIntervalMs(groupBy: 'hour' | 'day' | 'month') {
  const hour = 60 * 60 * 1000;
  const day = 24 * hour;
  switch (groupBy) {
    case 'hour':
      return hour;
    case 'day':
      return day;
    case 'month':
      return 30 * day; // approx
  }
}

////////////////////////////////////////////////////////////////
// GET top city

export async function getCityActivityLast30Days() {
  const tz = 'Asia/Jakarta';

  /* 1️⃣  Rentang waktu 30 hari terakhir */
  const now = DateTime.now().setZone(tz);
  const startUtc = now.minus({ days: 30 }).startOf('day').toUTC().toJSDate();
  const endUtc = now.toUTC().toJSDate();

  /* 2️⃣  Group by "country" & "city", hitung kunjungan, urutkan, ambil 5 */
  const rows = await prisma.pageVisit.groupBy({
    by: ['country', 'city'],
    where: {
      visitTime: { gte: startUtc, lt: endUtc },
      city: { not: null }, // abaikan baris tanpa city
      country: { not: null }, // abaikan baris tanpa country
    },
    _count: { id: true }, // COUNT(id) → jumlah kunjungan
    orderBy: { _count: { id: 'desc' } },
    take: 5,
  });

  /* 3️⃣  Format hasil */
  return rows.map((r) => ({
    city: r.city ?? 'Unknown',
    country: r.country ?? 'Unknown',
    visits: r._count.id,
  }));
}

////////////////////////////////////////////////////////////////////////////////////////
// GET popular category

export async function getCategoryVisitStats() {
  const tz = 'Asia/Jakarta';

  /* 1️⃣  Rentang 30 hari terakhir (zona Asia/Jakarta) */
  const now = DateTime.now().setZone(tz);
  const startUtc = now.minus({ days: 30 }).startOf('day').toUTC().toJSDate();
  const endUtc = now.toUTC().toJSDate();

  /* 2️⃣  SQL raw: split path, group by, order desc, LIMIT 5 */
  const rows = await prisma.$queryRaw<{ category: string; visits: bigint }[]>`
    SELECT
      SPLIT_PART("path", '/', 3) AS category,  -- '/category/hukum' → 'hukum'
      COUNT(*)                   AS visits
    FROM "PageVisit"
    WHERE "pageType"  = 'category'
      AND "visitTime" >= ${startUtc}
      AND "visitTime" <  ${endUtc}
      AND "path" LIKE '/category/%'
    GROUP BY category
    ORDER BY visits DESC
    LIMIT 5;                                  -- ⬅️ top‑5 saja
  `;

  /* 3️⃣  Normalisasi hasil */
  return rows.map((r) => ({
    category: r.category ?? 'unknown',
    visits: Number(r.visits),
  }));
}

//////////////////////////////////////////////////////////////////////////////////////

// GET user device

export async function getDeviceVisitPerDay() {
  const tz = 'Asia/Jakarta';

  /* 1️⃣  Hitung titik waktu penting */
  const now = DateTime.now().setZone(tz); // detik ini, zona lokal
  const start = now.startOf('day').minus({ days: 30 }); // 00:00, 30 hari lalu
  const startUtc = start.toUTC().toJSDate();
  const endUtc = now.toUTC().toJSDate(); // batas atas ekskl.

  /* 2️⃣  Buat deretan tanggal (seed) agar hari tanpa data tetap ada */
  const dayCount = Math.floor(now.startOf('day').diff(start, 'days').days) + 1; // biasanya 31
  const dates = Array.from({ length: dayCount }).map((_, i) => {
    const date = start.plus({ days: i }).toISODate(); // 'YYYY‑MM‑DD'
    return { date, desktop: 0, mobile: 0 };
  });
  const map = new Map(dates.map((d) => [d.date, d]));

  /* 3️⃣  Query: kelompokkan per tanggal (lokal) + deviceType */
  const rows = await prisma.$queryRaw<
    { day: string; deviceType: string; count: bigint }[]
  >`
    SELECT
      TO_CHAR("visitTime" AT TIME ZONE 'Asia/Jakarta', 'YYYY-MM-DD') AS day,
      "deviceType",
      COUNT(*) AS count
    FROM "PageVisit"
    WHERE "visitTime" >= ${startUtc}
      AND "visitTime" <  ${endUtc}
      AND "deviceType" IN ('desktop', 'mobile')
    GROUP BY day, "deviceType";
  `;

  /* 4️⃣  Masukkan hasil query ke seed array */
  for (const row of rows) {
    const rec = map.get(row.day); // selalu ada karena kita seed semua hari
    if (rec && (row.deviceType === 'desktop' || row.deviceType === 'mobile')) {
      rec[row.deviceType] = Number(row.count);
    }
  }

  return dates; // terurut kronologis
}
