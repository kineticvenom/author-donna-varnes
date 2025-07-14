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
  console.log("Settings query result:", result);
  const settings = result.data as SettingsQueryResult;
  console.log("Settings:", settings);

  const logoSource = settings.logo; // SanityImageSource | undefined
  console.log("Logo source:", logoSource);

  const logoUrl = logoSource && logoSource.asset?.url
    ? urlForImage(logoSource).auto("format").width(300).height(80).url()
    : null;

  console.log("Logo URL:", logoUrl);

  return (
    <>
      <div className="text-center py-20">
        {logoUrl ? (
          <Image
            src={logoUrl}
            alt={logoSource?.alt || "Logo"}
            width={300}
            height={80}
            className="object-contain h-20 sm:h-24 md:h-28 lg:h-32"
          />
        ) : (
          <Image
            src={logoFallback}
            alt="Logo"
            width={300}
            height={80}
            className="object-contain h-20 sm:h-24 md:h-28 lg:h-32"
          />
        )}
      </div>
      <Suspense fallback={<div>Loading books...</div>}>
        <AllBooks />
      </Suspense>
      <Suspense fallback={<div>Loading posts...</div>}>
        <AllPosts />
      </Suspense>
    </>
  );
}