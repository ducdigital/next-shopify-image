# next-shopify-image

A React hook for using Shopify CDN images with the Next.js `<Image>` component. Bypasses the Next.js image optimizer by leveraging Shopify's built-in CDN transformations (resizing, cropping, format auto-detection).

## Installation

```bash
npm install next-shopify-image
```

## Usage

### Create a reusable `ShopifyImage` component

```tsx
"use client";
import Image, { ImageProps } from 'next/image';
import { useNextShopifyImage, ShopifyImage as ShopifyImageType, UseNextShopifyImageOptions } from 'next-shopify-image';

type ShopifyImageProps = Omit<ImageProps, 'src' | 'alt' | 'loader'> & {
  image: ShopifyImageType;
  /** Override the alt text from the image object. */
  alt: string;
  fill: boolean,
  options?: UseNextShopifyImageOptions
};

export function ShopifyImage({ image, alt, fill, sizes, options }: ShopifyImageProps) {
  const imageProps = useNextShopifyImage(image, {
    crop: 'center',
    ratio: 4 / 5,
    fill: fill,
    ...options
  });

  return <Image {...imageProps} alt={alt ?? image.altText} fill={fill}
    sizes={sizes ?? "(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"} />;
}
```

### Use the component

```tsx
// image from Shopify Storefront API
const image = {
  url: 'https://cdn.shopify.com/s/files/1/xxx/image.jpg',
  width: 1920,
  height: 1080,
  altText: 'Product photo',
};

// Fixed dimensions
<ShopifyImage image={image} alt="Product" fill={false} />

// Fill mode
<ShopifyImage image={image} alt="Product" fill={true} />

// Custom sizes
<ShopifyImage image={image} alt="Product" fill={true} sizes="50vw" />

// Override options
<ShopifyImage image={image} alt="Product" fill={false} options={{ ratio: 16 / 9, crop: 'top' }} />
```

## API

### `useNextShopifyImage(image, options?)`

Returns `ImageProps` (from `next/image`) to spread onto the Next.js `<Image>` component.

#### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| `image` | `ShopifyImage` | Image object from the Shopify Storefront API |
| `options` | `UseNextShopifyImageOptions` | Optional configuration (see below) |

#### `ShopifyImage`

Matches the `Image` type from the Shopify Storefront API:

```ts
interface ShopifyImage {
  url: string;
  width?: number | null;
  height?: number | null;
  altText: string;
}
```

#### Options

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `crop` | `'top' \| 'center' \| 'bottom' \| 'left' \| 'right'` | — | Crop position for the image |
| `padColor` | `string` | — | Hex color for padding (without `#`) |
| `sizes` | `string` | `'100vw'` | The `sizes` attribute for responsive srcset generation |
| `ratio` | `number` | — | Aspect ratio (width/height). Height is calculated as `width / ratio` |
| `fill` | `boolean` | — | When `true`, returns `fill: true` instead of `width`/`height` |

### `buildShopifyImageUrl(url, params)`

Utility function for building Shopify CDN URLs outside of React components.

```ts
import { buildShopifyImageUrl } from 'next-shopify-image';

const url = buildShopifyImageUrl(
  'https://cdn.shopify.com/s/files/1/xxx/image.jpg',
  { width: 600, height: 750, crop: 'center' }
);
// => 'https://cdn.shopify.com/s/files/1/xxx/image.jpg?width=600&height=750&crop=center'
```

## Next.js Config

Add Shopify's CDN domain to your `next.config.js`:

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['cdn.shopify.com'],
  },
};

module.exports = nextConfig;
```

## How It Works

Shopify's CDN supports image transformations via URL query parameters:

- `width` — Resize to a given width
- `height` — Resize to a given height
- `crop` — Crop position: `top`, `center`, `bottom`, `left`, `right`
- `pad_color` — Hex color for padding
- `format` — Shopify auto-detects WebP/AVIF support via `Accept` headers

This library generates a Next.js `loader` function that constructs these URLs, letting Shopify handle all image processing instead of the Next.js image optimizer.
