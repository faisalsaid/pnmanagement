'use client';

import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import React from 'react';
import Link from 'next/link';

export type Category = {
  id: string;
  name: string;
  slug: string;
};

// 2. Props komponen
interface CategoryListProps {
  categories: Category[];
}

const MenuSheet = ({ categories }: CategoryListProps) => {
  //   console.log(categories);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button className="sm:hidden" size={'icon'} variant={'ghost'}>
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[200px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle>Daily Express</SheetTitle>
          {/* <SheetDescription>
            Make changes to your profile here. Click save when you&apos;re done.
          </SheetDescription> */}
        </SheetHeader>
        <div className="px-4 ">
          <nav>
            <ul className="flex flex-col gap-2 text-sm font-medium ">
              <Link
                className="border-b-1 border-transparent hover:border-red-500/50 py-1 transition-all"
                href={'/'}
              >
                Beranda
              </Link>
              {categories &&
                categories.map((category) => (
                  <React.Fragment key={category?.id}>
                    <Link
                      className="border-b-1 border-transparent hover:border-red-500/50 py-1 transition-all"
                      key={category?.id}
                      href={`/category/${category?.slug}`}
                    >
                      {category?.name}
                    </Link>
                  </React.Fragment>
                ))}
            </ul>
          </nav>
        </div>
        <SheetFooter></SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default MenuSheet;
