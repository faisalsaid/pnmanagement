// app/_actions/logVisit.ts
'use server';

import { headers } from 'next/headers';
import { UAParser } from 'ua-parser-js';
import prisma from '@/lib/prisma';
import { WebServiceClient } from '@maxmind/geoip2-node';

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

// tipe data yang diterima dari client
export type ClientLogPayload = {
  sessionId: string;
  url: string;
  path: string;
  pageType: 'article' | 'page' | 'category' | 'other';
  referrer?: string | null;
  timezone: string;
  language: string;
  screen: string;
  articleSlug?: string | null;
};

// server action: boleh side‑effect
export async function logVisit(payload: ClientLogPayload) {
  /* ── Header yang hanya bisa di server ── */
  const h = await headers();

  // Ambil IP dari header (prioritaskan x-forwarded-for)
  let ip =
    (h.get('x-forwarded-for') || '').split(',')[0].trim() ||
    h.get('x-real-ip') ||
    '127.0.0.1';

  // Bersihkan prefix IPv6-mapped
  if (ip.startsWith('::ffff:')) {
    ip = ip.replace('::ffff:', '');
  }

  // Parse user agent
  const ua = new UAParser(h.get('user-agent') || '').getResult();

  // Default geo location
  let city: string | null = null;
  let country: string | null = null;

  try {
    const geo = await client.city(ip);
    city = geo.city?.names?.en || null;
    country = geo.country?.isoCode || null;
  } catch (err) {
    console.warn('MaxMind lookup failed:', err);
  }

  console.log(payload.articleSlug);

  let articleId: string | null = null;

  if (payload.articleSlug) {
    const article = await prisma.article.findUnique({
      where: {
        slug: payload.articleSlug,
      },
      select: {
        id: true,
      },
    });

    articleId = article?.id ?? null;
  }

  console.log('ARTICLE ID ', articleId);

  await prisma.pageVisit.create({
    data: {
      sessionId: payload.sessionId,
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
