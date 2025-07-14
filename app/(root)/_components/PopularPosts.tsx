const PopularPosts = () => {
  return (
    <div className="space-y-6">
      <h1>Popular Post</h1>
      <div className="space-y-2">
        {Array.from({ length: 10 }, (_, i) => (
          <PopularPostCard key={i} />
        ))}
      </div>
    </div>
  );
};

export default PopularPosts;

const PopularPostCard = () => {
  return (
    <div className="flex items-center gap-2">
      <div className="h-[60px] aspect-square bg-orange-400 rounded-md"></div>
      <h1 className="text-sm line-clamp-3">
        Lorem ipsum, dolor sit amet consectetur adipisicing elit.
      </h1>
      <div className="flex flex-col items-center p-2 bg-amber-100 rounded-sm justify-center">
        <span>300</span>
        <span className="text-xs">views</span>
      </div>
    </div>
  );
};
