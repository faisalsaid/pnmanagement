'use client';

import { Label, Pie, PieChart } from 'recharts';

import {
  ChartConfig,
  ChartContainer,
  // ChartLegend,
  // ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { useMemo } from 'react';

interface Props {
  data: {
    hour: string;
    visits: number;
    fill: string;
  }[];
}

// const rushHourDummy = [
//   { hour: '09:PM', visits: 240, fill: 'pink' },
//   { hour: '10:PM', visits: 310, fill: 'goldenrod' },
//   { hour: '11:PM', visits: 275, fill: 'lightblue' },
//   { hour: '12:PM', visits: 820, fill: 'lightseagreen' }, // 🔥 jam kunjungan terbanyak
//   { hour: '13:PM', visits: 360, fill: 'orange' },
//   { hour: '14:PM', visits: 290, fill: 'thistle' },
// ];

const chartConfig = {
  visitors: {
    label: 'Visitors',
  },
  //   t_9PM: {
  //     label: '09:PM',
  //     color: 'var(--chart-1)',
  //   },
  //   t_10PM: {
  //     label: '10:PM',
  //     color: 'var(--chart-2)',
  //   },
  //   t_11PM: {
  //     label: '11:PM',
  //     color: 'var(--chart-3)',
  //   },
  //   t_12PM: {
  //     label: '12:PM',
  //     color: 'var(--chart-4)',
  //   },
  //   t_13PM: {
  //     label: '13:PM',
  //     color: 'var(--chart-5)',
  //   },
} satisfies ChartConfig;

const RushHourChart = ({ data }: Props) => {
  const totalVisitors = useMemo(() => {
    return data.reduce((acc, curr) => acc + curr.visits, 0);
  }, []);
  return (
    <div>
      <div className="flex items-baseline gap-2 mb-4">
        <h1 className=" text-lg font-medium">Rush Hour</h1>
        <p className="text-sm text-muted-foreground">Yesterday | GMT+7</p>
      </div>
      <ChartContainer config={chartConfig} className="mx-auto aspect-square ">
        <PieChart>
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent hideLabel />}
          />

          {/* <ChartLegend
            content={<ChartLegendContent nameKey="hour" />}
            className="-translate-y-2 flex-wrap gap-2 *:basis-1/4 *:justify-center"
          /> */}
          <Pie
            data={data}
            dataKey="visits"
            nameKey="hour"
            innerRadius={60}
            strokeWidth={50}
          >
            <Label
              content={({ viewBox }) => {
                if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                  return (
                    <text
                      x={viewBox.cx}
                      y={viewBox.cy}
                      textAnchor="middle"
                      dominantBaseline="middle"
                    >
                      <tspan
                        x={viewBox.cx}
                        y={viewBox.cy}
                        className="fill-foreground text-3xl font-bold"
                      >
                        {totalVisitors.toLocaleString()}
                      </tspan>
                      <tspan
                        x={viewBox.cx}
                        y={(viewBox.cy || 0) + 24}
                        className="fill-muted-foreground"
                      >
                        Activities
                      </tspan>
                    </text>
                  );
                }
              }}
            />
          </Pie>
        </PieChart>
      </ChartContainer>
    </div>
  );
};

export default RushHourChart;
