import createImageUrlBuilder from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";
import { Link } from "@/sanity.types";
import { dataset, projectId, studioUrl } from "@/sanity/lib/api";
import {
  createDataAttribute,
  CreateDataAttributeProps,
} from "next-sanity";

const imageBuilder = createImageUrlBuilder({
  projectId: projectId || "",
  dataset: dataset || "",
});

/**
 * Safely generate an image URL from a Sanity image source.
 */
export const urlForImage = (source: unknown) => {
  if (
    typeof source !== "object" ||
    source === null ||
    !("asset" in source) ||
    !(source as any).asset?._ref
  ) {
    return undefined;
  }

  return imageBuilder.image(source as SanityImageSource).auto("format").fit("max");
};

/**
 * Generate Open Graph image metadata from a Sanity image
 */
export function resolveOpenGraphImage(
  image: unknown,
  width = 1200,
  height = 627
): { url: string; alt: string; width: number; height: number } | undefined {
  const url = urlForImage(image)?.width(width).height(height).fit("crop").url();
  if (!url) return undefined;

  return {
    url,
    alt: (image as any)?.alt ?? "",
    width,
    height,
  };
}

/**
 * Safely resolve a URL from a Link field
 */
export function linkResolver(link: Link | undefined): string | null {
  if (!link) return null;

  if (!link.linkType && link.href) {
    link.linkType = "href";
  }

  switch (link.linkType) {
    case "href":
      return link.href || null;

    case "page":
      return extractSlugPath(link.page, "");
    case "blog":
      return extractSlugPath(link.blog, "blog");
    case "devotional":
      return extractSlugPath(link.devotional, "devotional");
    case "book":
      return extractSlugPath(link.book, "books");
    default:
      return null;
  }
}

/**
 * Utility to extract slug.current safely from a reference or populated object
 */
function extractSlugPath(value: unknown, prefix: string): string | null {
  if (
    typeof value === "object" &&
    value !== null &&
    "slug" in value &&
    typeof (value as any).slug?.current === "string"
  ) {
    const slug = (value as any).slug.current;
    return prefix ? `/${prefix}/${slug}` : `/${slug}`;
  }
  return null;
}

/**
 * Used to generate the `data-sanity` attribute for live editing/debugging
 */
type DataAttributeConfig = CreateDataAttributeProps &
  Required<Pick<CreateDataAttributeProps, "id" | "type" | "path">>;

export function dataAttr(config: DataAttributeConfig) {
  return createDataAttribute({
    projectId,
    dataset,
    baseUrl: studioUrl,
  }).combine(config);
}
