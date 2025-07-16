'use client';

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useEffect, useState, useTransition } from 'react';
import { getVisits, GetVisitsTimeRange } from '@/actions/logVisit';

const chartConfig = {
  visit: {
    label: 'Visit',
    color: 'var(--chart-1)',
  },
  // mobile: {
  //   label: "Mobile",
  //   color: "var(--chart-2)",
  // },
} satisfies ChartConfig;

// '24h' | '7d' | '30d' | '3mo' | '6mo' | '1y';
const filterRange = [
  { key: '24h', value: '24 hours' },
  { key: '7d', value: '7 Days' },
  { key: '30d', value: '30 Days' },
  { key: '3mo', value: '3 Months' },
  { key: '6mo', value: '6 Months' },
  { key: '1y', value: '1 year' },
];

// range: '24h' | '7d' | '30d' | '3mo' | '6mo' | '1y'
export const convertTime = (date: string, range: string): string => {
  const d = new Date(date);

  switch (range) {
    case '24h':
      // Format: 07:00PM
      return d
        .toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        })
        .replace(/\s/g, ''); // removes space, e.g., "07:00 PM" → "07:00PM"

    case '7d':
    case '30d':
    case '3mo':
      // Format: MM/DD
      return d.toLocaleDateString('en-US', {
        month: '2-digit',
        day: '2-digit',
      });

    case '6mo':
    case '1y':
      // Format: MMM YYYY (e.g., "Jul 2025")
      return d.toLocaleDateString('en-US', {
        month: 'short',
        year: 'numeric',
      });

    default:
      return '';
  }
};

interface VisitDataPoint {
  time: string; // ISO timestamp
  visits: number;
}
const ActivitiesChart = () => {
  const [filter, setFilter] = useState<GetVisitsTimeRange>('24h');
  const [chartData, setChartData] = useState<VisitDataPoint[] | null>(null);

  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    async function fetchData() {
      startTransition(async () => {
        const result = await getVisits(filter);
        // console.log(result);
        setChartData(result.data);
      });
    }

    fetchData(); // Initial fetch

    intervalId = setInterval(() => {
      fetchData();
    }, 60_000); // 60_000 every 60 seconds

    return () => {
      clearInterval(intervalId); // cleanup on unmount or filter change
    };
  }, [filter]);

  if (!chartData) return <div>no data</div>;

  const newData = chartData.map((item) => {
    const time = convertTime(item.time, filter);
    return {
      time,
      activities: item.visits,
    };
  });

  // console.log(newData);
  const data = filterRange.find((range) => range.key === filter);

  // console.log(data?.value);

  return (
    <div className="bg--200 h-full space-y-4">
      <div className="flex items-center justify-between ">
        <div className="flex items-baseline gap-2 mb-4">
          <h1 className=" text-lg font-medium">Activities</h1>
          <p className="text-sm text-muted-foreground">
            {isPending
              ? 'Load new statistic ...'
              : `Data from the last ${data?.value} .`}
          </p>
        </div>
        <div>
          <Select
            onValueChange={(value: GetVisitsTimeRange) => setFilter(value)}
            defaultValue="24h"
          >
            <SelectTrigger className="w-[120px] text-sm">
              <SelectValue placeholder="Range Time" />
            </SelectTrigger>
            <SelectContent>
              {filterRange.map((range) => (
                <SelectItem key={range.key} value={range.key}>
                  {range.value}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <ChartContainer className="" config={chartConfig}>
        <AreaChart
          accessibilityLayer
          data={newData}
          margin={{
            left: 12,
            right: 12,
          }}
        >
          <CartesianGrid vertical={false} />
          <YAxis tickLine={false} tickMargin={10} axisLine={false} />
          <XAxis
            dataKey="time"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            // tickFormatter={(value) => value.slice(0, 2)}
          />
          <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
          <ChartLegend content={<ChartLegendContent />} />

          <defs>
            <linearGradient id="fillDesktop" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="orange" stopOpacity={0.8} />
              <stop offset="95%" stopColor="orange" stopOpacity={0.1} />
            </linearGradient>
            {/* <linearGradient id="fillMobile" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="5%"
                stopColor="var(--color-mobile)"
                stopOpacity={0.8}
              />
              <stop
                offset="95%"
                stopColor="var(--color-mobile)"
                stopOpacity={0.1}
              />
            </linearGradient> */}
          </defs>
          <Area
            dataKey="activities"
            type="linear"
            fill="url(#fillDesktop)"
            fillOpacity={0.4}
            stroke="orange"
            stackId="a"
          />
          {/* <Area
              dataKey="desktop"
              type="natural"
              fill="url(#fillDesktop)"
              fillOpacity={0.4}
              stroke="var(--color-desktop)"
              stackId="a"
            /> */}
        </AreaChart>
      </ChartContainer>
    </div>
  );
};

export default ActivitiesChart;
