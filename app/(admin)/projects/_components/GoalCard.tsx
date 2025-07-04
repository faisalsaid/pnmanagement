'use client';

import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Ellipsis, Pencil, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

import {
  Dialog,
  DialogContent,
  // DialogDescription,
  DialogHeader,
  DialogTitle,
  // DialogTrigger,
} from '@/components/ui/dialog';
import CreateGoalForm from './CreateGoalForm';
import { GoalFormValues } from '@/lib/zod';
import { useState } from 'react';
import { toast } from 'sonner';
import { deleteGoal, updateGoal } from '@/actions/projecActions';
import { Prisma } from '@prisma/client';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import ConfirmDialog from '@/components/ConfirmDialog';
import { GoalsItemOnProject } from './ProjectProgress';
import SircleProgressCard from '@/components/SircleProgressCard';

interface ProgressCardProps {
  goal: GoalsItemOnProject;
}

const GoalCard = ({ goal }: ProgressCardProps) => {
  // console.log(goal);

  const router = useRouter();

  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [confirmOpen, setConfirmOpen] = useState<boolean>(false);

  const handleUpdateGoal = async (data: GoalFormValues) => {
    try {
      const result = await updateGoal({ ...data, id: goal.id });

      if (result.success) {
        toast.success(`Goal "${data.title}" updated successfully.`);
        router.refresh();
      } else {
        toast.error('Goal update failed.');
      }
    } catch (error) {
      toast.error('Unable to update goal.');
      console.error(error);
    } finally {
      setDialogOpen(false);
    }
  };

  const handleDeleteGoal = async (goalId: string, goalTitle: string) => {
    // toast.success(goalTitle);
    setLoading(true);
    try {
      const result = await deleteGoal(goalId);
      if (result.success) {
        toast.success(`Success delete ${goalTitle} goal`);
        router.refresh();
      }
    } catch (error: any) {
      toast.error('Failed to delete asset');
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>loading</div>;

  const finishTask = goal.tasks.filter((task) => task.status === 'DONE');

  return (
    <div className="flex gap-2 items-center justify-between">
      <SircleProgressCard
        totalTask={goal.tasks.length}
        finishTask={finishTask.length}
      />

      <div className="space-y-1 w-full">
        <div className="text-sm flex items-center justify-between">
          <Tooltip>
            <TooltipTrigger className="line-clamp-1 ">
              <p className="text-left">{goal.title}</p>
            </TooltipTrigger>
            <TooltipContent>
              <p>{goal.title}</p>
            </TooltipContent>
          </Tooltip>

          <p>{goal.progress}%</p>
        </div>
        <Progress value={goal.progress} variant={'high'} fullColor />
      </div>
      <div>
        {!loading ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant={'ghost'}>
                <Ellipsis />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Setting</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Button
                  className="w-full"
                  size={'sm'}
                  onClick={() => setDialogOpen(true)}
                  variant={'ghost'}
                >
                  <Pencil /> <span>Update</span>
                </Button>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Button
                  size={'sm'}
                  onClick={() => setConfirmOpen(true)}
                  variant={'ghost'}
                  className="text-red-500 hover:text-red-500 w-full"
                >
                  <Trash2 className="text-red-500" /> <span>Delete</span>
                </Button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <div>loading</div>
        )}
      </div>

      <Dialog open={dialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Goal</DialogTitle>
          </DialogHeader>
          <div className="max-h-[75svh] ">
            <CreateGoalForm
              projectId={goal.projectId}
              createdById={goal.createdById}
              initialData={{
                ...goal,
                description: goal.description ?? undefined, // convert null to undefined
                dueDate: goal.dueDate ? new Date(goal.dueDate) : undefined,
              }}
              submitLabel="Update"
              onSubmit={handleUpdateGoal}
              onClose={() => setDialogOpen(false)}
            />
          </div>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={(open) => {
          setConfirmOpen(open);
          // if (!open) setPendingRole(null);
        }}
        title={`Do you really want to delete the goal? `}
        description={
          <span>
            The goal <span className="font-bold italic">"{goal.title}"</span>{' '}
            will be permanently deleted and{' '}
            <span className="text-red-700 font-bold">cannot be undone!</span> .
          </span>
        }
        confirmLabel="Yes, Delete"
        cancelLabel="Cancel"
        onConfirm={() => {
          handleDeleteGoal(goal.id, goal.title);
          // setPendingRole(null);
        }}
      />
    </div>
  );
};

export default GoalCard;
