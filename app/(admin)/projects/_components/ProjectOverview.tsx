'use client';

import { useState } from 'react';
import { useProjectDetails } from '../[id]/context/ProjectDetailContex';
import { createTask } from '@/actions/projecActions';
import { TaskFormValues } from '@/lib/zod';

// components
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { TaskForm } from './TaskForm';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';

// icons
import { Plus } from 'lucide-react';

const ProjectOverview = () => {
  const { currentProjectMember } = useProjectDetails();
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
          {currentProjectMember.permission && (
            <Button onClick={() => setOpenFormDialog(true)}>
              <Plus /> <span>Create Task</span>
            </Button>
          )}
          {/* TASK FORM DIALOG */}
          <Dialog
            open={openFormDialog}
            onOpenChange={setOpenFormDialog}
            // modal={true}
          >
            {/* modal={true} disabled closed if click out of dialog */}
            {/* <DialogContent onInteractOutside={(e) => e.preventDefault()}> */}
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Assign new task</DialogTitle>
              </DialogHeader>
              <Separator />
              <div>
                <TaskForm
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
