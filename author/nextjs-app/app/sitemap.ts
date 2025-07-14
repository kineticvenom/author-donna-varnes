import type { MetadataRoute } from "next";
import { headers } from "next/headers";
import { sanityFetch } from "@/sanity/lib/live";
import { sitemapData } from "@/sanity/lib/queries";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Fetch all items from Sanity
  const result = await sanityFetch({ query: sitemapData });
  const items = result?.data ?? [];

  // Build origin (protocol + host)
  const headersList = await headers();
  const host = headersList.get("host")!;
  const proto = headersList.get("x-forwarded-proto") ?? "https";
  const origin = `${proto}://${host}`;

  // Start with the root URL
  const sitemap: MetadataRoute.Sitemap = [
    {
      url: origin,
      lastModified: new Date(),
      priority: 1,
      changeFrequency: "monthly",
    },
  ];

  // Map each Sanity document to a sitemap entry
  for (const p of items) {
    let url: string;
    let priority: number;
    let changeFrequency: MetadataRoute.Sitemap[0]["changeFrequency"];

    switch (p._type) {
      case "page":
        priority = 0.8;
        changeFrequency = "monthly";
        url = `${origin}/${p.slug}`;
        break;
      case "book":
        priority = 0.7;
        changeFrequency = "weekly";
        url = `${origin}/books/${p.slug}`;
        break;
      case "blog":
        priority = 0.6;
        changeFrequency = "daily";
        url = `${origin}/blog/${p.slug}`;
        break;
      case "devotional":
        priority = 0.5;
        changeFrequency = "yearly";
        url = `${origin}/devotionals/${p.slug}`;
        break;
      default:
        // Skip any types you’re not explicitly handling
        continue;
    }

    sitemap.push({
      url,
      lastModified: p._updatedAt ? new Date(p._updatedAt) : new Date(),
      priority,
      changeFrequency,
    });
  }

  return sitemap;
}
