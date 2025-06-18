import { Card } from '@/components/ui/card';
import { House } from 'lucide-react';

interface Props {
  data: {
    title: string;
    icon: string;
    value: number;
  };
}

const TopCard = ({ data }: Props) => {
  // const Icon = data.icon;
  return (
    <Card className="p-0">
      <div className="p-2 flex gap-4 items-center ">
        <div className=" bg-linear-65 from-purple-500 to-pink-500 text-white bg-primary-foreground p-3 rounded-md">
          <House />
        </div>
        <div className=" flex  flex-col w-full">
          <p className="font-semibold text-sm text-muted-foreground">
            {data.title}
          </p>
          <p className="text-lg font-semibold self-end">{data.value}</p>
        </div>
      </div>
    </Card>
  );
};

export default TopCard;
