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

type ActivitiesChartProps = {
  data: {
    hour: string;
    visits: number;
  }[];
};
const ActivitiesChart = ({ data }: ActivitiesChartProps) => {
  const newData = data.map((item) => {
    const hour = new Intl.DateTimeFormat('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    }).format(new Date(item.hour));
    return {
      hour,
      activities: item.visits,
    };
  });

  // console.log(newData);

  return (
    <div>
      <h1 className="mb-4 text-lg font-medium">Activities</h1>
      <ChartContainer config={chartConfig}>
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
            type="natural"
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
