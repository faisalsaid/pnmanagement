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

export const getTenPopularPostQuery =
  Prisma.validator<Prisma.ArticleFindManyArgs>()({
    select: {
      id: true,
      title: true,
      slug: true,
      category: true,
      createdAt: true,
      viewCount: true,
      media: {
        where: {
          role: 'feature',
        },
        select: {
          mediaAsset: {
            select: {
              id: true,
              public_id: true,
              height: true,
              width: true,
            },
          },
        },
      },
    },
  });

export type TenPopularArticleType = Prisma.ArticleGetPayload<
  typeof getTenPopularPostQuery
>;
