import {
  getDeviceType,
  getHourlyVisits24h,
  // getSimpleAnalitic,
  getTodayHits,
  getUserActive,
  getVistorTodayBySessionId,
} from '@/action/logVisit';
import React from 'react';
import TopCard from './_components/TopCard';

import DeviceChart from './_components/DeviceChart';
import TopFiveArtcle from './_components/TopFiveArtcle';
import RushHourChart from './_components/RushHourChart';
import ActivitesByCity from './_components/ActivitesByCity';
import ActivitiesChart from './_components/ActivitiesChart';
import PopularCategory from './_components/PopularCategory';
import { getPublishPostsToday } from '@/action/postActions';

const page = async () => {
  const totalVisitorToday = await getVistorTodayBySessionId();

  const dataDevice = await getDeviceType();
  const userActive = await getUserActive();
  const totalHits = await getTodayHits();
  const { data } = await getPublishPostsToday();

  let publishPost = 0;

  if (data) {
    publishPost = data.length;
  }

  console.log(publishPost);

  // console.log(visitsPerDay);

  const topList = [
    { title: 'Visitor Today', icon: 'user', value: totalVisitorToday },
    { title: 'Activities', icon: 'user', value: totalHits },
    { title: 'Publish Posts', icon: 'user', value: publishPost },
    { title: 'User Active', icon: 'user', value: userActive },
    { title: 'User Active', icon: 'user', value: userActive },
    { title: 'User Active', icon: 'user', value: userActive },
  ];

  const get24lastActivites = await getHourlyVisits24h();
  // console.log('DASHBOARD PAGE', get24lastActivites);

  return (
    <div>
      <div className="grid grid-cols-2 sm:grid-cols-3  lg:grid-cols-6 gap-4">
        {topList.map((data, i) => (
          <TopCard data={data} key={i} />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-4 gap-4 mt-4">
        <div className="bg-primary-foreground p-4 rounded-lg lg:col-span-2 xl:col-span-1 2xl:col-span-2">
          <ActivitiesChart data={get24lastActivites.data} />
        </div>
        <div className="bg-primary-foreground p-4 rounded-lg">
          <TopFiveArtcle />
        </div>
        <div className="bg-primary-foreground p-4 rounded-lg">
          <RushHourChart />
        </div>
        <div className="bg-primary-foreground p-4 rounded-lg">
          <ActivitesByCity />
        </div>
        <div className="bg-primary-foreground p-4 rounded-lg lg:col-span-2 xl:col-span-1 2xl:col-span-2">
          <DeviceChart chartData={dataDevice} />
        </div>
        <div className="bg-primary-foreground p-4 rounded-lg">
          <PopularCategory />
        </div>
      </div>
    </div>
  );
};

export default page;
