import type { ImageMetadata } from 'astro';

/** The portrait at src/assets/photo.{jpg,jpeg,png,webp}, if one has been added. */
const found = import.meta.glob<{ default: ImageMetadata }>('../assets/photo.{jpg,jpeg,png,webp}', { eager: true });

export const photo: ImageMetadata | undefined = Object.values(found)[0]?.default;
export const PHOTO_ALT = 'Sai Pranav Krovvidi';
