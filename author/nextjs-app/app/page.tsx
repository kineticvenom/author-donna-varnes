import { Suspense } from "react";
import Link from "next/link";
import { sanityFetch } from "@/sanity/lib/live";
import { settingsQuery } from "@/sanity/lib/queries";

import { AllPosts } from "@/app/components/Posts";
import { AllBooks } from "./components/Books";
import { SettingsQueryResult } from "@/types/settings";

export default async function Page() {
  const result = await sanityFetch({
    query: settingsQuery,
    stega: false,
  });
  const settings = result.data as SettingsQueryResult;
  const logo = settings?.logo?.asset?.url || "/images/Logo.png";
  return (
    <>
      <div className="bg-gradient-to-r from-red-200 from-0% via-white via-40%  relative">
        <div className="bg-gradient-to-b from-white w-full h-40 absolute top-0"></div>
        <div className="bg-gradient-to-t from-white w-full h-40 absolute bottom-0"></div>
        <div className="container relative">
          <div className="mx-auto max-w-2xl py-20 lg:max-w-4xl lg:px-12 text-center">
            <div className="flex flex-col gap-4 items-center">
              <div className=" text-md leading-6 prose uppercase">
                
              </div>
              <img 
                src={logo}
                alt="Logo"
                className="h-20 sm:h-24 md:h-28 lg:h-32 object-contain"
                />
            </div>
            <div className="mt-6 space-y-6 prose sm:prose-lg md:prose-xl lg:prose-2xl text-gray-700">
              <p>&quot;Whats this text&quot;
              </p>
            </div>
            <div className="flex items-center flex-col gap-4"><p>&quot;where&quot;</p>
            </div>
          </div>
        </div>
      </div>
      <div className="border-t border-gray-10 bg-color-grey">
        <div className="container">
          <aside className="py-12 sm:py-20">
            <Suspense>{await AllBooks()}</Suspense>
          </aside>
        </div>
      </div>
      <div className="border-t border-gray-10">
        <div className="container">
          <aside className="py-12 sm:py-20">
            <Suspense>{await AllPosts()}</Suspense>
          </aside>
        </div>
      </div>
    </>
  );
}
