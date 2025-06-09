'use client';

import { useState } from 'react';
import { CircleX, Filter, Search, XCircle } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Command,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Prisma } from '@prisma/client';
import DateRangeFilter from '@/components/DateRangePicker';

const statuses = ['DRAFT', 'REVIEW', 'PUBLISHED', 'ARCHIVED'] as const;

type PostFilterBarProps = {
  author: Prisma.UserGetPayload<{
    select: {
      id: true;
      name: true;
    };
  }>[];
  categories: Prisma.CategoryGetPayload<{
    select: {
      id: true;
      name: true;
      slug: true;
    };
  }>[];
};

type DateRange = {
  from: Date | undefined;
  to: Date | undefined;
};

export default function PostFilterBar({
  author,
  categories,
}: PostFilterBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const selectedStatus = searchParams.get('status') || '';
  const selectedAuthor = searchParams.get('authorId') || '';
  const selectedCategory = searchParams.get('categoryId') || '';
  const search = searchParams.get('search') || '';
  const selectDateFrom = searchParams.get('createdFrom') || '';
  const selectDateTo = searchParams.get('createdTo') || '';
  const selectSortBy = searchParams.get('sortBy') || '';

  const [openStatus, setOpenStatus] = useState(false);
  const [openAuthor, setOpenAuthor] = useState(false);
  const [openCategories, setOpenCategories] = useState(false);
  const [searchText, setSearchText] = useState(search);
  const [dateRange, setDateRange] = useState<DateRange>({
    from: selectDateFrom ? new Date(selectDateFrom) : undefined,
    to: selectDateTo ? new Date(selectDateTo) : undefined,
  });

  const updateParams = (updateFn: (params: URLSearchParams) => void) => {
    const params = new URLSearchParams(searchParams.toString());
    updateFn(params);
    params.set('page', '1'); // always reset page
    router.push(`/posts?${params.toString()}`);
  };

  return (
    <div className="flex items-center justify-between gap-4 ">
      <div className="flex items-center gap-2 border p-2 rounded-md w-full">
        <Search />
        <input
          className="w-full p-1 focus:border-0 focus:outline-none "
          type="text"
          placeholder="Search article..."
          onChange={(e) => {
            setSearchText(e.target.value);
            updateParams((params) => params.set('search', e.target.value));
          }}
          value={searchText}
        />
        {search && (
          <div className="-ml-5">
            <XCircle
              size={16}
              className="ml-2 cursor-pointer text-red-600"
              onClick={(e) => {
                e.stopPropagation();
                setSearchText('');
                updateParams((params) => params.delete('search'));
              }}
            />
          </div>
        )}
      </div>
      <Popover open={openAuthor} onOpenChange={setOpenAuthor}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="min-w-fit justify-start flex items-center gap-2"
          >
            <Filter />
            <span>
              {selectedAuthor
                ? `Author: ${author
                    .filter((user) => user.id === selectedAuthor)
                    .map((user) => user.name)}`
                : 'By Author'}
            </span>
          </Button>
        </PopoverTrigger>
        {selectedAuthor && (
          <div className="-ml-5">
            <XCircle
              size={16}
              className="ml-2 cursor-pointer text-red-600"
              onClick={(e) => {
                e.stopPropagation();
                updateParams((params) => params.delete('authorId'));
              }}
            />
          </div>
        )}
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandInput placeholder="Search Author..." />
            <CommandList>
              {author?.map((user) => (
                <CommandItem
                  key={user.id}
                  onSelect={() => {
                    updateParams((params) => params.set('authorId', user.id));
                    setOpenAuthor(false);
                  }}
                >
                  {user.name}
                </CommandItem>
              ))}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {/* Category Filter */}
      <Popover open={openCategories} onOpenChange={setOpenCategories}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="min-w-fit justify-start flex items-center gap-2"
          >
            <Filter />
            <span>
              {selectedCategory
                ? `Category: ${categories
                    .filter((category) => category.id === selectedCategory)
                    .map((category) => category.name)}`
                : 'By Category'}
            </span>
          </Button>
        </PopoverTrigger>
        {selectedCategory && (
          <div className="-ml-5">
            <XCircle
              size={16}
              className="ml-2 cursor-pointer text-red-600"
              onClick={(e) => {
                e.stopPropagation();
                updateParams((params) => params.delete('categoryId'));
              }}
            />
          </div>
        )}

        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandInput placeholder="Search Category..." />
            <CommandList>
              {categories?.map((category) => (
                <CommandItem
                  key={category.id}
                  onSelect={() => {
                    updateParams((params) =>
                      params.set('categoryId', category.id),
                    );
                    setOpenCategories(false);
                  }}
                >
                  {category.name}
                </CommandItem>
              ))}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      <Popover open={openStatus} onOpenChange={setOpenStatus}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="min-w-fit justify-start flex items-center gap-2"
          >
            <Filter />
            <span>
              {selectedStatus ? `Status: ${selectedStatus}` : 'By Status'}
            </span>
          </Button>
        </PopoverTrigger>
        {selectedStatus && (
          <div className="-ml-5">
            <XCircle
              size={16}
              className="ml-2 cursor-pointer text-red-600"
              onClick={(e) => {
                e.stopPropagation();
                updateParams((params) => params.delete('status'));
              }}
            />
          </div>
        )}
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandInput placeholder="Search status..." />
            <CommandList>
              {statuses.map((status) => (
                <CommandItem
                  key={status}
                  onSelect={() => {
                    updateParams((params) => params.set('status', status));
                    setOpenStatus(false);
                  }}
                >
                  {status}
                </CommandItem>
              ))}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      <DateRangeFilter
        value={dateRange}
        onChange={(range) => {
          setDateRange(range);
          updateParams((params) => {
            if (range.from) params.set('createdFrom', range.from.toISOString());
            else params.delete('createdFrom');
            if (range.to) params.set('createdTo', range.to.toISOString());
            else params.delete('createdTo');
          });
        }}
      />

      {/* Reset All */}
      {(search ||
        selectedStatus ||
        selectedAuthor ||
        selectedCategory ||
        selectDateFrom ||
        selectDateTo ||
        selectSortBy) && (
        <Button
          variant="ghost"
          className="bg-red-400 text-white hover:text-white hover:bg-red-500 dark:hover:bg-red-500"
          onClick={() => {
            router.push('/posts');
            setDateRange({ from: undefined, to: undefined });
          }}
        >
          <CircleX /> <span>Reset All Filter</span>
        </Button>
      )}
    </div>
  );
}
