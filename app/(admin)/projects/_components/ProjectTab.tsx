'use client';

// components
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProjectOverview from './ProjectOverview';
import KanbanBoard from './kanban/kanbanboard';

const ProjectTab = () => {
  return (
    <div>
      <Tabs defaultValue="overview">
        <TabsList className="">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="board">Board</TabsTrigger>
          <TabsTrigger value="calender">Calender</TabsTrigger>
          <TabsTrigger value="files">Files</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <ProjectOverview />
        </TabsContent>
        <TabsContent value="board">
          <KanbanBoard />
        </TabsContent>
        <TabsContent value="calender">Calender</TabsContent>
        <TabsContent value="files">Files</TabsContent>
      </Tabs>
    </div>
  );
};

export default ProjectTab;
