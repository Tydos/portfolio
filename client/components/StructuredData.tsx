import type { StructuredDataPage } from "../lib/structuredData";
import { personJsonLd } from "../lib/structuredData";

interface StructuredDataProps {
  /** Which page variant of Person schema to emit. */
  page: StructuredDataPage;
}

/**
 * Embeds Schema.org Person JSON-LD for crawlers and rich results.
 *
 * @param props.page - Home or photography structured data variant.
 */
export default function StructuredData({ page }: StructuredDataProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: personJsonLd(page) }}
    />
  );
}
