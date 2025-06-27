// Function to transform names to initials
export function transformNameToInitials(name: string | null): string {
  if (!name) return '';

  // Split name into words
  const words = name.trim().split(/\s+/);

  // Handle single-word names
  if (words.length === 1) {
    return words[0][0]?.toUpperCase() || '';
  }

  // Handle multi-word names
  return words
    .slice(0, 2) // Only consider first two words
    .map((word) => word[0]?.toUpperCase() || '')
    .join('');
}
