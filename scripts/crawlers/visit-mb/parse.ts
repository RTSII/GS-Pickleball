export type VenueRecord = {
  name: string;
  city: string;
};

// Minimal HTML parser for fixture-driven extraction.
// In real crawlers, use Playwright to fetch and then parse DOM.
export function parseVenue(html: string): VenueRecord {
  const nameMatch = html.match(/id="name"[^>]*>([^<]+)/i);
  const cityMatch = html.match(/id="city"[^>]*>([^<]+)/i);
  const name = nameMatch?.[1]?.trim() ?? "";
  const city = cityMatch?.[1]?.trim() ?? "";
  return { name, city };
}
