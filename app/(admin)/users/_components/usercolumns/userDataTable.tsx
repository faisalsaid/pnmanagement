'use client';

import { useRouter, useSearchParams } from 'next/navigation';

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  RowData,
  SortingState,
} from '@tanstack/react-table';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import UsersTablePagination from './UsersTablePagination';
import { useCallback, useState } from 'react';

declare module '@tanstack/react-table' {
  interface TableMeta<TData extends RowData> {
    currentUser?: {
      id: string;
      name: string | null | undefined;
      email: string | null | undefined;
      role: string;
    } | null;
  }
}

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  currentUser: {
    id: string;
    name: string | null | undefined;
    email: string | null | undefined;
    role: string;
  } | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export function UserDataTable<TData, TValue>({
  columns,
  data,
  currentUser,
  pagination,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [rowSelection, setRowSelection] = useState({});
  const router = useRouter();
  const searchParams = useSearchParams();

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    meta: { currentUser },
  });

  const handlePageChange = useCallback(
    (newPage: number) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set('page', newPage.toString());
      params.set('limit', pagination.limit.toString());
      router.push(`?${params.toString()}`);
    },
    [router, searchParams, pagination.limit],
  );

  const handleLimitChange = useCallback(
    (newLimit: number) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set('pageSize', newLimit.toString());
      params.set('page', '1'); // reset ke page pertama
      router.push(`?${params.toString()}`);
    },
    [router, searchParams],
  );

  return (
    <div className="space-y-4">
      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      className="bg-muted-foreground text-primary-foreground"
                      key={header.id}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <UsersTablePagination
        page={pagination.page}
        limit={pagination.limit}
        totalPages={pagination.totalPages}
        onPageChange={handlePageChange}
        onLimitChange={handleLimitChange}
      />
    </div>
  );
}
