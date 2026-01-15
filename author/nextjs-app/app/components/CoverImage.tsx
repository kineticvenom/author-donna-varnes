import { stegaClean } from "@sanity/client/stega";
import Image from "next/image";
import { urlForImage } from "@/sanity/lib/utils";

// Matches the coverImage shape from GROQ query results
export interface SanityImage {
  asset?: {
    _id?: string;
    _ref?: string | null;
    url?: string | null;
  } | null;
  alt?: string | null;
}

interface CoverImageProps {
  image: SanityImage | null;
  alt?: string;
  className?: string;
  imgClassName?: string;
  width?: number;
  height?: number;
  sizes?: string;
  priority?: boolean;
  fallbackText?: string;
}

export default function CoverImage({ image: source, priority }: CoverImageProps) {
  // Extract the two possible sources of truth
  const ref = source?.asset?._ref;
  const originalUrl = source?.asset?.url;

 // Build or fallback
 let imageUrl: string | null = null;
  if (ref) {
    imageUrl = urlForImage(source)
      ?.auto("format")
      .width(300)
      .height(450)
      .url() || null;
  } else if (originalUrl) {
    imageUrl = originalUrl;
  }

  // Whether we have _any_ valid URL
  const hasValidImage = Boolean(imageUrl);

  if (!imageUrl || !hasValidImage) {
    return (
      <div
        className="bg-cream-100 text-center text-brown-400 text-sm italic flex items-center justify-center w-[300px] h-[450px] mx-auto"
        style={{ border: "1px solid #e5e7eb", borderRadius: "0.5rem" }}
      >
        No Image Available
      </div>
    );
  }

  return (
    <div className="w-[300px] mx-auto">
      <Image
        src={imageUrl}
        alt={stegaClean(source?.alt) || "Image"}
        width={300}
        height={450}
        sizes="(max-width: 768px) 100vw, 300px"
        priority={priority}
      />
    </div>
  );
}