'use client';

// components
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProjectKanbanBoard from './ProjectKanbanBoard';
import ProjectOverview from './ProjectOverview';

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
          <ProjectKanbanBoard />
        </TabsContent>
        <TabsContent value="calender">Calender</TabsContent>
        <TabsContent value="files">Files</TabsContent>
      </Tabs>
    </div>
  );
};

export default ProjectTab;
