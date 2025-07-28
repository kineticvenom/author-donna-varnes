// app/page.tsx
import { Suspense } from "react";
import { sanityFetch } from "@/sanity/lib/live";
import { settingsQuery } from "@/sanity/lib/queries"; 
import { AllBooks, FeaturedBooks } from "./components/Books";
import { AllDevotionals, AllPosts } from "@/app/components/Posts";

export default async function Page() {
  const result = await sanityFetch({
    query: settingsQuery,
    stega: false,
  });


  return (
    <>

      <div className="border-t border-gray-100">
        <Suspense>{await FeaturedBooks()}</Suspense>
      </div>
      <div className="border-t border-gray-100">
        <Suspense>{await AllDevotionals()}</Suspense>
      </div>
      <div className="border-t border-gray-100">
        <Suspense>{await AllPosts()}</Suspense>
      </div>
    </>
  );
}
