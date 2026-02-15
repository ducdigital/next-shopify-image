import { useMemo } from 'react';
import type { ImageLoaderProps, ImageProps } from 'next/image';
import type {
  ShopifyImage,
  ShopifyCrop,
  UseNextShopifyImageOptions,
} from './types';

interface ShopifyImageParams {
  width?: number;
  height?: number;
  crop?: ShopifyCrop;
  pad_color?: string;
}

/**
 * Build a Shopify CDN image URL with the given parameters.
 * Strips existing query params from the base URL and appends new ones.
 */
export function buildShopifyImageUrl(
  url: string,
  params: ShopifyImageParams
): string {
  const baseUrl = url.split('?')[0];
  const searchParams = new URLSearchParams();

  if (params.width != null) {
    searchParams.set('width', String(params.width));
  }
  if (params.height != null) {
    searchParams.set('height', String(params.height));
  }
  if (params.crop) {
    searchParams.set('crop', params.crop);
  }
  if (params.pad_color) {
    searchParams.set('pad_color', params.pad_color);
  }

  const qs = searchParams.toString();
  return qs ? `${baseUrl}?${qs}` : baseUrl;
}

const DEFAULT_IMAGE_WIDTH = 1920;
const DEFAULT_IMAGE_HEIGHT = 1080;

/**
 * React hook that returns props for the Next.js `<Image>` component,
 * using Shopify's CDN for image transformations.
 */
export function useNextShopifyImage(
  image: ShopifyImage,
  options: UseNextShopifyImageOptions = {}
): ImageProps {
  const { crop, padColor, sizes = '100vw', ratio, fill } = options;

  return useMemo(() => {
    const url = image?.url ?? '';
    const originalWidth = image?.width ?? DEFAULT_IMAGE_WIDTH;
    const originalHeight = image?.height ?? DEFAULT_IMAGE_HEIGHT;
    const baseUrl = url.split('?')[0];
    const height = ratio ? Math.round(originalWidth / ratio) : originalHeight;

    const loader = ({ width }: ImageLoaderProps): string => {
      return buildShopifyImageUrl(baseUrl, {
        width,
        height: ratio ? Math.round(width / ratio) : undefined,
        crop,
        pad_color: padColor,
      });
    };

    if (fill) {
      return {
        loader,
        src: baseUrl,
        alt: image?.altText,
        sizes,
        fill: true,
      };
    }

    return {
      loader,
      src: baseUrl,
      alt: image?.altText,
      sizes,
      width: originalWidth,
      height,
    };
  }, [image?.url, image?.width, image?.height, image?.altText, crop, padColor, sizes, ratio, fill]);
}
