import { Button } from '@/components/ui/button';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from '@/components/ui/pagination';
import { ArrowLeft, ArrowRight } from 'lucide-react';

interface Props {
  page: number;
  limit: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
}

const AssetPagination = ({ page, totalPages, onPageChange }: Props) => {
  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <Button
            variant={'outline'}
            onClick={() => onPageChange(page - 1)}
            disabled={page === 1}
          >
            <ArrowLeft />
            Previous
          </Button>
        </PaginationItem>
        <PaginationItem>
          <span className="text-xs sm:text-sm">
            Page <strong>{page}</strong> of <strong>{totalPages}</strong>
          </span>
        </PaginationItem>

        <PaginationItem>
          <Button
            variant={'outline'}
            onClick={() => onPageChange(page + 1)}
            disabled={page === totalPages}
          >
            Next <ArrowRight />
          </Button>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default AssetPagination;
