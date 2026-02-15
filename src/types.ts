import type { ImageProps } from 'next/image';

export type { ImageProps };

/** Shopify image object matching the Storefront API Image type. */
export interface ShopifyImage {
  url: string;
  width?: number | null;
  height?: number | null;
  altText: string;
}

/** Crop options matching Shopify CDN. */
export type ShopifyCrop = 'top' | 'center' | 'bottom' | 'left' | 'right';

/** Options for the useNextShopifyImage hook. */
export interface UseNextShopifyImageOptions {
  crop?: ShopifyCrop;
  padColor?: string;
  /** The `sizes` attribute for responsive srcset generation. Defaults to `'100vw'`. */
  sizes?: string;
  /** Aspect ratio (width/height). When specified, height is calculated as `width / ratio`. */
  ratio?: number;
  /** When true, returns `fill: true` instead of `width`/`height`. */
  fill?: boolean;
}

