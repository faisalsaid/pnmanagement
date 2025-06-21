import { Skeleton } from '@/components/ui/skeleton';
import React from 'react';

const Loading = () => {
  return (
    <div>
      <div className="space-y-4">
        <h1 className="text-xl lg:text-2xl ">Website Analytics</h1>
        <div className="grid grid-cols-2 sm:grid-cols-3  lg:grid-cols-6 gap-4">
          <Skeleton className="w-full h-14" />
          <Skeleton className="w-full h-14" />
          <Skeleton className="w-full h-14" />
          <Skeleton className="w-full h-14" />
          <Skeleton className="w-full h-14" />
          <Skeleton className="w-full h-14" />
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 ">
          <div className="bg-primary-foreground  rounded-lg md:col-span-2  ">
            <Skeleton className="w-full h-64" />
          </div>
          <div className="bg-primary-foreground  rounded-lg">
            <Skeleton className="w-full h-64" />
          </div>
          <div className="bg-primary-foreground  rounded-lg">
            <Skeleton className="w-full h-64" />
          </div>
          <div className="bg-primary-foreground  rounded-lg">
            <Skeleton className="w-full h-64" />
          </div>
          <div className="bg-primary-foreground  rounded-lg md:col-span-2 md:row-start-3 lg:row-start-auto">
            <Skeleton className="w-full h-64" />
          </div>
          <div className="bg-primary-foreground  rounded-lg">
            <Skeleton className="w-full h-64" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Loading;
