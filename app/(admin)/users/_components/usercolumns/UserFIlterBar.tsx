'use client';

import { Filter, RotateCcw, Search, XCircle } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

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

const role = [
  'ADMIN',
  'PEMRED',
  'REDAKTUR',
  'REPORTER',
  'TESTER',
  'USER',
] as const;

const UserFIlterBar = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const search = searchParams.get('search') || '';
  const [searchText, setSearchText] = useState(search);

  const selectedRole = searchParams.get('role') || '';

  const [openRole, setOpenRole] = useState(false);

  const updateParams = (updateFn: (params: URLSearchParams) => void) => {
    const params = new URLSearchParams(searchParams.toString());
    updateFn(params);
    params.set('page', '1'); // always reset page
    router.push(`/users?${params.toString()}`);
  };

  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-4 ">
      <div className="flex items-center gap-2 border p-2 rounded-md w-full bg-background">
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

      <div className="flex items-center gap-2 w-full pb-2 sm:pb-0">
        <Popover open={openRole} onOpenChange={setOpenRole}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="min-w-[160px] justify-start flex items-center gap-2"
            >
              <Filter />
              <span>{selectedRole ? `Role: ${selectedRole}` : 'By Role'}</span>
            </Button>
          </PopoverTrigger>
          {selectedRole && (
            <div className="-ml-5 ">
              <XCircle
                size={16}
                className="ml-2 cursor-pointer text-red-600 bg-primary-foreground rounded-full"
                onClick={(e) => {
                  e.stopPropagation();
                  updateParams((params) => params.delete('role'));
                }}
              />
            </div>
          )}
          <PopoverContent className="w-[200px] p-0">
            <Command>
              <CommandInput placeholder="Search status..." />
              <CommandList>
                {role.map((item) => (
                  <CommandItem
                    key={item}
                    onSelect={() => {
                      updateParams((params) => params.set('role', item));
                      setOpenRole(false);
                    }}
                  >
                    {item}
                  </CommandItem>
                ))}
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        {/* Reset All */}
        {(search || selectedRole) && (
          <Button
            variant="ghost"
            className="bg-red-600 text-white hover:text-white hover:bg-red-500 dark:hover:bg-red-500"
            onClick={() => {
              setSearchText('');
              router.push('/users');
              // setDateRange({ from: undefined, to: undefined });
            }}
          >
            <RotateCcw /> <span>Reset All</span>
          </Button>
        )}
      </div>
    </div>
  );
};

export default UserFIlterBar;
