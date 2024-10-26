export function isSupportedImageUrl(url: string): boolean {
  const supportedExtensions = ['.jpg', '.jpeg', '.png', '.webp'];
  const lowercasedUrl = url.toLowerCase();
  return supportedExtensions.some((ext) => lowercasedUrl.endsWith(ext));
}
