import {
  getCategoryVisitStats,
  getCityActivityLast30Days,
  getDeviceVisitPerDay,
  getHourlyVisits24h,
  // getSimpleAnalitic,
  getTodayHits,
  getTopHoursYesterday,
  getUserActive,
  getVisits,
  getVistorTodayBySessionId,
} from '@/actions/logVisit';
import React from 'react';
import TopCard from './_components/TopCard';

import DeviceChart from './_components/DeviceChart';
import TopFiveArtcle from './_components/TopFiveArtcle';
import RushHourChart from './_components/RushHourChart';
import ActivitesByCity from './_components/ActivitesByCity';
import ActivitiesChart from './_components/ActivitiesChart';
import PopularCategory from './_components/PopularCategory';
import {
  getPublishPostsToday,
  getTopFiveArticles,
} from '@/actions/postActions';

import { FaUsers } from 'react-icons/fa6';
import { TbActivityHeartbeat } from 'react-icons/tb';
import { RiArticleLine } from 'react-icons/ri';
import { FaUserCheck } from 'react-icons/fa';

const page = async () => {
  const totalVisitorToday = await getVistorTodayBySessionId();

  const dataDevice = await getDeviceVisitPerDay();
  const userActive = await getUserActive();
  const totalHits = await getTodayHits();
  const { data } = await getPublishPostsToday();

  let publishPost = 0;

  if (data) {
    publishPost = data.length;
  }
  const topList = [
    { title: 'Visitor Today', icon: FaUsers, value: totalVisitorToday },
    { title: 'Activities', icon: TbActivityHeartbeat, value: totalHits },
    { title: 'Publish Posts', icon: RiArticleLine, value: publishPost },
    { title: 'User Active', icon: FaUserCheck, value: userActive },
    { title: 'User Active', icon: FaUserCheck, value: userActive },
    { title: 'User Active', icon: FaUserCheck, value: userActive },
  ];

  // get top five article
  const topFiveArticle = await getTopFiveArticles();
  // console.log(topFiveArticle);

  // handle rush hour
  const rawRushHour = await getTopHoursYesterday();
  const color = [
    'pink',
    'goldenrod',
    'lightblue',
    'lightseagreen',
    'orange',
    'thistle',
  ];
  const rushHourYesterday = rawRushHour.map((item, index) => ({
    ...item,
    fill: color[index] || 'gray', // fallback if no color
  }));

  // handle city activies
  const theCity = await getCityActivityLast30Days();

  // handle get  popular category
  const rawCategory = await getCategoryVisitStats();
  const categoryColor = [
    'bg-red-400',
    'bg-green-400',
    'bg-blue-400',
    'bg-purple-400',
    'bg-yellow-400',
  ];

  const popularCategory = rawCategory.map((item, i) => ({
    ...item,
    fill: categoryColor[i] || 'gray',
  }));
  // console.log(dataDevice);

  return (
    <div className="space-y-4">
      <h1 className="text-xl lg:text-2xl ">Website Analytics</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3  lg:grid-cols-6 gap-4">
        {topList.map((data, i) => (
          <TopCard data={data} key={i} />
        ))}
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 ">
        <div className="bg-primary-foreground p-4 rounded-lg md:col-span-2  ">
          <ActivitiesChart />
        </div>
        <div className="bg-primary-foreground p-4 rounded-lg">
          <TopFiveArtcle articles={topFiveArticle} />
        </div>
        <div className="bg-primary-foreground p-4 rounded-lg">
          <RushHourChart data={rushHourYesterday} />
        </div>
        <div className="bg-primary-foreground p-4 rounded-lg">
          <ActivitesByCity data={theCity} />
        </div>
        <div className="bg-primary-foreground p-4 rounded-lg md:col-span-2 md:row-start-3 lg:row-start-auto">
          <DeviceChart chartData={dataDevice} />
        </div>
        <div className="bg-primary-foreground p-4 rounded-lg">
          <PopularCategory data={popularCategory} />
        </div>
      </div>
    </div>
  );
};

export default page;
