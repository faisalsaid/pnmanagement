'use client';
// icons
import { Ellipsis } from 'lucide-react';

// projects
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
import { toast } from 'sonner';

// dependens
import { TaskItem } from '../AllTaskByProject';
import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { deleteTask } from '@/actions/projecActions';

const TaskTableActionsCell = ({ task }: { task: TaskItem }) => {
  const router = useRouter();
  const [opeConfirmDialog, setOpenConfirmDialog] = useState<boolean>(false);
  const [openUpdateDialog, setOpenUpdateDialog] = useState<boolean>(false);
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    startTransition(async () => {
      try {
        await deleteTask(task.id);
        toast.success(`Success delete ${task.title}`);
      } catch (error: any) {
        toast.error(`Fail delete ${task.title}`);
      } finally {
        router.refresh();
      }
      setOpenConfirmDialog(false);
    });
  };

  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Ellipsis className={'hover:cursor-pointer'} size={18} />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel className="text-muted-foreground">
            Actions
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => setOpenUpdateDialog(true)}
            className="hover:cursor-pointer"
          >
            Update
          </DropdownMenuItem>
          <DropdownMenuItem
            variant="destructive"
            onClick={() => setOpenConfirmDialog(true)}
            className="hover:cursor-pointer"
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* ALERT DIALOG */}

      <AlertDialog open={opeConfirmDialog} onOpenChange={setOpenConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to delete?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Task <strong>{task.title}</strong> will be permanently deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={handleDelete} disabled={isPending}>
              {isPending ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
            <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* UPDATE FORM */}
    </div>
  );
};

export default TaskTableActionsCell;
