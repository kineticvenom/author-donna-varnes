import { stegaClean } from "@sanity/client/stega";
import Image from "next/image";
import { urlForImage } from "@/sanity/lib/utils";

interface CoverImageProps {
  image: any;
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
  const ref = source?.asset?._ref as string | undefined;
  const originalUrl = source?.asset?.url as string | undefined;

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
  console.log('CoverImage Debug:', { source, hasValidImage, imageUrl });

  if (!imageUrl || !hasValidImage) {
    return (
      <div
        className="bg-slate-100 text-center text-gray-400 text-sm italic flex items-center justify-center w-[300px] h-[450px] mx-auto"
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