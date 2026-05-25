import { BASE_URL } from './config';

export function loadImage(imageUrl: string, imageElement: HTMLImageElement): void {
  if (!imageUrl || !imageElement) {
    console.error('Invalid image URL or image element');
    return;
  }

  const fullImageUrl = `${BASE_URL}Document/download-file?filePath=${encodeURIComponent(imageUrl)}`;
  imageElement.src = fullImageUrl;
}