'use client';

// icons
import { Button } from '@/components/ui/button';
import { Columns3 } from 'lucide-react';

// components
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

import AssignTaskToColumn from './AssignTaskToColumn';

const KanbanSettingsBar = () => {
  return (
    <div className="flex items-center justify-between">
      <div>filter bar</div>
      <div className="flex gap-2 items-center">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button className="rounded-full" size={'icon'}>
              <Columns3 />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Add new column</p>
          </TooltipContent>
        </Tooltip>

        <AssignTaskToColumn />
      </div>
    </div>
  );
};

export default KanbanSettingsBar;
