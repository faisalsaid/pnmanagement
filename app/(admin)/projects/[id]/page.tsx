import { getProjectById } from '@/actions/projecActions';
import ProjectTeamLists from '../_components/ProjectTeamLists';
import ProjectProgress from '../_components/ProjectProgress';
import ProjectDetailsInfo from '../_components/ProjectDetailsInfo';
import ProjectTab from '../_components/ProjectTab';
import ProjectTitle from '../_components/ProjectTitle';

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

  // console.log(projetDetail);

  return (
    <div className="bg-primary-foreground rounded-lg p-4 space-y-6">
      <div className="sm:flex sm:flex-row-reverse items-center justify-between space-y-2 gap-4 ">
        <ProjectTeamLists members={projetDetail?.members} />
        <ProjectTitle title={projetDetail?.name} id={id} />
      </div>
      <div className="space-y-6">
        <div className="grid md:grid-cols-3 md:grid-rows-3 gap-4 max-h-fit">
          <div className="p-4 bg-muted rounded-md md:col-span-2 ">
            <p className="text-sm text-muted-foreground">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Laborum
              eum at iure voluptatibus similique, velit illum. Explicabo rem
              suscipit nulla impedit, commodi totam.
            </p>
          </div>
          <div className="p-4 bg-muted rounded-md md:row-span-3 ">
            <ProjectProgress goals={allGoals} />
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
