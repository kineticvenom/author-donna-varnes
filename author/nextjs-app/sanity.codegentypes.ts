import type {
  SanityReference,
  SanityKeyedReference,
  SanityAsset,
  SanityImage,
  SanityFile,
  SanityGeoPoint,
  SanityBlock,
  SanityDocument,
  SanityImageCrop,
  SanityImageHotspot,
  SanityKeyed,
  SanityImageAsset,
  SanityImageMetadata,
  SanityImageDimensions,
  SanityImagePalette,
  SanityImagePaletteSwatch,
} from "sanity-codegen";

export type {
  SanityReference,
  SanityKeyedReference,
  SanityAsset,
  SanityImage,
  SanityFile,
  SanityGeoPoint,
  SanityBlock,
  SanityDocument,
  SanityImageCrop,
  SanityImageHotspot,
  SanityKeyed,
  SanityImageAsset,
  SanityImageMetadata,
  SanityImageDimensions,
  SanityImagePalette,
  SanityImagePaletteSwatch,
};

/**
 * Settings
 *
 *
 */
export interface Settings extends SanityDocument {
  _type: "settings";

  /**
   * Title — `string`
   *
   * This field is the title of your site
   */
  title?: string;

  /**
   * Description — `array`
   *
   * Used both for the <meta> description tag for SEO, and the site subheader.
   */
  description?: Array<SanityKeyed<SanityBlock>>;

  /**
   * Background Image — `image`
   *
   *
   */
  backgroundImage?: {
    _type: "image";
    asset: SanityReference<SanityImageAsset>;
    crop?: SanityImageCrop;
    hotspot?: SanityImageHotspot;
  };

  /**
   * Logo — `image`
   *
   *
   */
  logo?: {
    _type: "image";
    asset: SanityReference<SanityImageAsset>;
    crop?: SanityImageCrop;
    hotspot?: SanityImageHotspot;
  };

  /**
   * Open Graph Image — `image`
   *
   * Displayed on social cards and search engine results.
   */
  ogImage?: {
    _type: "image";
    asset: SanityReference<SanityImageAsset>;
    crop?: SanityImageCrop;
    hotspot?: SanityImageHotspot;

    /**
     * Alternative text — `string`
     *
     * Important for accessibility and SEO.
     */
    alt?: string;

    /**
     * metadataBase — `url`
     *
     * [object Object]
     */
    metadataBase?: string;
  };
}

/**
 * Page
 *
 *
 */
export interface Page extends SanityDocument {
  _type: "page";

  /**
   * Name — `string`
   *
   *
   */
  name?: string;

  /**
   * Slug — `slug`
   *
   *
   */
  slug?: { _type: "slug"; current: string };

  /**
   * Heading — `string`
   *
   *
   */
  heading?: string;

  /**
   * Subheading — `string`
   *
   *
   */
  subheading?: string;

  /**
   * Page builder — `array`
   *
   *
   */
  pageBuilder?: Array<SanityKeyed<CallToAction> | SanityKeyed<InfoSection>>;
}

/**
 * Post
 *
 *
 */
export interface Post extends SanityDocument {
  _type: "post";

  /**
   * Title — `string`
   *
   *
   */
  title?: string;

  /**
   * Slug — `slug`
   *
   * A slug is required for the post to show up in the preview
   */
  slug?: { _type: "slug"; current: string };

  /**
   * Content — `blockContent`
   *
   *
   */
  content?: BlockContent;

  /**
   * Excerpt — `text`
   *
   *
   */
  excerpt?: string;

  /**
   * Cover Image — `image`
   *
   *
   */
  coverImage?: {
    _type: "image";
    asset: SanityReference<SanityImageAsset>;
    crop?: SanityImageCrop;
    hotspot?: SanityImageHotspot;

    /**
     * Alternative text — `string`
     *
     * Important for SEO and accessibility.
     */
    alt?: string;
  };

  /**
   * Date — `datetime`
   *
   *
   */
  date?: string;

  /**
   * Author — `reference`
   *
   *
   */
  author?: SanityReference<Person>;
}

/**
 * Person
 *
 *
 */
export interface Person extends SanityDocument {
  _type: "person";

  /**
   * First Name — `string`
   *
   *
   */
  firstName?: string;

  /**
   * Last Name — `string`
   *
   *
   */
  lastName?: string;

  /**
   * Picture — `image`
   *
   *
   */
  picture?: {
    _type: "image";
    asset: SanityReference<SanityImageAsset>;
    crop?: SanityImageCrop;
    hotspot?: SanityImageHotspot;

    /**
     * Alternative text — `string`
     *
     * Important for SEO and accessibility.
     */
    alt?: string;
  };
}

/**
 * Book
 *
 *
 */
export interface Book extends SanityDocument {
  _type: "book";

  /**
   * Title — `string`
   *
   *
   */
  title?: string;

  /**
   * Slug — `slug`
   *
   * A slug is required for the post to show up in the preview
   */
  slug?: { _type: "slug"; current: string };

  /**
   * Description — `text`
   *
   *
   */
  description?: string;

  /**
   * Excerpt — `text`
   *
   *
   */
  excerpt?: string;

  /**
   * Cover Image — `image`
   *
   *
   */
  coverImage?: {
    _type: "image";
    asset: SanityReference<SanityImageAsset>;
    crop?: SanityImageCrop;
    hotspot?: SanityImageHotspot;

    /**
     * Alternative text — `string`
     *
     * Important for SEO and accessibility.
     */
    alt?: string;
  };

  /**
   * Date — `datetime`
   *
   *
   */
  date?: string;

  /**
   * Publication Date — `date`
   *
   * When the book was published
   */
  publicationDate?: string;

  /**
   * ISBN — `string`
   *
   * International Standard Book Number
   */
  isbn?: string;

  /**
   * Amazon Link — `url`
   *
   * Link to the book on Amazon
   */
  amazonLink?: string;

  /**
   * Author — `reference`
   *
   *
   */
  author?: SanityReference<Person>;
}

export type BlockContent = Array<SanityKeyed<SanityBlock>>;

export type InfoSection = {
  _type: "infoSection";
  /**
   * Heading — `string`
   *
   *
   */
  heading?: string;

  /**
   * Subheading — `string`
   *
   *
   */
  subheading?: string;

  /**
   * Content — `blockContent`
   *
   *
   */
  content?: BlockContent;
};

export type CallToAction = {
  _type: "callToAction";
  /**
   * Heading — `string`
   *
   *
   */
  heading?: string;

  /**
   * Text — `text`
   *
   *
   */
  text?: string;

  /**
   * Button text — `string`
   *
   *
   */
  buttonText?: string;

  /**
   * Button link — `link`
   *
   *
   */
  link?: Link;
};

export type Link = {
  _type: "link";
  /**
   * Link Type — `string`
   *
   *
   */
  linkType?: "href" | "page" | "post";

  /**
   * URL — `url`
   *
   *
   */
  href?: string;

  /**
   * Page — `reference`
   *
   *
   */
  page?: SanityReference<Page>;

  /**
   * Post — `reference`
   *
   *
   */
  post?: SanityReference<Post>;

  /**
   * Open in new tab — `boolean`
   *
   *
   */
  openInNewTab?: boolean;
};

export type Documents = Settings | Page | Post | Person | Book;
