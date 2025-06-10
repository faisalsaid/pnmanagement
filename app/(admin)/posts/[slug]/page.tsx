import prisma from '@/lib/prisma';
import PostDetails from '../_components/PostDetails';

interface Params {
  slug: string;
}

interface PostDetailsProps {
  params: Promise<Params>;
}

const PostsDetailsPage = async ({ params }: PostDetailsProps) => {
  const { slug } = await params;

  // console.log(session);

  const post = await prisma.article.findUnique({
    where: { slug },
    include: {
      author: {
        include: {
          articles: {
            select: {
              id: true,
            },
          },
        },
      },
      category: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
      tags: {
        select: {
          tag: true,
        },
      },
      media: {
        select: {
          mediaAsset: true,
          role: true,
        },
      },
    },
  });
  // console.log(post);

  if (!post) {
    return <div>Post not found.</div>;
  }
  return <PostDetails data={post} />;
};

export default PostsDetailsPage;
