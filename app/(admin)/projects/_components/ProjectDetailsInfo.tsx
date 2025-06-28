import { Badge } from '@/components/ui/badge';
import { Flag } from 'lucide-react';

const ProjectDetailsInfo = () => {
  return (
    <div className="w-full text-sm space-y-2 text-muted-foreground">
      <div className="flex gap-2 items-center ">
        <div className="flex-2/6">Priority</div>{' '}
        <div className="flex-4/6">
          <span className="bg-sky-500/20 border border-sky-500 rounded-sm px-2 flex items-center gap-1 w-fit">
            <Flag size={14} /> <span>{Priority.NORMAL.toLocaleString()}</span>
          </span>
        </div>
      </div>
      <div className="flex gap-2 items-center ">
        <div className="flex-2/6">Deadline</div>{' '}
        <div className="flex-4/6">35 Nov 2025</div>
      </div>
      <div className="flex gap-2 items-start ">
        <div className="flex-2/6">Tags</div>{' '}
        <div className="flex-4/6">
          <div className="flex gap-2 flex-wrap">
            <Badge>Goverment</Badge>
            <Badge>Election</Badge>
            <Badge>Politic</Badge>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailsInfo;

enum Priority {
  REALTIME = 'Realtime',
  HIGHT = 'Hight',
  NORMAL = 'Normal',
  LOW = 'Low',
}
