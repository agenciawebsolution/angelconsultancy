export interface SlideStat {
  label: string;
  value: string;
}

export interface HomeSlide {
  id: number;
  badge?: string;
  title: string;
  highlightText?: string;
  subtitle?: string;
  ctaPrimaryText?: string;
  ctaPrimaryLink?: string;
  ctaSecondaryText?: string;
  ctaSecondaryLink?: string;
  imageUrl: string;
  imageAlt?: string;
  stats?: SlideStat[];
  sortOrder: number;
  isActive: boolean;
  desktopPositionX?: number;
  desktopPositionY?: number;
  desktopZoom?: number;
  mobilePositionX?: number;
  mobilePositionY?: number;
  mobileZoom?: number;
  createdAt?: string;
  updatedAt?: string;
}

export type HomeSlideInput = Omit<HomeSlide, 'id' | 'createdAt' | 'updatedAt'>;
