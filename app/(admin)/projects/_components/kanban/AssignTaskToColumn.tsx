'use client';

import { useState } from 'react';
import { useProjectDetails } from '../../[id]/context/ProjectDetailContex';
import { useRouter } from 'next/navigation';
import { updateTaskColumn } from '@/actions/projecActions';

// icons
import { Button } from '@/components/ui/button';
import { MdAssignmentReturned } from 'react-icons/md';

// components
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';

const AssignTaskToColumn = () => {
  const routes = useRouter();
  const { projectDetail } = useProjectDetails();

  // get all tasks column null
  const allTasksNoAssign = projectDetail.goals.flatMap((goal) =>
    goal.tasks.filter((task) => task.columnId === null),
  );

  // get all columns
  const allColums = projectDetail.kanbanColumns;

  // handle triger dialog
  const [openAssignTaskDialog, setOpenAssignTaskDialog] =
    useState<boolean>(false);

  // init state
  const [taskValue, setTaskValue] = useState<string | null>(null);
  const [columValue, setColumnValue] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // handle reset state
  const resetValue = () => {
    setTaskValue(null);
    setColumnValue(null);
  };

  // hanlde submit
  const handeSubmit = async () => {
    setLoading(true);
    if (taskValue && columValue) {
      try {
        await updateTaskColumn(taskValue, columValue);
        toast.success('Success assing task');
      } catch (error: any) {
        toast.error('Fail assign task');
      } finally {
        setLoading(false);
        routes.refresh();
      }

      resetValue();
      setOpenAssignTaskDialog(false);
    }
  };

  //   handle cancel
  const handleCancel = () => {
    resetValue();
    setOpenAssignTaskDialog(false);
  };

  return (
    <div>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            onClick={() => setOpenAssignTaskDialog(true)}
            className="rounded-full"
            size={'icon'}
          >
            <MdAssignmentReturned />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Assign task to column</p>
        </TooltipContent>
      </Tooltip>

      {/* DIALOG */}

      <Dialog open={openAssignTaskDialog} onOpenChange={handleCancel}>
        <DialogContent>
          {/* <DialogClose onClick={resetValue} /> */}
          <DialogHeader>
            <DialogTitle>Assign task to column</DialogTitle>
          </DialogHeader>
          <Separator />

          <div className="space-y-4">
            {allTasksNoAssign.length === 0 ? (
              'All tasks are already assigned to columns.'
            ) : (
              <div>
                <Select
                  disabled={loading}
                  onValueChange={(value) => setTaskValue(value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select task" />
                  </SelectTrigger>
                  <SelectContent>
                    {allTasksNoAssign.map((task) => (
                      <SelectItem key={task.id} value={task.id}>
                        {task.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            {allTasksNoAssign.length === 0 ? null : (
              <div>
                <Select
                  disabled={loading || !taskValue}
                  onValueChange={(value) => setColumnValue(value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select column" />
                  </SelectTrigger>
                  <SelectContent>
                    {allColums.map((column) => (
                      <SelectItem key={column.id} value={column.id}>
                        {column.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            <div className="flex gap-2 items-center justify-end">
              <Button
                variant={'secondary'}
                onClick={handleCancel}
                disabled={loading}
              >
                Cancel
              </Button>

              {allTasksNoAssign.length === 0 ? null : (
                <Button
                  disabled={loading || !taskValue || !columValue}
                  onClick={handeSubmit}
                >
                  {loading ? 'Assign...' : 'Assign'}{' '}
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AssignTaskToColumn;
