import RenderRichText from '@/components/RenderRIchText';
import prisma from '@/lib/prisma';

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
  });

  return (
    <div className="flex gap-4">
      <section className="flex-8/12">
        <article className="space-y-4">
          <div></div>
          <h1 className="text-2xl font-semibold">{article?.title}</h1>
          <RenderRichText content={article?.content as string} />
        </article>
      </section>
      <aside className="flex-4/12">A Side</aside>
    </div>
  );
};

export default SiglePostPage;
