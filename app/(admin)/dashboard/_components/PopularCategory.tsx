import { Card } from '@/components/ui/card';
import { formatNumber } from '@/lib/helper/formatNumber';

const dummyData = [
  {
    name: 'olahraga',
    visit: 947,
    fill: 'bg-red-400',
  },
  {
    name: 'politik',
    visit: 724,
    fill: 'bg-green-400',
  },
  {
    name: 'hukum',
    visit: 543,
    fill: 'bg-blue-400',
  },
  {
    name: 'ekonomi',
    visit: 254,
    fill: 'bg-purple-400',
  },
  {
    name: 'hiburan',
    visit: 211,
    fill: 'bg-yellow-400',
  },
];

interface Props {
  data: {
    category: string;
    visits: number;
    fill: string;
  }[];
}

const PopularCategory = ({ data }: Props) => {
  return (
    <div>
      <div className="flex items-baseline gap-2 mb-4">
        <h1 className=" text-lg font-medium">Popular Category</h1>
        <p className="text-sm text-muted-foreground">Last 30 days</p>
      </div>
      <div className="space-y-3">
        {data.map((category) => (
          <Card
            key={category.category}
            className="p-0 overflow-hidden rounded-md "
          >
            <div className="flex">
              <div className={`w-1 ${category.fill} `}></div>
              <div className="flex items-center justify-between w-full p-2">
                <div className="">
                  <p className="capitalize ">{category.category}</p>
                </div>
                <div className=" flex flex-col items-end justify-center">
                  <p className="capitalize text-lg">
                    {formatNumber(category.visits, { compact: true })}
                  </p>
                  <p className="text-xs">Activites</p>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PopularCategory;
