'use server';
import prisma from '@/lib/prisma';
import { CreateCategorySchema, postFormSchema } from '@/lib/zod';
import { revalidatePath } from 'next/cache';
import slugify from 'slugify';
import { z } from 'zod';
import { DateTime } from 'luxon';
import {
  ArticleCategoryHomeType,
  get3CategoryForHomeQuery,
  getAllHeadlineArticleQuery,
  getTenPopularPostQuery,
  HeadlineArticleType,
  TenPopularArticleType,
} from '@/types/article.type';

interface InputCategory {
  name: string;
  slug: string;
}

export const createCategory = async (payload: InputCategory) => {
  const validatedField = CreateCategorySchema.safeParse(payload);

  if (!validatedField.success) {
    return {
      error: validatedField.error.flatten().fieldErrors,
    };
  }

  try {
    await prisma.category.create({
      data: {
        name: payload.name,
        slug: payload.slug,
      },
    });
  } catch (error) {
    console.log(error);

    return { message: 'Failed create category' };
  }

  revalidatePath('/settings'); // agar list reload di server
  return { success: true };
};

export const getAllCategory = async () => {
  try {
    const categories = await prisma.category.findMany();
    return { success: true, data: categories };
  } catch (error) {
    return { message: 'Can,t get categories', error };
  }
};

// Get all Tags
export async function getAllTags() {
  const tags = await prisma.tag.findMany({
    select: { id: true, name: true, slug: true },
  });

  return tags;
}

