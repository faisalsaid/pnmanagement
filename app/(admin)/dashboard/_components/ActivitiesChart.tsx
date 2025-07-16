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

interface VisitDataPoint {
  time: string; // ISO timestamp
  visits: number;
}
const ActivitiesChart = () => {
  const [filter, setFilter] = useState<GetVisitsTimeRange>('7d');
  const [chartData, setChartData] = useState<VisitDataPoint[] | null>(null);

  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    startTransition(async () => {
      const result = await getVisits(filter);
      console.log(result);
      setChartData(result.data);
    });
  }, [filter]);

  !isPending && console.log('chartData', chartData);

  if (!chartData) return <div>no data</div>;

  const newData = chartData.map((item) => {
    // const hour = new Intl.DateTimeFormat('id-ID', {
    //   hour: '2-digit',
    //   minute: '2-digit',
    //   hour12: true,
    // }).format(new Date(item.time));

    const hour = item.time.toString();
    return {
      hour,
      activities: item.visits,
    };
  });

  // console.log(newData);

  return (
    <div className="bg--200 h-full">
      <div className="flex items-center justify-between">
        <div className="flex items-baseline gap-2 mb-4">
          <h1 className=" text-lg font-medium">Activities</h1>
          <p className="text-sm text-muted-foreground">
            Data from the last 24 hours.
          </p>
        </div>
        <div>
          <Select
            onValueChange={(value: GetVisitsTimeRange) => setFilter(value)}
          >
            <SelectTrigger className="w-[180px]">
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
            dataKey="hour"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tickFormatter={(value) => value.slice(0, 2)}
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
