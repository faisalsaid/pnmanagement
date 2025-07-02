'use client';

import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Plus } from 'lucide-react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import CreateGoalForm from './CreateGoalForm';
import { GoalFormValues } from '@/lib/zod';
import { useState } from 'react';
import { toast } from 'sonner';

interface GoalsItem {
  title: string;
  value: number;
}

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
  const finishGoals = goals.filter((goal) => goal.value === 100);

  const [dialogOpen, setDialogOpen] = useState<boolean>(false);

  const handleSubmit = (data: GoalFormValues) => {
    console.log(data);

    toast(data.title);
  };
  return (
    <div className="w-full space-y-3">
      <div className="flex items-center justify-between gap-2 text-sm">
        <div className="flex items-center gap-2">
          <h2 className="font-bolds">Progress</h2>
          <div className=" text-primary bg-orange-400/20 border border-orange-500 px-2 rounded-md">
            {finishGoals.length}/{goals.length} Goals
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
        {goals.length > 0 ? (
          goals.map((goal, i) => (
            <ProgressCard key={i} value={goal.value} title={goal.title} />
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
  value: number;
}

const ProgressCard = ({ value, title }: ProgressCardProps) => {
  return (
    <div className="space-y-1">
      <div className="text-sm flex items-center justify-between">
        <p>{title}</p>
        <p>{value}%</p>
      </div>
      <Progress value={value} />
    </div>
  );
};
