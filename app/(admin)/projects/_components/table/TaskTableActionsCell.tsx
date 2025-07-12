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
import {
  Dialog,
  DialogContent,
  // DialogDescription,
  DialogHeader,
  DialogTitle,
  // DialogTrigger,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';

// dependens
import { TaskItem } from '../AllTaskByProject';
import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { deleteTask, updateTask } from '@/actions/projecActions';
import { useProjectDetails } from '../../[id]/context/ProjectDetailContex';
import { TaskForm } from '../TaskForm';
import { TaskFormValues } from '@/lib/zod';
import { Separator } from '@/components/ui/separator';

const TaskTableActionsCell = ({ task }: { task: TaskItem }) => {
  const router = useRouter();
  const [opeConfirmDialog, setOpenConfirmDialog] = useState<boolean>(false);
  const [openUpdateDialog, setOpenUpdateDialog] = useState<boolean>(false);
  // const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPending, startTransition] = useTransition();

  const { currentProjectMember } = useProjectDetails();

  const handleDelete = () => {
    startTransition(async () => {
      try {
        await deleteTask(task.id);
        toast.success(`Success delete ${task.title}`);
      } catch (error) {
        console.log(error);
        toast.error(`Fail delete ${task.title}`);
      } finally {
        router.refresh();
      }
      setOpenConfirmDialog(false);
    });
  };

  function sanitizeInitialData(data: TaskItem) {
    if (!data) return undefined;

    return {
      ...data,
      description: data.description ?? undefined,
      dueDate: data.dueDate ?? undefined,
      assignedToId: data.assignedToId ?? undefined,
    };
  }

  const clearTask = sanitizeInitialData(task);

  const handleSubmit = async (data: TaskFormValues) => {
    try {
      // setIsSubmitting(true);

      await updateTask(task.id, data);

      toast.success('Task updated successfully ✅');

      // Opsional: gunakan startTransition untuk UI refresh ringan
      startTransition(() => {
        router.refresh(); // jika ingin reload data dari server
      });
    } catch (error) {
      console.error(error);
      toast.error('Failed to update task ❌');
    } finally {
      // setIsSubmitting(false);
      setOpenUpdateDialog(false);
    }
  };

  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="flex items-center justify-center ">
            <Ellipsis className={'hover:cursor-pointer'} size={18} />
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel className="text-muted-foreground">
            Actions
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>View Details</DropdownMenuItem>

          {currentProjectMember.hasCrudAccess && (
            <DropdownMenuItem
              onClick={() => setOpenUpdateDialog(true)}
              className="hover:cursor-pointer"
            >
              Update
            </DropdownMenuItem>
          )}

          {currentProjectMember.hasCrudAccess && (
            <DropdownMenuItem
              variant="destructive"
              onClick={() => setOpenConfirmDialog(true)}
              className="hover:cursor-pointer"
            >
              Delete
            </DropdownMenuItem>
          )}
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
      <Dialog open={openUpdateDialog} onOpenChange={setOpenUpdateDialog}>
        <DialogContent className="min-w-48">
          <DialogHeader>
            <DialogTitle>Update {task.title}</DialogTitle>
          </DialogHeader>
          <Separator />
          <ScrollArea className=" max-h-[75svh]  rounded-md  p-4">
            <TaskForm
              onCancel={() => setOpenUpdateDialog(false)}
              submitLabel="Update"
              onSubmit={handleSubmit}
              initialData={clearTask}
            />
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TaskTableActionsCell;
