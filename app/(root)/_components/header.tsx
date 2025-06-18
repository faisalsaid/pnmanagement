'use client';

import { formatIndonesianDate } from '@/lib/helper/formatDate';
import { Prisma } from '@prisma/client';

import { User } from 'lucide-react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import React from 'react';
import MenuSheet from './MenuSheet';

interface WebFooterProps {
  categories: Prisma.CategoryGetPayload<true>[];
}

const WebHeader = ({ categories }: WebFooterProps) => {
  const { data: session } = useSession();
  const toExclude = ['uncategorized', 'headline', 'utama'];
  const priority = ['politik', 'ekonomi'];

  const filtered = categories.filter(
    (cat): cat is Prisma.CategoryGetPayload<true> =>
      !toExclude.includes(cat.slug),
  );

  const prioritized = priority
    .map((slug) => filtered.find((cat) => cat.slug === slug))
    .filter((cat): cat is Prisma.CategoryGetPayload<true> => cat !== undefined);

  const others = filtered.filter((cat) => !priority.includes(cat.slug));

  const cleanCategories: Prisma.CategoryGetPayload<true>[] = [
    ...prioritized,
    ...others,
  ];

  return (
    <header className="">
      <div className="sm:grid grid-cols-3 text-sm text-muted-foreground flex items-center justify-between">
        <div className="hidden sm:flex items-center gap-4 ">
          <p>{formatIndonesianDate()}</p>
          {/* <p>weather</p> */}
        </div>
        <div className="sm:flex items-center justify-center gap-4 py-4">
          <h1 className="text-lg sm:text-2xl font-bold  text-orange-600">
            DAILY EXPRESS
          </h1>
          <p className=" sm:hidden">{formatIndonesianDate()}</p>
        </div>
        <div className="flex items-center gap-2 justify-end">
          {/* <div>serch article</div> */}
          <div>
            {session ? (
              <div>
                <Link href={'/dashboard'}>Beranda</Link>
              </div>
            ) : (
              <Link className="flex gap-1 items-center " href={'/auth/login'}>
                <User size={16} />
                Sign in
              </Link>
            )}
          </div>
          <MenuSheet categories={cleanCategories} />
        </div>
      </div>
      <nav>
        <ul className="hidden md:flex gap-6 text-sm font-medium items-center">
          <Link
            className="border-b-4 border-transparent hover:border-red-500 py-1 transition-all"
            href={'/'}
          >
            Beranda
          </Link>
          {cleanCategories &&
            cleanCategories.map((category) => (
              <React.Fragment key={category?.id}>
                <Link
                  className="border-b-4 border-transparent hover:border-red-500 py-1 transition-all"
                  key={category?.id}
                  href={`/category/${category?.slug}`}
                >
                  {category?.name}
                </Link>
              </React.Fragment>
            ))}
        </ul>
      </nav>
    </header>
  );
};

export default WebHeader;
