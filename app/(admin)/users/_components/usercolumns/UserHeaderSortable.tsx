'use client';

import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useUserMultiSortHandler } from './usersMultiSortHandler';
import { useSearchParams } from 'next/navigation';

interface HeaderSortableProps {
  columnKey: string;
  label: string;
}

export function UserHeaderSortable({ columnKey, label }: HeaderSortableProps) {
  const handleSort = useUserMultiSortHandler(columnKey);

  const searchParams = useSearchParams();

  const sortByParam = searchParams.get('sortBy') || '';
  const sortOrderParam = searchParams.get('sortOrder') || '';

  const sortBy = sortByParam.split(',');
  const sortOrder = sortOrderParam.split(',');

  const index = sortBy.indexOf(columnKey);
  const currentOrder = index !== -1 ? sortOrder[index] : null;

  let SortIcon = ArrowUpDown;
  if (currentOrder === 'asc') SortIcon = ArrowDown;
  if (currentOrder === 'desc') SortIcon = ArrowUp;

  return (
    <Button variant="ghost" onClick={handleSort}>
      {label}
      <SortIcon className="ml-2 h-4 w-4" />
    </Button>
  );
}
