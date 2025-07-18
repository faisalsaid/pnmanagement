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
          <TabsTrigger className="hover:cursor-pointer" value="overview">
            Overview
          </TabsTrigger>
          <TabsTrigger className="hover:cursor-pointer" value="board">
            Board
          </TabsTrigger>
          <TabsTrigger className="hover:cursor-pointer" value="calender">
            Calender
          </TabsTrigger>
          <TabsTrigger className="hover:cursor-pointer" value="files">
            Files
          </TabsTrigger>
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
