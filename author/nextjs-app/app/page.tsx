// app/page.tsx
import { Suspense } from "react";
import { sanityFetch } from "@/sanity/lib/live";
import { settingsQuery } from "@/sanity/lib/queries";
import { AllBooks, FeaturedBooks } from "./components/Books";
import { AllDevotionals, AllPosts } from "@/app/components/Posts";
import Hero from "./components/Hero";
import EmailSignup from "./components/EmailSignup";

export default async function Page() {
  const result = await sanityFetch({
    query: settingsQuery,
    stega: false,
  });


  return (
    <>
      <Hero />
      <div className="bg-white py-8">
        <Suspense>{await FeaturedBooks()}</Suspense>
      </div>
      <div className="bg-cream-100 py-8 border-l-4 border-sage-500">
        <Suspense>{await AllDevotionals()}</Suspense>
      </div>
      <div className="bg-white py-8 border-l-4 border-gold-300">
        <Suspense>{await AllPosts()}</Suspense>
      </div>
      <EmailSignup />
    </>
  );
}