// HANDLE CREATE ARTICLE
export async function createArticle(data: z.infer<typeof postFormSchema>) {
  // console.log('ACTION POST', data);

  const validated = postFormSchema.parse(data);

  const [author, category] = await Promise.all([
    prisma.user.findUnique({ where: { id: validated.authorId } }),
    prisma.category.findUnique({ where: { id: validated.categoryId } }),
  ]);

  if (!author) {
    return { message: 'Invalid authorId – user not found' };
  }

  if (!category) {
    return { message: 'Invalid categoryId – category not found' };
  }

  try {
    await prisma.article.create({
      data: {
        title: validated.title,
        slug: validated.slug,
        summary: validated.summary,
        content: validated.content,
        status: validated.status,
        categoryId: validated.categoryId,
        authorId: validated.authorId,
        publishedAt: validated.status === 'PUBLISHED' ? new Date() : undefined,

        tags: {
          create: validated.tags.map((tag) => ({
            tag: {
              connectOrCreate: {
                where: { name: tag.name },
                create: {
                  name: tag.name,
                  slug: slugify(tag.name, { lower: true }),
                },
              },
            },
          })),
        },

        media:
          validated.media.length > 0
            ? {
                create: validated.media.map((media) => ({
                  mediaAsset: {
                    connect: { id: media.id },
                  },
                  role: media.role,
                })),
              }
            : undefined,
      },
    });

    return { success: true };
  } catch (error) {
    console.error('CREATE POST ERROR:', error);
    return {
      message: 'Failed to create post',
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

// GET POST by slug
export async function getPostBySlug(slug: string) {
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

  return { categories, post };
}

// handle UPDATE POST
type UpdateArticlePayload = z.infer<typeof postFormSchema> & { slug: string };

export async function updateArticle(data: UpdateArticlePayload) {
  // console.log('updateArticle ==>>', data);

  const { slug, title, content, summary, status, authorId, categoryId, tags } =
    data;

  try {
    const existingArticle = await prisma.article.findUnique({
      where: { slug },
      select: { id: true },
    });

    if (!existingArticle) {
      throw new Error('Article not found.');
    }

    const articleId = existingArticle.id;

    // Handle tags: ensure all have IDs (create new tags if needed)
    const ensuredTags = await Promise.all(
      tags.map(async (tag) => {
        if (tag.id && tag.id.trim() !== '') {
          return tag; // existing tag
        }

        // Check if tag with same slug already exists
        let existingTag = await prisma.tag.findUnique({
          where: { slug: tag.slug },
        });

        if (!existingTag) {
          // Create new tag
          existingTag = await prisma.tag.create({
            data: {
              name: tag.name,
              slug: tag.slug,
            },
          });
        }

        return {
          id: existingTag.id,
          name: existingTag.name,
          slug: existingTag.slug,
        };
      }),
    );

    const uniqueMedia = new Set();
    for (const m of data.media) {
      const key = `${m.id}:${m.role}`;
      if (uniqueMedia.has(key)) {
        throw new Error(`Duplicate media-role pair: ${key}`);
      }
      uniqueMedia.add(key);
    }

    const mediaOps = [
      prisma.articleMedia.deleteMany({
        where: { articleId },
      }),

      ...data.media.map((m) =>
        prisma.articleMedia.create({
          data: {
            articleId,
            mediaAssetId: m.id,
            role: m.role,
          },
        }),
      ),
    ];

    // Run the transaction
    await prisma.$transaction([
      // Update the article itself
      prisma.article.update({
        where: { id: articleId },
        data: {
          title,
          content,
          summary,
          status,
          authorId,
          categoryId,
          updatedAt: new Date(),
        },
      }),

      // Clear existing tags
      prisma.articleTag.deleteMany({
        where: { articleId },
      }),

      // Re-create tag relationships
      ...ensuredTags.map((tag) =>
        prisma.articleTag.create({
          data: {
            articleId,
            tagId: tag.id,
          },
        }),
      ),

      ...mediaOps,
    ]);

    return { success: true };
  } catch (error) {
    console.error('Update article fail:', error);
    return { success: false, message: 'Update article fail' };
  }
}

// HANDLE ARCTICLE COUNT INCREMENT

export async function incrementPostView(id: string) {
  await prisma.article.update({
    where: { id: id },
    data: {
      viewCount: { increment: 1 },
    },
  });
}

/////////////////////////////////////////////////////////////////////////////////////////
// HANDLE GET ALL POST PUBLISH TODAY ASIA/JAKART GMT+7

const nowJakarta = DateTime.now().setZone('Asia/Jakarta');

export const getPublishPostsToday = async () => {
  // set star day and end day
  const startOfDay = nowJakarta.startOf('day'); // 00:00:00 Jakarta
  const endOfDay = nowJakarta.endOf('day'); // 23:59:59.999 Jakarta

  // covertion to UTC
  const startUtc = startOfDay.toUTC().toJSDate();
  const endUtc = endOfDay.toUTC().toJSDate();

  // console.log('TIMES LOCAL GMT+7', startOfDay, endOfDay);
  // console.log('TIMES UTC ', startUtc, endUtc);

  try {
    // Prisma query
    const posts = await prisma.article.findMany({
      select: {
        id: true,
      },
      where: {
        createdAt: {
          gte: startUtc,
          lte: endUtc,
        },
      },
    });

    return { messages: 'success', data: posts };
  } catch (error) {
    return { message: 'Failed get publish post today', error };
  }
};

/////////////////////////////////////////////////////////////////////////////////////////

// GET Top Five Article with mosts viewCount

export async function getTopFiveArticles() {
  const articles = await prisma.article.findMany({
    take: 5,
    orderBy: { viewCount: 'desc' },
    select: {
      id: true,
      title: true,
      viewCount: true,
      category: true,
      createdAt: true,
      slug: true,
      media: {
        select: {
          mediaAsset: true,
          role: true,
        },
      },
    },
  });

  return articles;
}

// GET all hedaline post

export const getAllHeadlineArticle = async () => {
  try {
    const result: HeadlineArticleType[] = await prisma.article.findMany({
      where: {
        category: {
          slug: 'utama',
        },
        status: 'PUBLISHED',
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 5,
      ...getAllHeadlineArticleQuery,
    });

    if (result) {
      return { success: true, data: result };
    } else {
      return { success: false, data: [] };
    }
  } catch (error: any) {
    console.error('Error fetching headline articles:', error);
    throw new Error('Failed to get all headline posts');
  }
};

// GET ten popular post by viewcount

export const getTenPopularPost = async () => {
  try {
    const result: TenPopularArticleType[] = await prisma.article.findMany({
      where: {
        status: 'PUBLISHED',
      },
      orderBy: {
        viewCount: 'desc',
      },
      take: 10,
      ...getTenPopularPostQuery,
    });

    return result;
  } catch (error) {
    console.error('Error fetching popular post', error);
    throw new Error('Failed to get popular post');
  }
};

// GET get 3 categories for home

export const get3CategoriesForHome = async () => {
  try {
    const [politik, hukum, olahraga]: [
      ArticleCategoryHomeType[],
      ArticleCategoryHomeType[],
      ArticleCategoryHomeType[],
    ] = await Promise.all([
      prisma.article.findMany({
        ...get3CategoryForHomeQuery,
        where: {
          category: {
            slug: 'politik',
          },
          deletedAt: null,
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: 4,
      }),
      prisma.article.findMany({
        ...get3CategoryForHomeQuery,
        where: {
          category: {
            slug: 'hukum',
          },
          deletedAt: null,
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: 4,
      }),
      prisma.article.findMany({
        ...get3CategoryForHomeQuery,
        where: {
          category: {
            slug: 'olahraga',
          },
          deletedAt: null,
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: 4,
      }),
    ]);

    if (!politik || !hukum || !olahraga) {
      return {
        success: false,
        data: [],
      };
    } else {
      return {
        success: true,
        data: [
          { name: 'politik', data: politik },
          { name: 'hukum', data: hukum },
          { name: 'olahraga', data: olahraga },
        ],
      };
    }
  } catch (error) {
    console.error('Error fetching article by cotegory for home', error);
    throw new Error('Failed to get article by cotegory for home');
  }
};
