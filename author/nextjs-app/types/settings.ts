export type SettingsQueryResult = {
  title?: string | null;
  description?: any; // If using PortableText, you can type it more precisely
  ogImage?: {
    asset?: { url: string | null };
    metadataBase?: string;
  } | null;
  backgroundImage?: {
    asset?: { url: string | null };
  } | null;
  logo?: {
    asset?: { url: string | null };
  } | null;
};
