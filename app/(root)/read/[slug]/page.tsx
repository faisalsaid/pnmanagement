import RenderRichText from '@/components/RenderRIchText';
import prisma from '@/lib/prisma';
import ArticelAsset from '../_components/ArticelAsset';
import { incrementPostView } from '@/actions/postActions';
import PopularPosts from '../../_components/PopularPosts';
import Link from 'next/link';

type ParamsProps = { slug: string };

type Props = {
  params: Promise<ParamsProps>;
};

const SiglePostPage = async ({ params }: Props) => {
  const { slug } = await params;

  const article = await prisma.article.findUnique({
    where: {
      slug,
    },
    include: {
      media: {
        select: {
          mediaAsset: true,
          role: true,
        },
      },
      category: {
        select: {
          id: true,
          slug: true,
          name: true,
        },
      },
    },
  });

  // hanlde post view count
  if (article) await incrementPostView(article?.id);

  // select first feature image
  const featureImage = article?.media.find((asset) => asset.role === 'feature');

  return (
    <div className="flex sm:flex-row flex-col gap-6">
      <section className="flex-8/12">
        <article className="space-y-4">
          <h1 className="text-2xl font-semibold">{article?.title}</h1>
          <div>
            <Link href={`/category/${article?.category.slug}`}>
              <span>{article?.category.name}</span>
            </Link>{' '}
            -{' '}
            <span>
              {article?.publishedAt
                ? article.publishedAt.toLocaleDateString()
                : article?.createdAt.toLocaleDateString()}
            </span>
          </div>
          {featureImage ? (
            <ArticelAsset asset={featureImage?.mediaAsset} />
          ) : null}
          <RenderRichText content={article?.content as string} />
        </article>
      </section>
      <aside className="flex-4/12">
        <PopularPosts />
      </aside>
    </div>
  );
};

export default SiglePostPage;
