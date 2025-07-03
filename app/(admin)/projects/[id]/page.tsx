import { getProjectById } from '@/actions/projecActions';
import ProjectTeamLists from '../_components/ProjectTeamLists';
import ProjectProgress from '../_components/ProjectProgress';
import ProjectDetailsInfo from '../_components/ProjectDetailsInfo';
import ProjectTab from '../_components/ProjectTab';
import ProjectTitle from '../_components/ProjectTitle';
import ProjectDetailDescription from '../_components/ProjectDetailDescription';
import { Skeleton } from '@/components/ui/skeleton';
import { redirect } from 'next/navigation';

type Params = Promise<{ id: string }>;

const allGoals = [
  { title: 'Posting Arcticle Headline', value: 100 },
  { title: 'Exclusive Interview', value: 100 },
  { title: 'Podcast Youtube', value: 23 },
  { title: 'Publish Soccial Media', value: 76 },
];

const ProjectDetailsPage = async ({ params }: { params: Params }) => {
  const { id } = await params;
  const projectDetail = await getProjectById({ id });

  console.log(projectDetail.goals);

  if (!projectDetail) {
    redirect('/projects');
  }
  // console.log(projetDetail);
  const sortedGoals = projectDetail.goals.sort((a, b) => {
    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
  });
  return (
    <div className="bg-primary-foreground rounded-lg p-4 space-y-6">
      <div className="sm:flex sm:flex-row-reverse items-center justify-between space-y-2 gap-4 ">
        {projectDetail?.createdById ? (
          <ProjectTeamLists
            members={projectDetail.members}
            projectId={id}
            creatorId={projectDetail.createdById}
          />
        ) : (
          <MemberListSkeleton />
        )}

        <ProjectTitle
          title={
            typeof projectDetail?.name === 'string' ? projectDetail?.name : ''
          }
          id={id}
        />
      </div>
      <div className="space-y-6">
        <div className="grid md:grid-cols-3 md:grid-rows-3 gap-4 max-h-fit">
          <div className="p-4 bg-muted rounded-md md:col-span-2 ">
            <ProjectDetailDescription
              description={
                typeof projectDetail?.description === 'string'
                  ? projectDetail.description
                  : ''
              }
              id={id}
            />
          </div>
          <div className="p-4 bg-muted rounded-md md:row-span-3 ">
            <ProjectProgress
              goals={sortedGoals}
              createdById={projectDetail.createdById}
              projectId={projectDetail.id}
            />
          </div>
          <div className="p-4 bg-muted rounded-md md:col-span-2 md:row-span-2 ">
            <ProjectDetailsInfo />
          </div>
        </div>
      </div>
      <div>
        <ProjectTab />
      </div>
    </div>
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
