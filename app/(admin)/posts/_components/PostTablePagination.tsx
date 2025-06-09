'use client';

import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface Props {
  page: number;
  limit: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
}

export const PostsTablePagination = ({
  page,
  limit,
  totalPages,
  onPageChange,
  onLimitChange,
}: Props) => {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4 px-2">
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
        >
          Previous
        </Button>
        <span className="text-xs sm:text-md">
          Page <strong>{page}</strong> of <strong>{totalPages}</strong>
        </span>
        <Button
          variant="outline"
          onClick={() => onPageChange(page + 1)}
          disabled={page === totalPages}
        >
          Next
        </Button>
      </div>
      <div className="flex items-center gap-2">
        <span>Show</span>
        <Select
          value={limit.toString()}
          onValueChange={(val) => onLimitChange(Number(val))}
        >
          <SelectTrigger className="w-[80px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {[5, 10, 20, 50].map((num) => (
              <SelectItem key={num} value={num.toString()}>
                {num}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <span>entries</span>
      </div>
    </div>
  );
};
