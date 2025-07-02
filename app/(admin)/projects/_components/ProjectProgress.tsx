'use client';

import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Plus } from 'lucide-react';
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
import { createGoal } from '@/actions/projecActions';
import { Prisma } from '@prisma/client';

// interface GoalsItem {
//   title: string;
//   value: number;
// }

type GoalsItem = Prisma.GoalGetPayload<true> & {
  progress: number;
};

interface ProjectProgressProps {
  goals: GoalsItem[];
  projectId: string;
  createdById: string;
}

const ProjectProgress = ({
  goals,
  createdById,
  projectId,
}: ProjectProgressProps) => {
  const router = useRouter();

  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [createLoading, setCreateLoading] = useState<boolean>(false);

  const handleSubmit = async (data: GoalFormValues) => {
    setCreateLoading(true);
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
      setCreateLoading(false);
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

        <Button onClick={() => setDialogOpen(true)} size={'icon'}>
          <Plus size={18} />
        </Button>

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
      <div className="space-y-2.5">
        <Progress value={10} fullColor />
        <Progress value={30} fullColor />
        <Progress value={55} fullColor />
        <Progress value={80} fullColor />
        <Progress value={100} fullColor />
        {goals.length > 0 ? (
          goals.map((goal, i) => (
            <ProgressCard key={i} title={goal.title} progress={goal.progress} />
          ))
        ) : (
          <div>no goals</div>
        )}
      </div>
    </div>
  );
};

export default ProjectProgress;

interface ProgressCardProps {
  title: string;
  progress: number;
}

const ProgressCard = ({ title, progress }: ProgressCardProps) => {
  return (
    <div className="space-y-1">
      <div className="text-sm flex items-center justify-between">
        <p>{title}</p>
        <p>{progress}%</p>
      </div>
      <Progress value={progress} variant={'high'} />
    </div>
  );
};
