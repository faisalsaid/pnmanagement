import { auth } from '@/auth';
import CreateNewProjects from './_components/CreateNewProjects';
import { getAllProjects } from '@/actions/projecActions';
import { ProjectsTable } from './_components/table/ProjectsTable';
import { columns } from './_components/table/ProjectsColumns';

const ProjectsPage = async () => {
  const session = await auth();
  const currentUser = session?.user
    ? {
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
        role: session.user.role,
      }
    : null;

  // if user admin or pemred gett all project if note, get porject with user in member project

  const isPrivileged = ['ADMIN', 'PEMRED'].includes(
    session?.user.role as string,
  );

  const allProjects = await getAllProjects(
    isPrivileged ? undefined : session?.user.id,
  );
  // console.log(allProjects);

  return (
    <div>
      <div className="mb-4 px-4 py-2 bg-secondary rounded-md flex justify-between items-center">
        <h1 className="text-xl font-semibold">All Projects</h1>
        {session ? <CreateNewProjects userId={session?.user.id} /> : null}
      </div>
      <div>
        <ProjectsTable
          data={allProjects}
          columns={columns}
          currentUser={currentUser}
        />
      </div>
    </div>
  );
};

export default ProjectsPage;
