// All post column

'use client';

import { cn } from '@/lib/utils';
import { ColumnDef } from '@tanstack/react-table';
import { Prisma } from '@prisma/client';
import { HeaderSortable } from './_columnsegment/HeaderSortable';
import { PostActionsCell } from './_columnsegment/PostActionsCell';

import { Button } from '@/components/ui/button';

import {
  Archive,
  CheckCheck,
  Eye,
  FileCheck2,
  ListCollapse,
} from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';
import AuthorCard from '@/components/AuthorCard';
import Link from 'next/link';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { truncateByChar } from '@/lib/helper';

export type Article = Prisma.ArticleGetPayload<{
  select: {
    id: true;
    title: true;
    createdAt: true;
    status: true;
    slug: true;
    author: {
      select: {
        id: true;
        name: true;
        email: true;
        role: true;
        image: true;
        articles: {
          select: {
            id: true;
          };
        };
      };
    };
    category: {
      select: {
        id: true;
        name: true;
        slug: true;
      };
    };
  };
}>;
export const AllPostsColumns: ColumnDef<Article>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        onCheckedChange={(value) => table.toggleAllRowsSelected(!!value)}
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        checked={row.getIsSelected()}
      />
    ),
  },
  {
    accessorKey: 'title',
    header: () => {
      return <Button variant="ghost">Title</Button>;
    },
    cell: ({ row }) => (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            {truncateByChar(row.original.title, 30)}
          </TooltipTrigger>
          <TooltipContent>{row.original.title}</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    ),
  },
  {
    accessorKey: 'author',
    header: () => <HeaderSortable columnKey="author" label="Author" />,
    cell: ({ row }) => {
      const author = row.original.author;
      return (
        <HoverCard>
          <HoverCardTrigger>{author?.name ?? author.name}</HoverCardTrigger>
          <HoverCardContent className="p-0">
            <AuthorCard author={author} />
          </HoverCardContent>
        </HoverCard>
      );
    },
  },
  {
    accessorKey: 'category',
    header: () => <HeaderSortable columnKey="category" label="category" />,
    cell: ({ row }) => {
      const category = row.original.category;
      // return category?.name ?? '-';
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Link href={`/posts/category/${category.slug}`}>
                {category?.name ?? '-'}
              </Link>
            </TooltipTrigger>
            <TooltipContent>
              <p>See All {category?.name ?? '-'}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    },
  },
  {
    accessorKey: 'status',
    header: () => <HeaderSortable columnKey="status" label="status" />,

    cell: ({ row }) => {
      const status = row.original.status;
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className=" flex items-center justify-center">
                <div
                  className={cn(
                    `bg-slate-200/40 rounded-full border  w-8 h-8 flex items-center justify-center p-1.5 mx-auto,`,
                    status === 'DRAFT'
                      ? 'bg-yellow-500/20 border-yellow-500 text-yellow-500'
                      : status === 'PUBLISHED'
                      ? 'bg-green-500/20 border-green-500 text-green-500'
                      : status === 'ARCHIVED'
                      ? 'bg-red-500/20 border-red-500 text-red-500'
                      : 'bg-sky-500/20 border-sky-500 text-sky-500',
                  )}
                >
                  {status === 'DRAFT' ? (
                    <ListCollapse />
                  ) : status === 'PUBLISHED' ? (
                    <FileCheck2 />
                  ) : status === 'ARCHIVED' ? (
                    <Archive />
                  ) : (
                    <Eye />
                  )}
                </div>
              </div>
            </TooltipTrigger>
            <TooltipContent>{status as string}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    },
  },
  {
    id: 'createdAt',

    header: () => <HeaderSortable columnKey="createdAt" label="createdAt" />,

    cell: ({ row }) =>
      row.original.createdAt.toLocaleString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }),
  },
  {
    id: 'actions',
    cell: ({ row }) => <PostActionsCell post={row.original} />,
  },
];

export default AllPostsColumns;
