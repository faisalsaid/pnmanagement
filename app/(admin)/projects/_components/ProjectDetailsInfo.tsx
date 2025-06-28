import { Badge } from '@/components/ui/badge';

const ProjectDetailsInfo = () => {
  return (
    <div className="space-y-2">
      <h1>Details :</h1>
      <div className="w-full text-sm space-y-2 text-muted-foreground">
        <div className="flex gap-2 items-center ">
          <div className="flex-2/6">Priority</div>{' '}
          <div className="flex-4/6">Normal</div>
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
    </div>
  );
};

export default ProjectDetailsInfo;
