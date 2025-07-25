'use client';

import { useEffect, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { getSession } from 'next-auth/react';
import Link from 'next/link';
import { softDelteArticle } from '@/actions/postActions';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { MoreHorizontal } from 'lucide-react';
import type { Article } from '@/app/(admin)/posts/_components/AllPostColumns';

export function PostActionsCell({ post }: { post: Article }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);

  const [permission, setPermission] = useState(false);

  useEffect(() => {
    const fetchSession = async () => {
      const currentSession = await getSession();
      if (currentSession?.user) {
        const isAllowed =
          ['ADMIN', 'PEMRED', 'REDAKTUR'].includes(currentSession.user.role) ||
          currentSession.user.id === post.author.id;
        setPermission(isAllowed);
      }
    };

    fetchSession();
  }, [post.author.id]);

  // useEffect(() => {
  //   if (status === 'authenticated') {
  //     const allowed =
  //       session?.user.role &&
  //       (['ADMIN', 'PEMRED', 'REDAKTUR'].includes(session.user.role) ||
  //         session.user.id === post.author.id);
  //     setPermission(allowed);
  //   }
  // }, [status, session]);

  // console.log(session);

  const handleDelete = () => {
    startTransition(async () => {
      // toast.info('oke for testing');
      const deleted = await softDelteArticle(post.id);

      if (deleted) {
        toast.success('Article deleted');
        // console.log('Article soft-deleted:', deleted);
      } else {
        toast.error('Article not found or already deleted.');
        // console.log('Article not found or already deleted.');
      }
      router.refresh();
      setOpen(false);
    });
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
          <DropdownMenuItem asChild>
            <Link href={`/posts/${post.slug}`}>View Detail</Link>
          </DropdownMenuItem>
          {permission && (
            <DropdownMenuItem asChild>
              <Link href={`/posts/${post.slug}/update`}>Edit</Link>
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          {permission && (
            <DropdownMenuItem
              onClick={() => setOpen(true)}
              className="text-red-600 cursor-pointer"
            >
              Delete
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to delete?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Artikel <strong>{post.title}</strong> will be permanently deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={isPending}>
              {isPending ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
