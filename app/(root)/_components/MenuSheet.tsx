'use client';

// import { Button } from '@/components/ui/button';
import { LogIn, LogOutIcon, Menu } from 'lucide-react';
import {
  Sheet,
  SheetClose,
  SheetContent,
  //   SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { signOut } from 'next-auth/react';
import { Session } from 'next-auth';

export type Category = {
  id: string;
  name: string;
  slug: string;
};

// 2. Props komponen
interface CategoryListProps {
  categories: Category[];
  session: Session | null;
}

const MenuSheet = ({ categories, session }: CategoryListProps) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Menu />
      </SheetTrigger>
      <SheetContent side="left" className="w-[250px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle>Daily Express</SheetTitle>
        </SheetHeader>
        <div className="px-4 ">
          <nav>
            <ul className="flex flex-col gap-2 font-medium ">
              <SheetClose asChild>
                <Link
                  className="border-b-1 border-transparent hover:border-red-500/50 py-1 transition-all"
                  href={'/'}
                >
                  Beranda
                </Link>
              </SheetClose>
              {categories &&
                categories.map((category) => (
                  <SheetClose key={category?.id} asChild>
                    <Link
                      className="border-b-1 border-transparent hover:border-red-500/50 py-1 transition-all"
                      key={category?.id}
                      href={`/category/${category?.slug}`}
                    >
                      {category?.name}
                    </Link>
                  </SheetClose>
                ))}
            </ul>
          </nav>
        </div>
        <SheetFooter>
          {session && <p>Hi, {session.user.name}</p>}
          {!session ? (
            <Link className="" href={'/auth/login'}>
              <Button className="w-full" variant={'outline'}>
                <LogIn className="h-[1.2rem] w-[1.2rem] mr-2" />
                Login
              </Button>
            </Link>
          ) : (
            <Button
              onClick={() => signOut({ redirectTo: '/' })}
              variant={'outline'}
            >
              <LogOutIcon className="h-[1.2rem] w-[1.2rem] mr-2" />
              Logout
            </Button>
          )}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default MenuSheet;
