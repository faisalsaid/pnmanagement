'use client';

import { Progress } from '@/components/ui/progress';

interface GoalsItem {
  title: string;
  value: number;
}

interface ProjectProgressProps {
  goals: GoalsItem[];
}

const ProjectProgress = ({ goals }: ProjectProgressProps) => {
  const finishGoals = goals.filter((goal) => goal.value === 100);
  return (
    <div className="w-full space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="font-bolds">Goals Progress</h2>
        <div className="text-sm text-primary bg-orange-400/20 border border-orange-500 px-2 rounded-md">
          {finishGoals.length}/{goals.length} Goals
        </div>
      </div>
      <div className="space-y-2.5">
        {goals.length > 0 ? (
          goals.map((goal, i) => (
            <ProgressCard key={i} value={goal.value} title={goal.title} />
          ))
        ) : (
          <div>no goals</div>
        )}
      </div>
    </div>
  );
};

export default ProjectProgress;

interface ProgressCardProps {
  title: string;
  value: number;
}

const ProgressCard = ({ value, title }: ProgressCardProps) => {
  return (
    <div className="space-y-1">
      <div className="text-sm flex items-center justify-between">
        <p>{title}</p>
        <p>{value}%</p>
      </div>
      <Progress value={value} />
    </div>
  );
};
