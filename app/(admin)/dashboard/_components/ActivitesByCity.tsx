'use client';

import { Card } from '@/components/ui/card';
import { formatNumber } from '@/lib/helper/formatNumber';

const cityActiviesDummy = [
  {
    city: 'ambon',
    activites: 5_497,
  },
  {
    city: 'gresik',
    activites: 324,
  },
  {
    city: 'makassar',
    activites: 1_453,
  },
  {
    city: 'jarakta',
    activites: 987,
  },
  {
    city: 'surabaya',
    activites: 434,
  },
];

const ActivitesByCity = () => {
  return (
    <div>
      <h1 className="mb-4 text-lg font-medium">Activity By City</h1>
      <div className="space-y-3">
        {cityActiviesDummy.map((city) => (
          <Card className="p-0 overflow-hidden rounded-md ">
            <div className="flex">
              <div className="w-1 bg-amber-600 "></div>
              <div className="flex items-center justify-between w-full p-2">
                <div className="">
                  <p className="capitalize text-lg">{city.city}</p>
                </div>
                <div className=" flex flex-col items-end justify-center">
                  <p className="capitalize text-xl">
                    {formatNumber(city.activites)}
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

export default ActivitesByCity;
