import { Skeleton } from '@/components/ui/skeleton';

const Loading = () => {
  return (
    <div className="space-y-4">
      <h1 className="text-xl lg:text-2xl ">All Users</h1>
      <div className=" rounded-md  flex gap-4 items-center">
        <Skeleton className="w-full md:w-7/12 h-9" />
        <Skeleton className=" w-1/2  md:w-3/12 h-9" />
        <Skeleton className="w-1/2 md:w-2/12 h-9" />
      </div>
      <div className="bg-primary-foreground p-2 rounded-md space-y-2 ">
        {Array.from({ length: 10 }, (_, i) => (
          <div key={i} className="flex gap-4 items-center">
            <Skeleton className="w-7/12 md:w-5/12 h-9" />
            <Skeleton className="w-5/12 md:w-3/12 h-9" />
            <Skeleton className="hidden md:block w-2/12 h-9" />
            <Skeleton className="hidden md:blockw-2/12 h-9" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Loading;
