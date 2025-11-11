export function getCoverImage(content: string): string | undefined {
  if (!content || typeof content !== "string") return undefined;
  const imgTagMatch = content.match(/<img[^>]+src=["']([^"']+)["']/i);
  return imgTagMatch ? imgTagMatch[1] : undefined;
}
