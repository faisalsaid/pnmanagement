'use client';

import { useEffect, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { toast } from 'sonner';
// import { deleteArticle } from '@/app/action/postActions';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
  const { data: session } = useSession();

  const isAllowed =
    session?.user.role &&
    (['ADMIN', 'PEMRED', 'REDAKTUR'].includes(session.user.role) ||
      session.user.id === post.author.id);

  const [permission, setPermission] = useState(isAllowed);

  useEffect(() => {
    setPermission(isAllowed);
  }, [isAllowed, session]);

  const handleDelete = () => {
    startTransition(async () => {
      toast.info('oke for testing');
      router.refresh();
      // const res = await deleteArticle(post.id);
      // if (res?.success) {
      //   toast.success('Article deleted successfully!');
      //   router.refresh();
      // } else {
      //   toast.error(res?.message || 'Failed to delete article.');
      // }
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
