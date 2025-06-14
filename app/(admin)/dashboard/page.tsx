import { getVistorTodayBySessionId } from '@/action/logVisit';
import React from 'react';

const page = async () => {
  const totalVisitorToday = await getVistorTodayBySessionId();
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-4 gap-4 mt-4">
      <div className="bg-primary-foreground p-4 rounded-lg lg:col-span-2 xl:col-span-1 2xl:col-span-2"></div>
      <div className="bg-primary-foreground p-4 rounded-lg">
        {totalVisitorToday}
      </div>
      <div className="bg-primary-foreground p-4 rounded-lg"></div>
      <div className="bg-primary-foreground p-4 rounded-lg"></div>
      <div className="bg-primary-foreground p-4 rounded-lg lg:col-span-2 xl:col-span-1 2xl:col-span-2"></div>
      <div className="bg-primary-foreground p-4 rounded-lg"></div>
    </div>
  );
};

export default page;
