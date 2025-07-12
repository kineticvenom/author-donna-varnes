import {person} from './documents/person'
import {page} from './documents/page'
import {devotional} from './documents/devotionals'
import { blog } from './documents/blog'
import {callToAction} from './objects/callToAction'
import {infoSection} from './objects/infoSection'
import {settings} from './singletons/settings'
import {link} from './objects/link'
import {blockContent} from './objects/blockContent'
import { book } from './documents/book'
import { navigationSettings } from './singletons/navigationSettings'

// // Export an array of all the schema types.  This is used in the Sanity Studio configuration. https://www.sanity.io/docs/schema-types

export const schemaTypes = [
  // Singletons
  settings,
  navigationSettings,
  // Documents
  page,
  devotional,
  blog,
  person,
  book,
  // Objects
  blockContent,
  infoSection,
  callToAction,
  link,
]
export default schemaTypes;

