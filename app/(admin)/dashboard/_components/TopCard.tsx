import { Card } from '@/components/ui/card';
import { House } from 'lucide-react';
import { IconType } from 'react-icons/lib';

interface Props {
  data: {
    title: string;
    icon: IconType;
    value: number;
  };
}

const TopCard = ({ data }: Props) => {
  const Icon = data.icon;
  return (
    <Card className="p-0">
      <div className="p-2 flex gap-2 items-center ">
        {/* <div className="aspect-square h-full bg-linear-65 from-purple-500 to-pink-500 text-white bg-primary-foreground p-2 rounded-sm flex items-center justify-center"> */}
        <div className="aspect-square h-full bg-fuchsia-400 text-white p-2 rounded-sm flex items-center justify-center">
          <Icon className="w-4 sm:w-6" />
        </div>
        <div className=" flex flex-col w-full">
          <p className="font-semibold text-xs lg:text-sm text-muted-foreground">
            {data.title}
          </p>
          <p className="text-sm font-semibold self-end">{data.value}</p>
        </div>
      </div>
    </Card>
  );
};

export default TopCard;
