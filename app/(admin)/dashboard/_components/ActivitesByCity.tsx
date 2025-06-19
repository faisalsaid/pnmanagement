'use client';

import { Card } from '@/components/ui/card';
import { formatNumber } from '@/lib/helper/formatNumber';

// const cityActiviesDummy = [
//   {
//     city: 'ambon',
//     activites: 5_497,
//   },
//   {
//     city: 'gresik',
//     activites: 324,
//   },
//   {
//     city: 'makassar',
//     activites: 1_453,
//   },
//   {
//     city: 'jarakta',
//     activites: 987,
//   },
//   {
//     city: 'surabaya',
//     activites: 434,
//   },
// ];

interface Props {
  data: {
    city: string;
    visits: number;
    country: string;
  }[];
}

const ActivitesByCity = ({ data }: Props) => {
  return (
    <div>
      <div className="flex items-baseline gap-2 mb-4">
        <h1 className=" text-lg font-medium">Activity By City</h1>
        <p className="text-sm text-muted-foreground">Last 30 days</p>
      </div>
      <div className="space-y-3">
        {data.map((city) => (
          <Card key={city.city} className="p-0 overflow-hidden rounded-md ">
            <div className="flex">
              <div className="w-1 bg-amber-600 "></div>
              <div className="flex items-center justify-between w-full p-2">
                <div className="">
                  <p className="capitalize text-lg">
                    {city.city}{' '}
                    <span className="text-muted-foreground text-sm">
                      - {city.country}
                    </span>
                  </p>
                </div>
                <div className=" flex flex-col items-end justify-center">
                  <p className="capitalize text-xl">
                    {formatNumber(city.visits)}
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
