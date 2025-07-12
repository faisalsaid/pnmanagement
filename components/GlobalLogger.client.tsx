'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { logVisit } from '@/actions/logVisit';

// function getOrSetSessionId() {
//   let sid = document.cookie.match(/sid=([^;]+)/)?.[1];
//   if (!sid) {
//     sid = uuid();
//     document.cookie = `sid=${sid};path=/;SameSite=Lax;max-age=1800`;
//   }
//   return sid;
// }

export default function GlobalLogger() {
  const pathname = usePathname();
  const search = useSearchParams();

  useEffect(() => {
    const isCategory = pathname.startsWith('/category');
    const isArticle = pathname.startsWith('/read/');
    const articleSLug = isArticle ? pathname.split('/')[2] || null : null;
    // console.log(articleSLug);

    const pageType: 'category' | 'article' | 'page' = isCategory
      ? 'category'
      : isArticle
      ? 'article'
      : 'page';

    // panggil server action (otomatis POST internal Next.js)
    logVisit({
      url: window.location.href,
      path: pathname,
      pageType,
      referrer: document.referrer || null,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      language: navigator.language,
      screen: `${window.innerWidth}x${window.innerHeight}`,
      // articleId bisa di‑set jika slug/artikel tersedia di halaman
      articleSlug: articleSLug,
    }).catch(() => {});
  }, [pathname, search]);

  return null;
}
