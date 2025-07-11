import { getProjectById } from '@/actions/projecActions';
import ProjectTeamLists from '../_components/ProjectTeamLists';
import ProjectProgress from '../_components/ProjectProgress';
import ProjectDetailsInfo from '../_components/ProjectDetailsInfo';
import ProjectTab from '../_components/ProjectTab';
import ProjectTitle from '../_components/ProjectTitle';
import ProjectDetailDescription from '../_components/ProjectDetailDescription';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import {
  CurrentProjectMember,
  ProjectDetailProvider,
} from './context/ProjectDetailContex';
import WraperProjectDetailContext from '../_components/WraperPojectDetailsContex';

type Params = Promise<{ id: string }>;

const ProjectDetailsPage = async ({ params }: { params: Params }) => {
  // get projectId form url params
  const { id } = await params;

  // fetch porject detail by project id
  const projectDetail = await getProjectById({ id });

  // console.log(projectDetail);

  // Redirect if project is not found
  if (!projectDetail) {
    return redirect('/projects');
  }

  // Get the current session and user
  const session = await auth();
  const user = session?.user;
  if (!user?.id || !user?.email || !user?.name || !user?.role) {
    return redirect('/projects');
  }

  // Check if the user is a member of the project
  const isMember = projectDetail.members.some(
    (member) => member.user.id === user.id,
  );

  const isPrivileged = ['ADMIN', 'PEMRED'].includes(user.role as string);

  // Redirect if the user is neither a member nor has ADMIN role
  if (!isMember && !isPrivileged) {
    return redirect('/projects');
  }

  // Get memberRole if user is member
  const memberRole = isMember
    ? projectDetail.members.find(
        (member) => member.user.id === session?.user.id,
      )?.role
    : undefined;

  // ✅ Determine if the user has CRUD permissions
  // Allowed if:
  // - The user is a project member with one of the roles: ['ADMIN', 'OWNER']
  // - OR the user is not a member but has global ADMIN role
  const hasCrudAccess =
    isPrivileged ||
    projectDetail.members.some(
      (member) =>
        member.user.id === session?.user.id &&
        ['ADMIN', 'OWNER'].includes(member.role),
    );

  // Construct currentUser object
  const currentUser: CurrentProjectMember = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    image: user.image as string,
    isMember,
    memberRole,
    hasCrudAccess,
  };

  // return <div>ACCESS ACEPTED</div>;
  return (
    <WraperProjectDetailContext
      projectDetail={projectDetail}
      currentProjectMember={currentUser}
    >
      <div className="bg-primary-foreground rounded-lg p-4 space-y-6">
        <div className="sm:flex sm:flex-row-reverse items-center justify-between space-y-2 gap-4 ">
          <ProjectTeamLists />

          <ProjectTitle />
        </div>
        <div className="space-y-6">
          <div className="grid md:grid-cols-2 md:grid-rows-3 gap-4 max-h-fit">
            <div className="p-4 bg-muted rounded-md ">
              <ProjectDetailDescription />
            </div>
            <div className="p-4 bg-muted rounded-md md:row-span-3 ">
              <ProjectProgress />
            </div>
            <div className="p-4 bg-muted rounded-md md:row-span-2 ">
              <ProjectDetailsInfo />
            </div>
          </div>
        </div>
        <div>
          <ProjectTab />
        </div>
      </div>
    </WraperProjectDetailContext>
  );
};

export default ProjectDetailsPage;

// const MemberListSkeleton = () => {
//   return (
//     <div className="flex items-center gap-2">
//       <Skeleton className="h-6 w-20" />
//       <Skeleton className="h-6 w-6" />
//     </div>
//   );
// };
