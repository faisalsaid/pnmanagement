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

const PopularCategory = () => {
  return (
    <div>
      <h1 className="mb-4 text-lg font-medium">Popular Category</h1>
      <div className="space-y-3">
        {dummyData.map((category) => (
          <Card key={category.name} className="p-0 overflow-hidden rounded-md ">
            <div className="flex">
              <div className={`w-1 ${category.fill} `}></div>
              <div className="flex items-center justify-between w-full p-2">
                <div className="">
                  <p className="capitalize text-lg">{category.name}</p>
                </div>
                <div className=" flex flex-col items-end justify-center">
                  <p className="capitalize text-xl">
                    {formatNumber(category.visit, { compact: true })}
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
