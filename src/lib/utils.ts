export function normalizeImageUrl(url: string): string {
  if (!url) return '';
  const trimmed = url.trim();

  // If it's a Google Drive link, convert to direct viewable CDN link
  if (trimmed.includes('drive.google.com') || trimmed.includes('docs.google.com')) {
    const idMatch = trimmed.match(/\/d\/([a-zA-Z0-9_-]+)/) || trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/);
    if (idMatch && idMatch[1]) {
      return `https://lh3.googleusercontent.com/d/${idMatch[1]}`;
    }
  }

  return trimmed;
}
