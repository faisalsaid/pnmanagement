'use client';

import { formatIndonesianDate } from '@/lib/helper/formatDate';
import { Prisma } from '@prisma/client';

import { User } from 'lucide-react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import React from 'react';

// const dumyNavbarList = [
//   { title: 'Beranda', url: '/' },
//   { title: 'Politik', url: '/category/politik' },
//   { title: 'Hukum', url: '/category/hukum' },
// ];

interface WebFooterProps {
  categories: Prisma.CategoryGetPayload<true>[];
}

const WebHeader = ({ categories }: WebFooterProps) => {
  const toExclude = ['uncategorized', 'headline'];
  const { data: session } = useSession();

  const filtered = categories.filter((cat) => !toExclude.includes(cat.slug));
  const priority = ['politik', 'ekonomi'];
  const cleanCategories = [
    ...priority
      .map((slug) => filtered.find((cat) => cat.slug === slug))
      .filter(Boolean),
    ...filtered.filter((cat) => !priority.includes(cat.slug)),
  ];
  return (
    <header className="">
      <div className="grid grid-cols-3 text-sm text-muted-foreground">
        <div className="flex items-center gap-4">
          <p>{formatIndonesianDate()}</p>
          {/* <p>weather</p> */}
        </div>
        <div className="flex items-center justify-center gap-4">
          <h1 className="text-2xl font-bold p-2 text-orange-600">
            DAILY EXPRESS
          </h1>
        </div>
        <div className="flex items-center gap-4 justify-end">
          {/* <div>serch article</div> */}
          {session ? (
            <div>
              <Link href={'/dashboard'}>Beranda</Link>{' '}
            </div>
          ) : (
            <div className="flex gap-1 items-center ">
              <User size={16} />
              Sign in
            </div>
          )}
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
