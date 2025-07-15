'use client';

import { formatIndonesianDate } from '@/lib/helper/formatDate';
import { Prisma } from '@prisma/client';
import { signOut } from 'next-auth/react';

import {
  House,
  LayoutDashboard,
  LogOutIcon,
  Moon,
  Sun,
  User,
} from 'lucide-react';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import MenuSheet from './MenuSheet';
import { Session } from 'next-auth';
import { useTheme } from 'next-themes';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

interface WebFooterProps {
  categories: Prisma.CategoryGetPayload<true>[];
  session: Session | null;
}

const WebHeader = ({ categories, session }: WebFooterProps) => {
  const { setTheme } = useTheme();

  const isAllowed =
    session?.user.role &&
    ['ADMIN', 'PEMRED', 'REDAKTUR', 'TESTER', 'REPORTER'].includes(
      session.user.role,
    );

  const [permission, setPermission] = useState(isAllowed);

  useEffect(() => {
    setPermission(isAllowed);
  }, [isAllowed]);

  const toExclude = ['uncategorized', 'headline'];
  const priority = ['utama', 'politik', 'ekonomi'];

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
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setTheme('light')}>
                Light
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme('dark')}>
                Dark
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme('system')}>
                System
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <div>
            {/* {permission ? (
              
            ) : null} */}
            {!session ? (
              <Link className="flex gap-1 items-center " href={'/auth/login'}>
                <User size={16} />
                Sign in
              </Link>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Avatar className="hover:cursor-pointer">
                    <AvatarImage
                      src={session?.user.image as string}
                      alt={'profile'}
                    />
                    <AvatarFallback>!</AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent sideOffset={10}>
                  <DropdownMenuLabel>
                    <div className=" sm:hidden">
                      <p className="capitalize line-clamp-1 ">
                        {session?.user.name}
                      </p>
                      {/* <p className="text-xs text-muted-foreground capitalize">
                  {data?.user.role.toLocaleLowerCase()}
                </p> */}
                    </div>
                    <p className="hidden sm:block">My Account</p>
                  </DropdownMenuLabel>

                  <DropdownMenuSeparator />
                  {permission ? (
                    <>
                      <Link href={'/dashboard'}>
                        <DropdownMenuItem>
                          <LayoutDashboard className="h-[1.2rem] w-[1.2rem] mr-2" />
                          Dashboard
                        </DropdownMenuItem>
                      </Link>
                      <Link href={'/profile'}>
                        <DropdownMenuItem>
                          <User className="h-[1.2rem] w-[1.2rem] mr-2" />
                          Profile
                        </DropdownMenuItem>
                      </Link>
                    </>
                  ) : null}
                  <Link href={'/room'}>
                    <DropdownMenuItem>
                      <House className="h-[1.2rem] w-[1.2rem] mr-2" />
                      My Room
                    </DropdownMenuItem>
                  </Link>
                  <DropdownMenuItem variant="destructive">
                    <Button
                      onClick={() => signOut({ redirectTo: '/' })}
                      variant={'outline'}
                    >
                      <LogOutIcon className="h-[1.2rem] w-[1.2rem] mr-2" />
                      Logout
                    </Button>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
          <div className="block md:hidden">
            <MenuSheet categories={cleanCategories} session={session} />
          </div>
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
