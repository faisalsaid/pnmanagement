import { Prisma } from '@prisma/client';

export const getAllHeadlineArticleQuery =
  Prisma.validator<Prisma.ArticleFindManyArgs>()({
    include: {
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
