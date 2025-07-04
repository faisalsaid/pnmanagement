'use client';

import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { TaskForm } from './TaskForm';
import { GoalsItemWithProgress, UserMemberProject } from './ProjectTab';
import { TaskFormValues } from '@/lib/zod';
import { useState } from 'react';
import { Separator } from '@/components/ui/separator';
import { createTask } from '@/actions/projecActions';
import { toast } from 'sonner';

interface Props {
  goals: GoalsItemWithProgress[];
  projectId: string;
  projectMember: UserMemberProject[];
}

const ProjectOverview = ({ goals, projectId, projectMember }: Props) => {
  const [openFormDialog, setOpenFormDialog] = useState<boolean>(false);

  const onSubmit = async (data: TaskFormValues) => {
    try {
      const result = await createTask(data);
      if (result.success) {
        toast.success(`Success created ${data.title} task`);
      } else {
        toast.error('Fail created task');
      }
      setOpenFormDialog(false);
    } catch (error: any) {
      toast.error('Fail, something wrong');
      setOpenFormDialog(false);
    }
  };
  return (
    <div>
      <div className="flex gap-4 items-center justify-between">
        <h1>Overview</h1>
        <div>
          <Button onClick={() => setOpenFormDialog(true)}>
            <Plus /> <span>Create Task</span>
          </Button>
          {/* TASK FORM DIALOG */}
          <Dialog open={openFormDialog}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Assign new task</DialogTitle>
              </DialogHeader>
              <Separator />
              <div>
                <TaskForm
                  goals={goals}
                  projectId={projectId}
                  projectMember={projectMember}
                  onCancel={() => setOpenFormDialog(false)}
                  onSubmit={onSubmit}
                />
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default ProjectOverview;
