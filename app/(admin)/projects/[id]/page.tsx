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
import { ProjectDetailProvider } from './context/ProjectDetailContex';

type Params = Promise<{ id: string }>;

// const allGoals = [
//   { title: 'Posting Arcticle Headline', value: 100 },
//   { title: 'Exclusive Interview', value: 100 },
//   { title: 'Podcast Youtube', value: 23 },
//   { title: 'Publish Soccial Media', value: 76 },
// ];

const ProjectDetailsPage = async ({ params }: { params: Params }) => {
  // get session
  const session = await auth();

  // get projectId form url params
  const { id } = await params;

  // fetch porject detail by project id
  const projectDetail = await getProjectById({ id });

  // filter list members match session curent user to setup permission
  const member = projectDetail.members.filter(
    (member) => member.user.id === session?.user.id,
  )[0];

  if (!projectDetail) {
    redirect('/projects');
  }
  if (!member) {
    redirect('/projects');
  }

  // settup permision by user role and member role
  const isAllowed =
    ['ADMIN', 'PEMRED', 'REDAKTUR', 'REPORTER', 'TESTER'].includes(
      member.user.role,
    ) && ['OWNER', 'ADMIN'].includes(member.role);

  // set curentuser access project detail
  const currentUser = { ...member, permission: isAllowed };

  const sortedGoals = projectDetail.goals.sort((a, b) => {
    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
  });
  return (
    <ProjectDetailProvider
      projectDetail={projectDetail}
      currentProjectMember={currentUser}
    >
      <div className="bg-primary-foreground rounded-lg p-4 space-y-6">
        <div className="sm:flex sm:flex-row-reverse items-center justify-between space-y-2 gap-4 ">
          {projectDetail?.createdById ? (
            <ProjectTeamLists />
          ) : (
            <MemberListSkeleton />
          )}

          <ProjectTitle />
        </div>
        <div className="space-y-6">
          <div className="grid md:grid-cols-2 md:grid-rows-3 gap-4 max-h-fit">
            <div className="p-4 bg-muted rounded-md ">
              <ProjectDetailDescription />
            </div>
            <div className="p-4 bg-muted rounded-md md:row-span-3 ">
              <ProjectProgress
                goals={sortedGoals}
                createdById={projectDetail.createdById}
                projectId={projectDetail.id}
                currentUser={currentUser}
              />
            </div>
            <div className="p-4 bg-muted rounded-md md:row-span-2 ">
              <ProjectDetailsInfo currentUser={currentUser} />
            </div>
          </div>
        </div>
        <div>
          <ProjectTab
            goals={sortedGoals}
            projectId={projectDetail.id}
            projectMembers={projectDetail.members}
            currentUser={currentUser}
          />
        </div>
      </div>
    </ProjectDetailProvider>
  );
};

export default ProjectDetailsPage;

const MemberListSkeleton = () => {
  return (
    <div className="flex items-center gap-2">
      <Skeleton className="h-6 w-20" />
      <Skeleton className="h-6 w-6" />
    </div>
  );
};
