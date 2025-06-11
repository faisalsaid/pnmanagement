export function getExcerptFromHtml(html: string, wordLimit = 30): string {
  const plainText = html.replace(/<[^>]*>/g, ''); // Hapus semua tag HTML
  const words = plainText.split(/\s+/).filter(Boolean);
  const excerpt = words.slice(0, wordLimit).join(' ');
  return excerpt + (words.length > wordLimit ? '...' : '');
}
