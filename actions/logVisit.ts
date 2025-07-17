// app/_actions/logVisit.ts
'use server';

import { cookies, headers } from 'next/headers';
import { UAParser } from 'ua-parser-js';
import prisma from '@/lib/prisma';
import { WebServiceClient } from '@maxmind/geoip2-node';
import { auth } from '@/auth';
import {
  startOfDay,
  endOfDay,
  // subDays
} from 'date-fns';
// import { Prisma } from '@prisma/client';
import { fromZonedTime, toZonedTime } from 'date-fns-tz';
import { DateTime, DurationLikeObject } from 'luxon';

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
  // 1) Current time in UTC ➜ convert to Jayapura time (UTC+9)
  const zonedNow = toZonedTime(new Date(), TZ);

  // 2) Set time to 00:00 (start of today in Jayapura time)
  const startOfTodayZoned = startOfDay(zonedNow);

  // 3) Reconvert to UTC (visitTime column uses UTC)
  const startOfTodayUtc = fromZonedTime(startOfTodayZoned, TZ);

  // 4) Count total hits since local time 00:00 until now
  const totalHits = await prisma.pageVisit.count({
    where: {
      visitTime: {
        gte: startOfTodayUtc,
        lte: new Date(), // current time (UTC)
      },
    },
  });

  return totalHits;
}

////////////////////////////////////////////////////////////

// GET VISIT

export type GetVisitsTimeRange = '24h' | '7d' | '30d' | '3mo' | '6mo' | '1y';

export async function getVisits(range: GetVisitsTimeRange) {
  let sqlInterval: string;
  let groupBy: 'hour' | 'day' | 'month';

  switch (range) {
    case '24h':
      sqlInterval = '24 hours';
      groupBy = 'hour';
      break;
    case '7d':
      sqlInterval = '7 days';
      groupBy = 'day';
      break;
    case '30d':
      sqlInterval = '30 days';
      groupBy = 'day';
      break;
    case '3mo':
      sqlInterval = '3 months';
      groupBy = 'day';
      break;
    case '6mo':
      sqlInterval = '6 months';
      groupBy = 'month';
      break;
    case '1y':
      sqlInterval = '1 year';
      groupBy = 'month';
      break;
    default:
      throw new Error('Invalid range');
  }

  const rows = await prisma.$queryRawUnsafe<
    { bucket: Date; visits: bigint }[]
  >(`
  WITH bounds AS (
    SELECT date_trunc('${groupBy}', now()) - INTERVAL '${sqlInterval}' AS start_time,
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

///////////////////////////////////

// GET visitor by device

function getRangeStartAndInterval(range: GetVisitsTimeRange): {
  start: Date;
  interval: 'hour' | 'day' | 'month';
} {
  const now = new Date();
  const start = new Date(now);

  switch (range) {
    case '24h':
      start.setHours(now.getHours() - 24);
      return { start, interval: 'hour' };
    case '7d':
      start.setDate(now.getDate() - 7);
      return { start, interval: 'day' };
    case '30d':
      start.setDate(now.getDate() - 30);
      return { start, interval: 'day' };
    case '3mo':
      start.setMonth(now.getMonth() - 3);
      return { start, interval: 'day' };
    case '6mo':
      start.setMonth(now.getMonth() - 6);
      return { start, interval: 'month' };
    case '1y':
      start.setFullYear(now.getFullYear() - 1);
      return { start, interval: 'month' };
  }
}

export async function getVisitDeviceStats(range: GetVisitsTimeRange) {
  const { start, interval } = getRangeStartAndInterval(range);
  const now = new Date();

  const result = await prisma.$queryRawUnsafe<
    { bucket: string; deviceType: string | null; count: number }[]
  >(
    `
    WITH buckets AS (
      SELECT generate_series(
        date_trunc($3, $1::timestamptz),
        date_trunc($3, $2::timestamptz),
        ('1 ' || $3)::interval
      ) AS bucket
    ),
    counts AS (
      SELECT 
        date_trunc($3, "visitTime") AS bucket,
        LOWER(COALESCE("deviceType", 'unknown')) AS "deviceType",
        COUNT(*) AS count
      FROM "PageVisit"
      WHERE "visitTime" BETWEEN $1 AND $2
      GROUP BY bucket, "deviceType"
    )
    SELECT 
      b.bucket,
      c."deviceType",
      COALESCE(c.count, 0) AS count
    FROM buckets b
    LEFT JOIN counts c ON b.bucket = c.bucket
    ORDER BY b.bucket ASC
    `,
    start,
    now,
    interval, // 'hour', 'day', or 'month'
  );

  // Normalize the output as an array of { time, mobile, desktop } objects
  const grouped: Record<
    string,
    { time: string; mobile: number; desktop: number }
  > = {};

  for (const row of result) {
    const bucketISO = new Date(row.bucket).toISOString();
    if (!grouped[bucketISO]) {
      grouped[bucketISO] = {
        time: bucketISO,
        mobile: 0,
        desktop: 0,
      };
    }

    const raw = row.deviceType;
    const mapped =
      raw === 'tablet' || raw === 'mobile'
        ? 'mobile'
        : raw === 'desktop'
        ? 'desktop'
        : null;

    if (mapped) {
      grouped[bucketISO][mapped] += Number(row.count);
    }
  }

  return Object.values(grouped);
}
