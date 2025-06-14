// app/_actions/logVisit.ts
'use server';

import { cookies, headers } from 'next/headers';
import { UAParser } from 'ua-parser-js';
import prisma from '@/lib/prisma';
import { WebServiceClient } from '@maxmind/geoip2-node';
import { auth } from '@/auth';
import { startOfDay, endOfDay } from 'date-fns';

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
  console.log('Unique sessions today:', count);
  return count;
}
