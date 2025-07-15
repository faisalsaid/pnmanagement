import { getTenPopularPost } from '@/actions/postActions';
import PopularPostCard from './PopularPostCard';

const PopularPosts = async () => {
  const popularPost = await getTenPopularPost();

  // console.log(popularPost);

  return (
    <div className="space-y-4">
      <h1 className="text-orange-600 font-semibold">Popular Post</h1>
      <div className="space-y-2">
        {popularPost && popularPost.length > 0 ? (
          popularPost.map((post) => (
            <PopularPostCard post={post} key={post.id} />
          ))
        ) : (
          <div>No Posts</div>
        )}
      </div>
    </div>
  );
};

export default PopularPosts;
