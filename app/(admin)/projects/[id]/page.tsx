import { getProjectById } from '@/actions/projecActions';
import ProjectTeamLists from '../_components/ProjectTeamLists';
import ProjectProgress from '../_components/ProjectProgress';
import ProjectDetailsInfo from '../_components/ProjectDetailsInfo';

type Params = Promise<{ id: string }>;

const allGoals = [
  { title: 'Posting Arcticle Headline', value: 100 },
  { title: 'Exclusive Interview', value: 100 },
  { title: 'Podcast Youtube', value: 23 },
  { title: 'Publish Soccial Media', value: 76 },
];

const ProjectDetailsPage = async ({ params }: { params: Params }) => {
  const { id } = await params;
  const projetDetail = await getProjectById({ id });

  return (
    <div className="bg-primary-foreground rounded-lg p-4 space-y-8">
      <div className="sm:flex items-center justify-between space-y-2">
        <ProjectTeamLists />
        <h1 className="text-2xl font-semibold">{projetDetail?.name}</h1>
      </div>
      <div className="space-y-6">
        <p className="bg-muted rounded-md p-2 w-full md:flex-1/2 text-sm text-muted-foreground">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Laborum eum
          at iure voluptatibus similique, velit illum. Explicabo rem suscipit
          nulla impedit, commodi totam.
        </p>
        <ProjectProgress goals={allGoals} />
        <ProjectDetailsInfo />
      </div>
    </div>
  );
};

export default ProjectDetailsPage;
