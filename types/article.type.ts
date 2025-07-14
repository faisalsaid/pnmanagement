import { Prisma } from '@prisma/client';

export const getAllHeadlineArticleQuery =
  Prisma.validator<Prisma.ArticleFindManyArgs>()({
    select: {
      id: true,
      title: true,
      slug: true,
      category: true,
      content: true,
      status: true,
      tags: true,
      createdAt: true,
      viewCount: true,
      media: {
        select: {
          role: true,
          mediaAsset: true,
        },
      },
    },
  });

export type HeadlineArticleType = Prisma.ArticleGetPayload<
  typeof getAllHeadlineArticleQuery
>;
