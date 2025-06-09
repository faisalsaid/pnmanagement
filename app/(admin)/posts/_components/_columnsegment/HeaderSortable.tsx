'use client';

import { ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useMultiSortHandler } from '@/app/(admin)/posts/_components/useMultiSortHandler';

interface HeaderSortableProps {
  columnKey: string;
  label: string;
}

export function HeaderSortable({ columnKey, label }: HeaderSortableProps) {
  const handleSort = useMultiSortHandler(columnKey);

  return (
    <Button variant="ghost" onClick={handleSort}>
      {label}
      <ArrowUpDown className="ml-2 h-4 w-4" />
    </Button>
  );
}
