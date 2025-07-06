import { getProjectById } from '@/actions/projecActions';
import ProjectTeamLists from '../_components/ProjectTeamLists';
import ProjectProgress from '../_components/ProjectProgress';
import ProjectDetailsInfo from '../_components/ProjectDetailsInfo';
import ProjectTab from '../_components/ProjectTab';
import ProjectTitle from '../_components/ProjectTitle';
import ProjectDetailDescription from '../_components/ProjectDetailDescription';
import { Skeleton } from '@/components/ui/skeleton';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import {
  CurrentProjectMember,
  ProjectDetailProvider,
} from './context/ProjectDetailContex';

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

  // Check if the user is a member of the project
  const isMember = projectDetail.members.some(
    (member) => member.user.id === session?.user.id,
  );

  // Redirect if the user is neither a member nor has ADMIN role
  if (!isMember && session?.user.role !== 'ADMIN') {
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
    session?.user.role === 'ADMIN' ||
    projectDetail.members.some(
      (member) =>
        member.user.id === session?.user.id &&
        ['ADMIN', 'OWNER'].includes(member.role),
    );

  if (
    !session?.user?.id ||
    !session.user.email ||
    !session.user.name ||
    !session.user.role ||
    !session.user.image
  ) {
    return redirect('/projects');
  }

  // Construct currentUser object
  const currentUser: CurrentProjectMember = {
    id: session?.user.id,
    name: session?.user.name,
    email: session?.user.email,
    role: session?.user.role,
    image: session?.user.image,
    isMember,
    memberRole,
    hasCrudAccess,
  };
  return (
    <ProjectDetailProvider
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
    </ProjectDetailProvider>
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
