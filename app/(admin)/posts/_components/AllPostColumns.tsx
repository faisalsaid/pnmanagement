// All post column

'use client';

import { cn } from '@/lib/utils';
import { ColumnDef } from '@tanstack/react-table';
import { Prisma } from '@prisma/client';
import { useMultiSortHandler } from './useMultiSortHandler';

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/components/ui/alert-dialog';

import { toast } from 'sonner';
// import { deleteArticle } from '@/app/action/postActions';
import { useEffect, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ArrowUpDown, CheckCheck, MoreHorizontal } from 'lucide-react';
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
import { useSession } from 'next-auth/react';

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
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          // onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Title
          {/* <ArrowUpDown className="ml-2 h-4 w-4" /> */}
        </Button>
      );
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
    // cell: ({ row }) => truncateByChar(row.original.title, 30),
  },
  {
    accessorKey: 'author',
    enableSorting: true,
    header: ({ column }) => {
      const handleSort = useMultiSortHandler('author');

      // Untuk tahu apakah kolom ini sedang di-sort dan arah sortingnya
      const sortDirection = column.getIsSorted(); // 'asc' | 'desc' | false
      // console.log(sortDirection);

      return (
        <Button variant="ghost" onClick={handleSort}>
          Author
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const author = row.original.author;
      return (
        <HoverCard>
          <HoverCardTrigger>{author?.name ?? author.name}</HoverCardTrigger>
          <HoverCardContent>
            <AuthorCard author={author} />
          </HoverCardContent>
        </HoverCard>
      );
    },
  },
  {
    accessorKey: 'category',
    header: ({ column }) => {
      const handleSort = useMultiSortHandler('category');

      // Untuk tahu apakah kolom ini sedang di-sort dan arah sortingnya
      const isSortedAsc = column.getIsSorted() === 'asc';
      const isSortedDesc = column.getIsSorted() === 'desc';
      return (
        <Button variant="ghost" onClick={handleSort}>
          Category
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
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
    header: ({ column }) => {
      const handleSort = useMultiSortHandler('status');

      // Untuk tahu apakah kolom ini sedang di-sort dan arah sortingnya
      const isSortedAsc = column.getIsSorted() === 'asc';
      const isSortedDesc = column.getIsSorted() === 'desc';
      return (
        <Button variant="ghost" onClick={handleSort}>
          Status
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const status = row.original.status;
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <CheckCheck
                className={cn(
                  `px-1.5 py-0.5 aspect-square w-max text-xs border rounded-full mx-auto`,
                  status === 'DRAFT'
                    ? 'bg-yellow-500/20 border-yellow-500 text-yellow-500'
                    : status === 'PUBLISHED'
                    ? 'bg-green-500/20 border-green-500 text-green-500'
                    : status === 'ARCHIVED'
                    ? 'bg-red-500/20 border-red-500 text-red-500'
                    : 'bg-sky-500/20 border-sky-500 text-sky-500',
                )}
              />
            </TooltipTrigger>
            <TooltipContent>{status as string}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    },
  },
  {
    id: 'createdAt',

    header: ({ column }) => {
      const handleSort = useMultiSortHandler('createdAt');

      // Untuk tahu apakah kolom ini sedang di-sort dan arah sortingnya
      const isSortedAsc = column.getIsSorted() === 'asc';
      const isSortedDesc = column.getIsSorted() === 'desc';
      return (
        <Button variant="ghost" onClick={handleSort}>
          Created At
          <ArrowUpDown className="ml-2 h-4 w-4 ro" />
        </Button>
      );
    },
    cell: ({ row }) =>
      row.original.createdAt.toLocaleString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }),
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const post = row.original;
      const router = useRouter();
      const [isPending, startTransition] = useTransition();
      const [open, setOpen] = useState(false); // kontrol dialog manual
      const { data: session } = useSession();

      const userRoleId =
        session?.user.role &&
        (['ADMIN', 'PEMRED', 'REDAKTUR'].includes(session?.user.role) ||
          post.author.id === session?.user.id);

      const [permsion, setPermision] = useState(userRoleId);

      useEffect(() => {
        setPermision(userRoleId);
      }, [post]);

      // console.log(post.author.id, '===', session?.user.id);

      const handleDelete = () => {
        // startTransition(async () => {
        //   const res = await deleteArticle(post.id);
        //   if (res?.success) {
        //     toast.success('Article deleted successfully!', {
        //       className: 'text-green-500',
        //     });
        //     router.refresh(); // refresh table
        //   } else {
        //     toast.error(res?.message || 'Article deletion failed.');
        //   }
        //   setOpen(false); // tutup dialog setelah aksi
        // });
      };

      return (
        <div className="flex items-center justify-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel className="text-muted-foreground">
                Actions
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="hover:cursor-pointer">
                <Link href={`/posts/${post.slug}`}>View Detail</Link>
              </DropdownMenuItem>
              {permsion && (
                <Link href={`/posts/${post.slug}/update`}>
                  <DropdownMenuItem className="hover:cursor-pointer">
                    Edit
                  </DropdownMenuItem>
                </Link>
              )}

              <DropdownMenuSeparator />
              {permsion && (
                <DropdownMenuItem
                  className="text-red-600 hover:cursor-pointer"
                  onClick={() => setOpen(true)}
                >
                  Delete
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Yakin ingin menghapus?</AlertDialogTitle>
                <AlertDialogDescription>
                  The article <strong>{post.title}</strong> awill be permanently
                  deleted.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel disabled={isPending}>
                  Cencel
                </AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete} disabled={isPending}>
                  {isPending ? 'Deleting...' : 'Delete'}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      );
    },
  },
];

export default AllPostsColumns;
