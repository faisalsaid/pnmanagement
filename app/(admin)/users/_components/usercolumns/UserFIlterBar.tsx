'use client';

import { Search, XCircle } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

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
      </div>{' '}
    </div>
  );
};

export default UserFIlterBar;
