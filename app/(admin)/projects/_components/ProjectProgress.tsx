'use client';

import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Ellipsis, Plus } from 'lucide-react';
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
import { createGoal, updateGoal } from '@/actions/projecActions';
import { Prisma } from '@prisma/client';
import { ScrollArea } from '@/components/ui/scroll-area';
import GoalCard from './GoalCard';

// interface GoalsItem {
//   title: string;
//   value: number;
// }

export type GoalsItemOnProject = Prisma.GoalGetPayload<{
  include: {
    tasks: true;
  };
}> & {
  progress: number;
};

interface Props {
  goals: GoalsItemOnProject[];
  projectId: string;
  createdById: string;
  userPermision: boolean;
}

const ProjectProgress = ({
  goals,
  createdById,
  projectId,
  userPermision,
}: Props) => {
  const router = useRouter();

  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  // const [createLoading, setCreateLoading] = useState<boolean>(false);

  const handleSubmit = async (data: GoalFormValues) => {
    try {
      const formData = new FormData();

      formData.append('title', data.title);
      formData.append('status', data.status);
      formData.append('projectId', data.projectId);
      formData.append('createdById', data.createdById);
      if (data.description) formData.append('description', data.description);
      if (data.dueDate) formData.append('dueDate', data.dueDate.toISOString());

      const result = await createGoal(formData);

      // console.log(result);

      if (result.success) {
        toast.success(`Goal "${data.title}" was successfully created.`);
        router.refresh();
      } else {
        toast.error('Goal creation failed.');
      }
    } catch (error) {
      toast.error('Unable to create goal.');
      console.error(error);
    } finally {
      setDialogOpen(false);
    }
  };
  return (
    <div className="w-full space-y-3">
      <div className="flex items-center justify-between gap-2 text-sm">
        <div className="flex items-center gap-2">
          <h2 className="font-bolds">Progress</h2>
          <div className=" text-primary bg-orange-400/20 border border-orange-500 px-2 rounded-md">
            {goals.filter((goal) => goal.progress === 100).length}/
            {goals.length} Goals
          </div>
        </div>
        {userPermision && (
          <Button onClick={() => setDialogOpen(true)} size={'icon'}>
            <Plus size={18} />
          </Button>
        )}

        {/* DIALOG CREATE GOAL FORM */}
        <Dialog open={dialogOpen}>
          <DialogContent className="">
            <DialogHeader>
              <DialogTitle>Add Goals</DialogTitle>
            </DialogHeader>
            <div className="max-h-[75svh] ">
              <CreateGoalForm
                createdById={createdById}
                projectId={projectId}
                onSubmit={handleSubmit}
                onClose={() => setDialogOpen(false)}
              />
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <ScrollArea className="h-[250px]">
        <div className="space-y-2.5">
          {goals.length > 0 ? (
            goals.map((goal, i) => (
              <GoalCard key={i} goal={goal} userPermision={userPermision} />
            ))
          ) : (
            <div>no goals</div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default ProjectProgress;
