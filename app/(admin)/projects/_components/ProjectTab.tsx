'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProjectKanbanBoard from './ProjectKanbanBoard';

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
        <TabsContent value="overview">Overview</TabsContent>
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
