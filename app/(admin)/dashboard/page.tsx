import {
  getDeviceType,
  getSimpleAnalitic,
  getTodayHits,
  getUserActive,
  getVistorTodayBySessionId,
} from '@/action/logVisit';
import React from 'react';
import TopCard from './_components/TopCard';
import { User } from 'lucide-react';
import DeviceChart from './_components/DeviceChart';
import TopFiveArtcle from './_components/TopFiveArtcle';
import RushHourChart from './_components/RushHourChart';
import ActivitesByCity from './_components/ActivitesByCity';

const page = async () => {
  const totalVisitorToday = await getVistorTodayBySessionId();
  const {
    pageViewsLast24h,
    uniqueSessionsLast24h,
    topCountries,
    topPaths,
    deviceBreakdown,
    visitsPerDay,
  } = await getSimpleAnalitic();

  const dataDevice = await getDeviceType();
  const userActive = await getUserActive();
  const totalHits = await getTodayHits();
  console.log(visitsPerDay);

  const topList = [
    { title: 'Visitor Today', icon: 'user', value: totalVisitorToday },
    { title: 'Activities', icon: 'user', value: totalHits },
    { title: 'Publish Posts', icon: 'user', value: 0 },
    { title: 'User Active', icon: 'user', value: userActive },
    { title: 'User Active', icon: 'user', value: userActive },
    { title: 'User Active', icon: 'user', value: userActive },
  ];

  const rushHourDumu = [
    { hour: 9, visits: 240 },
    { hour: 10, visits: 310 },
    { hour: 11, visits: 275 },
    { hour: 12, visits: 410 }, // 🔥 jam kunjungan terbanyak
    { hour: 13, visits: 360 },
    { hour: 14, visits: 290 },
  ];

  return (
    <div>
      <div className="grid grid-cols-2 sm:grid-cols-3  lg:grid-cols-6 gap-4">
        {topList.map((data, i) => (
          <TopCard data={data} key={i} />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-4 gap-4 mt-4">
        <div className="bg-primary-foreground p-4 rounded-lg lg:col-span-2 xl:col-span-1 2xl:col-span-2">
          <DeviceChart chartData={dataDevice} />
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
        <div className="bg-primary-foreground p-4 rounded-lg lg:col-span-2 xl:col-span-1 2xl:col-span-2"></div>
        <div className="bg-primary-foreground p-4 rounded-lg"></div>
      </div>
    </div>
  );
};

export default page;
