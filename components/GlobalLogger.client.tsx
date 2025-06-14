'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { v4 as uuid } from 'uuid';
import { logVisit } from '@/action/logVisit';

function getOrSetSessionId() {
  let sid = document.cookie.match(/sid=([^;]+)/)?.[1];
  if (!sid) {
    sid = uuid();
    document.cookie = `sid=${sid};path=/;SameSite=Lax;max-age=1800`;
  }
  return sid;
}

export default function GlobalLogger() {
  const pathname = usePathname();
  const search = useSearchParams();

  useEffect(() => {
    // panggil server action (otomatis POST internal Next.js)
    logVisit({
      sessionId: getOrSetSessionId(),
      url: window.location.href,
      path: pathname,
      pageType: pathname.startsWith('/artikel') ? 'article' : 'page',
      referrer: document.referrer || null,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      language: navigator.language,
      screen: `${window.innerWidth}x${window.innerHeight}`,
      // articleId bisa di‑set jika slug/artikel tersedia di halaman
      articleId: null,
    }).catch(() => {});
  }, [pathname, search]);

  return null;
}
