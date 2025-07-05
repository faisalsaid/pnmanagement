'use client';

import { useRouter } from 'next/navigation';
import { useProjectDetails } from '../[id]/context/ProjectDetailContex';
import { createGoal } from '@/actions/projecActions';
import { GoalFormValues } from '@/lib/zod';

// components
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import CreateGoalForm from './CreateGoalForm';
import { useState } from 'react';
import { toast } from 'sonner';
import { ScrollArea } from '@/components/ui/scroll-area';
import GoalCard from './GoalCard';

// icons
import { Plus } from 'lucide-react';

const ProjectProgress = () => {
  const { currentProjectMember, projectDetail } = useProjectDetails();

  const router = useRouter();

  const sortedGoals = projectDetail.goals.sort((a, b) => {
    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
  });

  const [dialogOpen, setDialogOpen] = useState<boolean>(false);

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
            {sortedGoals.filter((goal) => goal.progress === 100).length}/
            {sortedGoals.length} Goals
          </div>
        </div>
        {currentProjectMember.permission && (
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
                onSubmit={handleSubmit}
                onClose={() => setDialogOpen(false)}
              />
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <ScrollArea className="h-[250px]">
        <div className="space-y-2.5">
          {projectDetail.goals.length > 0 ? (
            projectDetail.goals.map((goal, i) => (
              <GoalCard key={i} goal={goal} />
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
