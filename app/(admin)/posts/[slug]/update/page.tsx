import prisma from '@/lib/prisma';
// import { PostDetail } from '../../_components/PostDetails';
import ArticleForm from '../../_components/form/ArticelForm';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';

interface ParamsProps {
  slug: string;
}

interface PageProps {
  params: Promise<ParamsProps>;
}

const EditPostPage = async ({ params }: PageProps) => {
  // get session
  const session = await auth();

  // fetch arcicle and categories
  const { slug } = await params;

  const categories = await prisma.category.findMany();

  const post = await prisma.article.findUnique({
    where: { slug },
    include: {
      tags: { include: { tag: true } },
      media: {
        select: {
          mediaAsset: true,
          role: true,
        },
      },
    },
  });

  // Ensure the user has the appropriate role or owns the article.
  const permision =
    ['ADMIN', 'PEMRED', 'REDAKTUR'].includes(session?.user.role as string) ||
    post?.authorId === session?.user.id;

  if (!permision) {
    redirect('/posts');
  }

  if (!post || !session?.user) return <div>Post not found or unauthorized</div>;

  const transformedPost = {
    id: post.id,
    title: post.title,
    slug: post.slug,
    content: post.content,
    summary: post.summary ?? '',
    categoryId: post.categoryId,
    status: post.status,
    authorId: post.authorId,
    tags: post.tags.map((t) => t.tag),
    media: post.media.map((m) => ({
      id: m.mediaAsset.id,
      role: m.role,
    })),
  };
  return (
    <ArticleForm
      initialData={transformedPost}
      categories={categories}
      authorId={session?.user.id}
    />
  );
};

export default EditPostPage;
