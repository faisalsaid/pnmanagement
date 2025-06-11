'use client';

import { formatIndonesianDate } from '@/lib/helper/formatDate';

import { User } from 'lucide-react';
import Link from 'next/link';

const dumyNavbarList = [
  { title: 'Beranda', url: '/' },
  { title: 'Politik', url: '/category/politik' },
  { title: 'Hukum', url: '/category/hukum' },
];

const WebHeader = () => {
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
          <div className="flex gap-1 items-center ">
            <User size={16} />
            Sign in
          </div>
        </div>
      </div>
      <nav>
        <ul className="hidden md:flex gap-6 text-sm font-medium">
          {dumyNavbarList &&
            dumyNavbarList.map((menu) => (
              <Link
                className="border-b-4 border-transparent hover:border-red-500 py-1 transition-all"
                key={menu.url}
                href={menu.url}
              >
                {menu.title}
              </Link>
            ))}
        </ul>
      </nav>
    </header>
  );
};

export default WebHeader;
