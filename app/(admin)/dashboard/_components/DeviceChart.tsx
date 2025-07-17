'use client';

import { CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from '@/components/ui/chart';

// import { format } from 'date-fns';
// import { id } from 'date-fns/locale';
import { getVisitDeviceStats, GetVisitsTimeRange } from '@/actions/logVisit';
import { useEffect, useState, useTransition } from 'react';
import { convertTime } from './ActivitiesChart';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const chartConfig = {
  desktop: {
    label: 'Desktop',
    color: 'var(--chart-1)',
  },
  mobile: {
    label: 'Mobile',
    color: 'var(--chart-2)',
  },
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
interface VisitDataPoint {
  time: string;
  desktop: number;
  mobile: number;
}
const DeviceChart = () => {
  const [filter, setFilter] = useState<GetVisitsTimeRange>('24h');
  const [chartDatas, setChartDatas] = useState<VisitDataPoint[] | null>(null);

  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    // let intervalId: NodeJS.Timeout;

    async function fetchData() {
      startTransition(async () => {
        const result = await getVisitDeviceStats(filter);
        setChartDatas(result);
      });
    }

    fetchData(); // Initial fetch

    const intervalId = setInterval(() => {
      fetchData();
    }, 60_000); // 60_000 every 60 seconds

    return () => {
      clearInterval(intervalId); // cleanup on unmount or filter change
    };
  }, [filter]);

  if (!chartDatas) return <div>no data</div>;

  const newData = chartDatas.map((item) => {
    const time = convertTime(item.time, filter);
    return {
      time,
      desktop: item.desktop,
      mobile: item.mobile,
    };
  });
  const data = filterRange.find((range) => range.key === filter);

  return (
    <div className="h-full bg--300 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-baseline gap-2 mb-4">
          <h1 className=" text-lg font-medium">Access By Device</h1>
          <p className="text-sm text-muted-foreground">
            {isPending
              ? 'Load new statistic ...'
              : `Data from the last ${data?.value} .`}
          </p>
        </div>
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

      <ChartContainer config={chartConfig}>
        <LineChart
          accessibilityLayer
          data={newData ?? []}
          // margin={{
          //   left: 12,
          //   right: 12,
          // }}
        >
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="time"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            // tickFormatter={(value) =>
            //   format(new Date(value), 'd MMM', { locale: id })
            // }
          />
          <YAxis tickLine={false} tickMargin={10} axisLine={false} />
          <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
          <Line
            dataKey="desktop"
            type="monotone"
            stroke="var(--color-desktop)"
            strokeWidth={2}
            dot={false}
          />
          <Line
            dataKey="mobile"
            type="monotone"
            stroke="var(--color-mobile)"
            strokeWidth={2}
            dot={false}
          />
          <ChartLegend content={<ChartLegendContent />} />
        </LineChart>
      </ChartContainer>
    </div>
  );
};

export default DeviceChart;
