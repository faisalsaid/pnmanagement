import RenderRichText from '@/components/RenderRIchText';
import prisma from '@/lib/prisma';
import ArticelAsset from '../_components/ArticelAsset';
import { incrementPostView } from '@/action/postActions';

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
    },
  });

  if (article) await incrementPostView(article?.id);

  // select first feature image
  const featureImage = article?.media.filter(
    (asset) => (asset.role = 'feature'),
  )[0];

  return (
    <div className="flex sm:flex-row flex-col gap-4">
      <section className="flex-8/12">
        <article className="space-y-4">
          <h1 className="text-2xl font-semibold">{article?.title}</h1>
          {featureImage ? (
            <ArticelAsset asset={featureImage?.mediaAsset} />
          ) : null}
          <RenderRichText content={article?.content as string} />
        </article>
      </section>
      <aside className="flex-4/12">A Side</aside>
    </div>
  );
};

export default SiglePostPage;
