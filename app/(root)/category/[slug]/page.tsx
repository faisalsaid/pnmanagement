import prisma from '@/prisma';
import CategoryHeadArticle from '../../_components/CategoryHeadArticle';
import { Separator } from '@/components/ui/separator';
import PopularPosts from '../../_components/PopularPosts';
import CategoryPostCard from '../_components/CategoryPostCard';
import { allPostCategoryQuery, ArticleCatgoryType } from '@/types/article.type';

type SlugProps = { slug: string };

type CategoryPageProps = {
  params: Promise<SlugProps>;
};

const CategoryPage = async ({ params }: CategoryPageProps) => {
  const { slug } = await params;

  const categoryPosts: ArticleCatgoryType[] = await prisma.article.findMany({
    ...allPostCategoryQuery,
    where: {
      category: { slug },
      status: 'PUBLISHED',
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  if (!categoryPosts || categoryPosts.length < 1) {
    return <div>Postingan untuk {slug} tidak ditemukan</div>;
  }

  // const headPost = categoryPosts[0];
  const [headPost, ...allPost] = categoryPosts;

  return (
    <div className="py-4 space-y-4">
      <h1 className="text-2xl capitalize font-semibold text-muted-foreground">
        {slug}
      </h1>
      <div className="space-y-4">
        <CategoryHeadArticle article={headPost} />
        <Separator />
        <div className="md:grid grid-cols-3 gap-6 ">
          <div className="col-span-2 grid grid-cols-2 gap-4 h-fit">
            {allPost.map((post) => (
              <CategoryPostCard key={post.id} article={post} />
            ))}
          </div>
          <div>
            <PopularPosts />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;
