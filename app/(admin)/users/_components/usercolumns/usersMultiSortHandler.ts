'use client';

import { useRouter, useSearchParams } from 'next/navigation';

export function usersMultiSortHandler(columnId: string) {
  const router = useRouter();
  const searchParams = useSearchParams();

  return () => {
    const sortByParam = searchParams.get('sortBy') || '';
    const sortOrderParam = searchParams.get('sortOrder') || '';

    const sortBy = sortByParam ? sortByParam.split(',') : [];
    const sortOrder = sortOrderParam ? sortOrderParam.split(',') : [];

    const index = sortBy.indexOf(columnId);

    if (index === -1) {
      // Add new column with asc order
      sortBy.push(columnId);
      sortOrder.push('asc');
    } else {
      // Toggle order asc <-> desc
      sortOrder[index] = sortOrder[index] === 'asc' ? 'desc' : 'asc';
    }

    // Reset page to 1 on sort change
    const params = new URLSearchParams(searchParams.toString());
    params.set('sortBy', sortBy.join(','));
    params.set('sortOrder', sortOrder.join(','));
    params.set('page', '1');

    router.push(`/users?${params.toString()}`);
  };
}
