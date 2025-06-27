import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import Link from 'next/link';

const ProjectsPage = () => {
  return (
    <div>
      <div className="mb-4 px-4 py-2 bg-secondary rounded-md flex justify-between items-center">
        <h1 className="text-xl font-semibold">All Project</h1>
        <Link href={'/posts/create'}>
          <Button>
            <Plus /> <span> New Project</span>
          </Button>
        </Link>
      </div>
      <div>List Project</div>
    </div>
  );
};

export default ProjectsPage;
