'use client';

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="">
      <Table className="-mt-2 w-full border-separate border-spacing-y-2 border-spacing-x-0 border-t-0 ">
        <TableHeader className=" bg-green-600 rounded-lg overflow-hidden">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow
              key={headerGroup.id}
              className="hover:bg-transparent rounded-lg overflow-hidden"
            >
              {headerGroup.headers.map((header, i, arr) => {
                return (
                  <TableHead
                    key={header.id}
                    className={cn(
                      'px-4 py-3 text-sm text-white text-left',
                      i === 0 && 'rounded-l-md',
                      i === arr.length - 1 && 'rounded-r-md',
                    )}
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
                className="shadow-sm  transition rounded-md hover:bg-green-950/10 bg-muted  overflow-hidden"
                data-state={row.getIsSelected() && 'selected'}
              >
                {row.getVisibleCells().map((cell, i) => (
                  <TableCell
                    key={cell.id}
                    className={cn(
                      'px-4 py-3 text-sm overflow-hidden ',
                      i === 0 && 'rounded-l-md', // 👈 hanya cell pertama
                      i === row.getVisibleCells().length - 1 && 'rounded-r-md', // 👈 opsional: cell terakhir
                    )}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="h-24 text-center rounded-sm"
              >
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
