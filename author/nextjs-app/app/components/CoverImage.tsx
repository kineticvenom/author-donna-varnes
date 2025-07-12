import { stegaClean } from "@sanity/client/stega";
import { Image } from "next-sanity/image";
import { urlForImage } from "@/sanity/lib/utils";

interface CoverImageProps {
  image: any;
  priority?: boolean;
}

export default function CoverImage({ image: source, priority }: CoverImageProps) {
  const hasValidImage = source?.asset?._ref;
  const imageUrl = hasValidImage
    ? urlForImage(source)?.auto("format").url()
    : null;

  if (!imageUrl) {
    // Render a placeholder or nothing if image is invalid
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
        alt={stegaClean(source?.alt) || ""}
        width={1000}
        height={1500}
        sizes="(max-width: 768px) 100vw, 300px"
        priority={priority}
      />
    </div>
  );
}
