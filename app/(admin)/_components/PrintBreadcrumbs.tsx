'use client';

import { usePathname } from 'next/navigation';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { ChevronRight } from 'lucide-react';

const PrintBreadcrumbs = () => {
  const pathname = usePathname(); // contoh: '/dashboard/settings
  const segments = pathname.split('/').filter(Boolean); // ['dashboard', 'settings']

  function splitLast<T>(arr: T[]) {
    return [arr.slice(0, -1), arr[arr.length - 1]] as const;
  }
  const [rests, last] = splitLast(segments);

  return (
    <div className="p-4">
      <Breadcrumb>
        <BreadcrumbList className="">
          {rests.map((segment, i) => {
            const href = `/${segments.slice(0, i + 1).join('/')}`;
            return (
              <div key={i} className="flex items-center gap-1">
                <BreadcrumbItem
                  key={i}
                  className="bg-primary-foreground border py-1 px-2 rounded-sm"
                >
                  <BreadcrumbLink className="capitalize" href={href}>
                    {decodeURIComponent(segment)}
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator>
                  <ChevronRight />
                </BreadcrumbSeparator>
              </div>
            );
          })}
          <BreadcrumbItem>
            <BreadcrumbPage className="capitalize">{last}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
};

export default PrintBreadcrumbs;
