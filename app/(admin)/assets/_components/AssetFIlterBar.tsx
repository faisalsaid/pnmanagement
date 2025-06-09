'use client';
import { Prisma } from '@prisma/client';
import { Filter, Search, XCircle } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';

type AssetFIlterBarProps = {
  uploadBy: Prisma.UserGetPayload<{
    select: {
      id: true;
      name: true;
    };
  }>[];
  myAsset?: boolean;
};

const AssetFIlterBar = ({ uploadBy, myAsset }: AssetFIlterBarProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const search = searchParams.get('search') || '';
  const selectedUploader = searchParams.get('uploadedBy') || '';

  const [openUploader, setOpenUploader] = useState(false);

  const [searchText, setSearchText] = useState(search);

  const updateParams = (updateFn: (params: URLSearchParams) => void) => {
    const params = new URLSearchParams(searchParams.toString());
    updateFn(params);
    params.set('page', '1'); // always reset page
    router.push(`/assets?${params.toString()}`);
  };

  return (
    <div className="flex items-center flex-col sm:flex-row gap-4 ">
      <div className="flex items-center gap-2 border p-2 rounded-md w-full bg-background max-w-96">
        <Search />
        <input
          className="w-full p-1 focus:border-0 focus:outline-none "
          type="text"
          placeholder="Search title or caption..."
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

      {/* Filter BY UPLOADER */}
      <div className="flex items-center gap-3">
        {!myAsset && (
          <Popover open={openUploader} onOpenChange={setOpenUploader}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="min-w-fit justify-start flex items-center gap-2"
              >
                <Filter />
                <span>
                  {selectedUploader
                    ? `Uploader: ${uploadBy
                        .filter((user) => user.id === selectedUploader)
                        .map((user) => user.name)}`
                    : 'By Uploader'}
                </span>
              </Button>
            </PopoverTrigger>
            {selectedUploader && (
              <div className="-ml-5">
                <XCircle
                  size={16}
                  className="ml-2 cursor-pointer text-red-600"
                  onClick={(e) => {
                    e.stopPropagation();
                    updateParams((params) => params.delete('uploadedBy'));
                  }}
                />
              </div>
            )}
            <PopoverContent className="w-[200px] p-0">
              <Command>
                <CommandInput placeholder="Search Uploader..." />
                <CommandList>
                  {uploadBy?.map((user) => (
                    <CommandItem
                      key={user.id}
                      onSelect={() => {
                        updateParams((params) =>
                          params.set('uploadedBy', user.id),
                        );
                        setOpenUploader(false);
                      }}
                    >
                      {user.name}
                    </CommandItem>
                  ))}
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        )}
      </div>

      {/* Reset All */}
      {/* {(search || selectedUploader) && (
        <Button
          variant="ghost"
          className="bg-red-400 text-white hover:text-white hover:bg-red-500 dark:hover:bg-red-500"
          onClick={() => {
            router.push('/asset');
          }}
        >
          <CircleX /> <span>Reset All Filter</span>
        </Button>
      )} */}
    </div>
  );
};

export default AssetFIlterBar;
