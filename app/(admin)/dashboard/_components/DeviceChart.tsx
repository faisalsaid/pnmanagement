'use client';

import { CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';

import { format } from 'date-fns';
import { id } from 'date-fns/locale';

// const chartData = [
//   { day: 'January', desktop: 186, mobile: 80 },
//   { day: 'February', desktop: 305, mobile: 200 },
//   { day: 'March', desktop: 237, mobile: 120 },
//   { day: 'April', desktop: 73, mobile: 190 },
//   { day: 'May', desktop: 209, mobile: 130 },
//   { day: 'June', desktop: 214, mobile: 140 },
// ];

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

interface Props {
  chartData: {
    date: string;
    desktop: number;
    mobile: number;
  }[];
}

const DeviceChart = ({ chartData }: Props) => {
  return (
    <div>
      <h1 className="mb-4 text-lg font-medium">Access By Device</h1>

      <ChartContainer config={chartConfig}>
        <LineChart
          accessibilityLayer
          data={chartData}
          // margin={{
          //   left: 12,
          //   right: 12,
          // }}
        >
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="date"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tickFormatter={(value) =>
              format(new Date(value), 'd MMMM', { locale: id })
            }
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
        </LineChart>
      </ChartContainer>
    </div>
  );
};

export default DeviceChart;
