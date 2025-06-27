import { auth } from '@/auth';
import CreateNewProjects from './_components/CreateNewProjects';
import { getAllProjects } from '@/actions/projecActions';

const ProjectsPage = async () => {
  const session = await auth();

  const allProjects = await getAllProjects();

  console.log(allProjects);

  return (
    <div>
      <div className="mb-4 px-4 py-2 bg-secondary rounded-md flex justify-between items-center">
        <h1 className="text-xl font-semibold">All Project</h1>
        {session?.user?.id && <CreateNewProjects userId={session.user.id} />}
      </div>
      <div>List Project</div>
    </div>
  );
};

export default ProjectsPage;
