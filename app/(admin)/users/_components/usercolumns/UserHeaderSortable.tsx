'use client';

import { ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usersMultiSortHandler } from './usersMultiSortHandler';

interface HeaderSortableProps {
  columnKey: string;
  label: string;
}

export function UserHeaderSortable({ columnKey, label }: HeaderSortableProps) {
  const handleSort = usersMultiSortHandler(columnKey);

  return (
    <Button variant="ghost" onClick={handleSort}>
      {label}
      <ArrowUpDown className="ml-2 h-4 w-4" />
    </Button>
  );
}
