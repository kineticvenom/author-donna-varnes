"use client";

import Link from "next/link";
import { useOptimistic } from "next-sanity/hooks";
import type { Page } from "@/sanity.types";
import { SanityDocument } from "next-sanity";

import BlockRenderer from "@/app/components/BlockRenderer";
import { dataAttr } from "@/sanity/lib/utils";
import { studioUrl } from "@/sanity/lib/api";

type PageBuilderSection = {
  _key: string;
  _type: string;
};

type PageBuilderPageProps = {
  page: Page;
};

function renderSections(
  pageBuilderSections: PageBuilderSection[],
  page: Page,
) {
  return (
    <div
      data-sanity={dataAttr({
        id: page._id,
        type: page._type,
        path: `pageBuilder`,
      }).toString()}
    >
      {pageBuilderSections.map((block, index) => (
        <BlockRenderer
          key={block._key}
          index={index}
          block={block}
          pageId={page._id}
          pageType={page._type}
        />
      ))}
    </div>
  );
}

function renderEmptyState(page: Page) {
  return (
    <div className="container">
      <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl">
        This page has no content!
      </h1>
      <p className="mt-2 text-base text-gray-500">
        Open the page in Sanity Studio to add content.
      </p>
      <div className="mt-10 flex">
        <Link
          className="rounded-full flex gap-2 mr-6 items-center bg-black hover:bg-red-500 focus:bg-cyan-500 py-3 px-6 text-white transition-colors duration-200"
          href={`${studioUrl}/structure/intent/edit/template=page;type=page;path=pageBuilder;id=${page._id}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          Add content to this page
        </Link>
      </div>
    </div>
  );
}

export default function PageBuilder({ page }: PageBuilderPageProps) {
  const pageBuilderSections = useOptimistic<
    PageBuilderSection[] | undefined,
    SanityDocument<Page>
  >(page?.pageBuilder || [], (currentSections, action) => {
    if (action.id !== page._id) return currentSections;

    if (action.document.pageBuilder) {
      return action.document.pageBuilder.map(
        (section) =>
          currentSections?.find((s) => s._key === section?._key) || section,
      );
    }

    return currentSections;
  });

  if (!page || !pageBuilderSections?.length) {
    return renderEmptyState(page);
  }

  return renderSections(pageBuilderSections, page);
}
