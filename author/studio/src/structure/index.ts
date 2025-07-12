import {CogIcon} from '@sanity/icons'
import type {StructureBuilder, StructureResolver} from 'sanity/structure'
import pluralize from 'pluralize-esm'

/**
 * Structure builder is useful whenever you want to control how documents are grouped and
 * listed in the studio or for adding additional in-studio previews or content to documents.
 * Learn more: https://www.sanity.io/docs/structure-builder-introduction
 */

const DISABLED_TYPES = ['settings','navigationSettings', 'assist.instruction.context']

export const structure: StructureResolver = (S: StructureBuilder) =>
  S.list()
    .title('Website Content')
    .items([
      S.documentTypeListItem('page').title('Pages'),
      S.documentTypeListItem('devotional').title('Devotionals'),
      S.documentTypeListItem('blog').title('Blog Posts'),
      S.documentTypeListItem('person').title('People'),   
      S.documentTypeListItem('book').title('Books'),
      ...S.documentTypeListItems()
        .filter((listItem: any) => 
          !DISABLED_TYPES.includes(listItem.getId()) &&
          !['blog', 'devotional','book','page','person'].includes(listItem.getId()))
        .map((listItem) => 
           listItem.title(pluralize(listItem.getTitle() as string))
    ),

      // Site Settings Singleton
      S.listItem()
        .title('Site Settings')
        .child(S.document().schemaType('settings').documentId('siteSettings'))
        .icon(CogIcon),

      // Navigation Settings Singleton
      S.listItem()
        .title('Navigation')
        .child(S.document().schemaType('navigationSettings').documentId('navigationSettings')),
    ])
