'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import ArticleForm from '../../_components/form/ArticelForm';
import { getPostBySlug } from '@/action/postActions';

export default function EditPostPage() {
  const params = useParams();
  const slug = params?.slug as string; // pastikan slug ada

  const [loading, setLoading] = useState(true);
  const [post, setPost] = useState<any>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;

    async function fetchData() {
      try {
        const data = await getPostBySlug(slug);
        if (!data.post) {
          setError('Post not found');
          return;
        }
        setCategories(data.categories);
        setPost(data.post);
      } catch (e) {
        setError('Failed to fetch post');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [slug]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!post) return <div>Post not found</div>;

  const transformedPost = {
    id: post.id,
    title: post.title,
    slug: post.slug,
    content: post.content,
    summary: post.summary ?? '',
    categoryId: post.categoryId,
    status: post.status,
    authorId: post.authorId,
    tags: post.tags.map((t: any) => t.tag),
    media: post.media.map((m: any) => ({
      id: m.mediaAsset.id,
      role: m.role,
    })),
  };

  return (
    <ArticleForm
      initialData={transformedPost}
      categories={categories}
      authorId={post.authorId}
    />
  );
}
