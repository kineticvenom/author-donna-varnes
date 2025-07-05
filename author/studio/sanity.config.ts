// studio/sanity.config.ts
import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './src/schemaTypes'
import { structure } from './src/structure'
import { unsplashImageAsset } from 'sanity-plugin-asset-source-unsplash'
import {
  presentationTool,
  defineDocuments,
  defineLocations,
  type DocumentLocation,
} from 'sanity/presentation'
import { assist } from '@sanity/assist'

// Env-vars (fall back to localhost in dev)
const projectId               = process.env.SANITY_STUDIO_PROJECT_ID    || '7llz646c'
const dataset                 = process.env.SANITY_STUDIO_DATASET       || 'production'
const SANITY_STUDIO_PREVIEW_URL = process.env.SANITY_STUDIO_PREVIEW_URL || 'http://localhost:3000'

// “Home” location for the Presentation tool
const homeLocation = {
  title: 'Home',
  href:  '/',
} satisfies DocumentLocation

// Map your docs to frontend routes
function resolveHref(type?: string, slug?: string): string|undefined {
  switch (type) {
    case 'post': return slug ? `/posts/${slug}` : undefined
    case 'page': return slug ? `/${slug}`       : undefined
    default:
      console.warn('Unknown doc type:', type)
      return undefined
  }
}

export default defineConfig({
  name:    'default',
  title:   "Donna's Studio",
  projectId,
  dataset,

  plugins: [
    presentationTool({
      // ← new in v3.40.0 :contentReference[oaicite:0]{index=0}
      previewUrl: {
        initial: SANITY_STUDIO_PREVIEW_URL,
        previewMode: {
          enable:  '/api/draft-mode/enable',
          disable: '/api/draft-mode/disable',
        },
      },
      // ← new in v3.85.1 :contentReference[oaicite:1]{index=1}
      allowOrigins: [SANITY_STUDIO_PREVIEW_URL, 'http://localhost:3000'],

      resolve: {
        mainDocuments: defineDocuments([
          {
            route: '/:slug',
            filter: `_type == "page" && slug.current == $slug || _id == $slug`,
          },
          {
            route: '/posts/:slug',
            filter: `_type == "post" && slug.current == $slug || _id == $slug`,
          },
        ]),
        locations: {
          settings: defineLocations({
            locations: [homeLocation],
            message:   'This document is used on all pages',
            tone:      'positive',
          }),
          page: defineLocations({
            select: { name: 'name', slug: 'slug.current' },
            resolve: (doc) => ({
              locations: [
                {
                  title: doc?.name || 'Untitled',
                  href:  resolveHref('page', doc?.slug)!,
                },
              ],
            }),
          }),
          post: defineLocations({
            select: { title: 'title', slug: 'slug.current' },
            resolve: (doc) => ({
              locations: [
                {
                  title: doc?.title || 'Untitled',
                  href:  resolveHref('post', doc?.slug)!,
                },
                {
                  title: 'Home',
                  href:  '/',
                } satisfies DocumentLocation,
              ],
            }),
          }),
        },
      },
    }),

    structureTool({ structure }),
    unsplashImageAsset(),
    assist(),
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
  },
})
