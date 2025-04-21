import { stegaClean } from "@sanity/client/stega";
import { Image } from "next-sanity/image";
import { urlForImage } from "@/sanity/lib/utils";

interface CoverImageProps {
  image: any;
  priority?: boolean;
}

export default function CoverImage({ image: source, priority }: CoverImageProps) {
  const imageUrl = urlForImage(source)?.auto("format").url() as string;

  return (
    <div className="w-[300px] mx-auto">
      <Image
        src={imageUrl}
        alt={stegaClean(source?.alt) || ""}
        width={1000}
        height={1500}
        sizes="(max-width: 768px) 100vw, 300px"
      />

    </div>
  );
}
