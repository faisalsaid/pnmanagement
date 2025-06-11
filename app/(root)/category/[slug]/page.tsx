import prisma from '@/prisma';
import CategoryHeadArticle from '../../_components/CategoryHeadArticle';

type SlugProps = { slug: string };

type CategoryPageProps = {
  params: Promise<SlugProps>;
};

const CategoryPage = async ({ params }: CategoryPageProps) => {
  const { slug } = await params;

  const categoryPosts = await prisma.article.findMany({
    include: {
      media: {
        select: {
          role: true,
          mediaAsset: true,
        },
      },
    },
    where: {
      category: { slug },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  if (!categoryPosts || categoryPosts.length < 1) {
    return <div>Postingan untuk {slug} tidak ditemukan</div>;
  }

  const headPost = categoryPosts[0];

  return (
    <div className="py-4 space-x-4">
      <h1 className="text-2xl capitalize font-semibold text-muted-foreground">
        {slug}
      </h1>
      <CategoryHeadArticle article={headPost} />
    </div>
  );
};

export default CategoryPage;
