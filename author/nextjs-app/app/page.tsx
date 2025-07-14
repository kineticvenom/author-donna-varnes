// app/page.tsx
import { Suspense } from "react";
import Image from "next/image";
import logoFallback from "@/public/images/Logo.png";
import { sanityFetch } from "@/sanity/lib/live";
import { settingsQuery } from "@/sanity/lib/queries"; 
import { urlForImage } from "@/sanity/lib/utils";
import type { SettingsQueryResult } from "@/types/settings";
import { AllBooks } from "./components/Books";
import { AllPosts } from "@/app/components/Posts";

export default async function Page() {
  const result = await sanityFetch({
    query: settingsQuery,
    stega: false,
  });
  const settings = result.data as SettingsQueryResult;
  

  // 1. Extract the full Sanity image object
  const logoSource = settings.logo;   // SanityImageSource | undefined

  // 2. Build the URL only if we have a valid source
  const builder = logoSource ? urlForImage(logoSource) : undefined;  // ImageUrlBuilder | undefined
  const logoUrl = builder
    ? builder.auto("format").width(300).height(80).url()
    : null;

  // 3. Choose between the Sanity URL or the static import
  const src = logoUrl;

  return (
    <>
      <div className="text-center py-20">
        <Image
          src={src || logoFallback} // Fallback to local image if Sanity image is not available
          alt={logoSource?.alt || 'Logo'}    // use CMS alt or fallback
          width={300}                        // required for remote images :contentReference[oaicite:2]{index=2}
          height={80}
          className="object-contain h-20 sm:h-24 md:h-28 lg:h-32"
        />
      </div>

      <div className="border-t border-gray-100">
        <Suspense>{await AllBooks()}</Suspense>
      </div>
      <div className="border-t border-gray-100">
        <Suspense>{await AllPosts()}</Suspense>
      </div>
    </>
  );
}
