import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { UsersTable } from './userColumns';
import { Button } from '@/components/ui/button';
import { MoreHorizontal } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState, useTransition } from 'react';
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
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

type Props = {
  user: UsersTable;
  currentUser?: {
    id: string;
    name: string | null | undefined;
    email: string | null | undefined;
    role: string;
  } | null;
};

const UsersActionCells = ({ user, currentUser }: Props) => {
  const router = useRouter();
  const [permission, setPermission] = useState(false);
  const [isPending, startTransition] = useTransition();

  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (currentUser) {
      const isAllowed = ['ADMIN'].includes(currentUser.role);
      setPermission(isAllowed);
    }
  }, [currentUser]);

  const handleDelete = () => {
    startTransition(async () => {
      toast.info('oke for testing');
      router.refresh();

      setOpen(false);
    });
  };

  return (
    <div>
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
            <Link href={`/users/${user.id}`}>View Detail</Link>
          </DropdownMenuItem>

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
              User <strong>{user.email}</strong> will be permanently deleted.
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
};

export default UsersActionCells;
