import { chromium, Browser, Page } from 'playwright';
import fetch from 'node-fetch';
import { PrismaClient } from '@prisma/client';
import RobotsParser from 'robots-parser';

const prisma = new PrismaClient();

// Configuration
const USER_AGENT = process.env.CRAWLER_USER_AGENT || 'GS-Pickleball Crawler/1.0 (+contact@example.com)';
const WRITE_DB = process.env.CRAWLER_WRITE_DB === 'true';

// Utility: delay with jitter
function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Utility: retry wrapper with exponential backoff
async function retry<T>(fn: () => Promise<T>, retries = 3, delayMs = 1000): Promise<T> {
  let attempt = 0;
  while (true) {
    try {
      return await fn();
    } catch (err) {
      if (++attempt > retries) throw err;
      const backoff = delayMs * Math.pow(2, attempt) + Math.random() * 100;
      console.warn(`Retry ${attempt} after error: ${err}. Backing off for ${backoff}ms`);
      await delay(backoff);
    }
  }
}

// Geocode address using Nominatim
async function geocodeAddress(address: string): Promise<{ lat: number; lng: number } | null> {
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`;
  const res = await fetch(url, {
    headers: { 'User-Agent': USER_AGENT },
  });
  if (!res.ok) return null;
  const data = await res.json();
  if (data.length === 0) return null;
  return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
}

// Normalize and save venue to Postgres via Prisma (gated by env)
async function saveVenue(venue: any) {
  if (!WRITE_DB) return; // Constitution: crawler should not write to DB by default
  // Upsert by name and address
  const existing = await prisma.venue.findFirst({
    where: { name: venue.name, address: venue.address },
  });
  if (existing) {
    await prisma.venue.update({
      where: { id: existing.id },
      data: venue,
    });
  } else {
    await prisma.venue.create({ data: venue });
  }
}

// Fetch and parse robots.txt for a given base URL
async function fetchRobotsTxt(baseUrl: string) {
  try {
    const url = new URL('/robots.txt', baseUrl).toString();
    const res = await fetch(url, {
      headers: { 'User-Agent': USER_AGENT },
    });
    if (!res.ok) return null;
    const text = await res.text();
    return RobotsParser(url, text);
  } catch (err) {
    console.warn(`Failed to fetch robots.txt from ${baseUrl}: ${err}`);
    return null;
  }
}

// Check if crawling is allowed and get crawl delay
async function checkCrawlAllowedAndDelay(robots: any, url: string) {
  if (!robots) return { allowed: true, delay: 1000 };
  const allowed = robots.isAllowed(url, USER_AGENT);
  const delay = robots.getCrawlDelay(USER_AGENT) || 1000;
  return { allowed, delay };
}

// Crawl a page with respect to robots.txt and crawl delay
async function crawlWithRobots(page: Page, url: string, robots: any) {
  const { allowed, delay: crawlDelay } = await checkCrawlAllowedAndDelay(robots, url);
  if (!allowed) {
    throw new Error(`Crawling disallowed by robots.txt for ${url}`);
  }
  await delay(crawlDelay);
  await page.goto(url, { waitUntil: 'domcontentloaded' });
}

// Enhanced extraction for visitmyrtlebeach.com
async function crawlVisitMyrtleBeach(page: Page, robots: any) {
  const url = 'https://www.visitmyrtlebeach.com/article/top-pickleball-courts-in-myrtle-beach';
  await crawlWithRobots(page, url, robots);
  const venues = await page.$$eval('article .content h3', (els: Element[]) =>
    els.map((el: Element) => {
      const name = el.textContent?.trim() ?? '';
      const addressEl = el.nextElementSibling?.querySelector('p');
      const address = addressEl?.textContent?.trim() ?? '';
      const phoneMatch = address.match(/\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);
      const phone = phoneMatch ? phoneMatch[0] : undefined;
      const hoursEl = el.nextElementSibling?.querySelector('ul.hours');
      const hours = hoursEl ? Array.from(hoursEl.querySelectorAll('li')).map(li => li.textContent?.trim() ?? '') : [];
      const indoor = address.toLowerCase().includes('indoor');
      const outdoor = address.toLowerCase().includes('outdoor');
      const lights = address.toLowerCase().includes('light');
      const feesMatch = address.match(/\$\d+/g);
      const fees = feesMatch ? feesMatch.map(f => parseFloat(f.replace('$', ''))) : [];
      const reservationUrlEl = (el.nextElementSibling as Element | null)?.querySelector('a[href*="reserve"]');
      const reservationUrl = reservationUrlEl?.getAttribute('href') ?? undefined;
      return { name, address, phone, hours, indoor, outdoor, lights, fees, reservationUrl };
    })
  );
  return venues;
}

// Extract data from nmb.us
async function crawlNMB(page: Page, robots: any) {
  const url = 'https://www.nmb.us/500/Pickleball';
  await crawlWithRobots(page, url, robots);
  const venues = await page.$$eval('.content p', (els: Element[]) =>
    els.map((el: Element) => {
      const text = el.textContent ?? '';
      const nameMatch = text.match(/^\s*([\w\s]+)\s*\n/);
      const name = nameMatch ? nameMatch[1].trim() : '';
      const addressMatch = text.match(/\d+\s+\w+\s+\w+/);
      const address = addressMatch ? addressMatch[0] : '';
      const phoneMatch = text.match(/\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);
      const phone = phoneMatch ? phoneMatch[0] : undefined;
      return { name, address, phone };
    })
  );
  return venues;
}

// Extract data from litchfieldpickle.com
async function crawlLitchfieldPickle(page: Page, robots: any) {
  const url = 'https://www.litchfieldpickle.com/';
  await crawlWithRobots(page, url, robots);
  const venues = await page.$$eval('.venue', (els: Element[]) =>
    els.map((el: Element) => {
      const name = el.querySelector('h2')?.textContent?.trim() ?? '';
      const address = el.querySelector('.address')?.textContent?.trim() ?? '';
      const phone = el.querySelector('.phone')?.textContent?.trim() ?? undefined;
      const email = el.querySelector('.email a')?.getAttribute('href')?.replace('mailto:', '') ?? undefined;
      return { name, address, phone, email };
    })
  );
  return venues;
}

export async function runCrawler() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  try {
    // Fetch robots.txt for each site
    const visitMyrtleBeachRobots = await fetchRobotsTxt('https://www.visitmyrtlebeach.com');
    const nmbRobots = await fetchRobotsTxt('https://www.nmb.us');
    const litchfieldRobots = await fetchRobotsTxt('https://www.litchfieldpickle.com');

    // Crawl each site with retries
    const visitMyrtleBeachVenues = await retry(() => crawlVisitMyrtleBeach(page, visitMyrtleBeachRobots));
    const nmbVenues = await retry(() => crawlNMB(page, nmbRobots));
    const litchfieldVenues = await retry(() => crawlLitchfieldPickle(page, litchfieldRobots));

    // Combine and geocode
    const allVenues = [...visitMyrtleBeachVenues, ...nmbVenues, ...litchfieldVenues];

    for (const venue of allVenues) {
      if (venue.address) {
        const geo = await retry(() => geocodeAddress(venue.address));
        if (geo) {
          venue.lat = geo.lat;
          venue.lng = geo.lng;
        }
      }
      await saveVenue(venue);
    }
  } finally {
    await browser.close();
  }
}

// Run crawler if this script is executed directly
if (require.main === module) {
  runCrawler()
    .then(() => {
      console.log('Crawler finished successfully');
      process.exit(0);
    })
    .catch((err) => {
      console.error('Crawler failed:', err);
      process.exit(1);
    });
}

// Exported pure parser to satisfy unit tests and enable TDD
export type ParsedVenue = {
  name: string;
  address?: string;
  phone?: string;
  email?: string;
  hours?: string | string[];
  reservationUrl?: string;
};

export function parseVenueFromHtml(html: string): ParsedVenue {
  const text = html || '';
  const phoneRegex = /\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/;
  const urlRegex = /(https?:\/\/[^\s"'>]+)/;

  // visitmyrtlebeach-like structure
  if (text.includes('<article') && text.includes('<h3')) {
    const nameMatch = text.match(/<h3>([^<]+)<\/h3>/i);
    const name = nameMatch ? nameMatch[1].trim() : '';
    const pMatch = text.match(/<p>([\s\S]*?)<\/p>/i);
    const pText = pMatch ? pMatch[1].replace(/\n/g, ' ').trim() : '';
    const address = pText;
    const phoneMatch = pText.match(phoneRegex);
    const phone = phoneMatch ? phoneMatch[0] : undefined;
    const hours: string[] = Array.from(text.matchAll(/<ul class="hours">[\s\S]*?<li>([^<]+)<\/li>[\s\S]*?<li>([^<]+)<\/li>[\s\S]*?<\/ul>/gi)).flatMap(m => m.slice(1));
    const linkMatch = text.match(/<a[^>]+href="([^"]+)"[^>]*>/i);
    const reservationUrl = linkMatch ? linkMatch[1] : undefined;
    return { name, address, phone, hours: hours.length ? hours : undefined, reservationUrl };
  }

  // nmb.us-like structure
  if (text.includes('<div class="content"') && text.includes('<p>')) {
    const pMatch = text.match(/<p>([\s\S]*?)<\/p>/i);
    const pText = pMatch ? pMatch[1] : '';
    const lines = pText.split(/\n/).map(s => s.trim()).filter(Boolean);
    const name = lines[0] || '';
    const address = lines.find(l => /\d+\s+\w+/.test(l));
    const hoursLine = pText.match(/Hours:\s*([^\n<]+)/i)?.[1]?.trim();
    const phone = pText.match(phoneRegex)?.[0];
    const reservationUrl = pText.match(urlRegex)?.[0];
    return { name, address, phone, hours: hoursLine, reservationUrl };
  }

  // litchfieldpickle-like structure
  if (text.includes('<div class="venue"')) {
    const name = text.match(/<h2>([^<]+)<\/h2>/i)?.[1]?.trim() || '';
    const address = text.match(/<div class="address">([\s\S]*?)<\/div>/i)?.[1]?.trim();
    const phone = text.match(/<div class="phone">([\s\S]*?)<\/div>/i)?.[1]?.trim();
    const email = text.match(/mailto:([^"'>]+)/i)?.[1]?.trim();
    const hours = text.match(/<div class="hours">([\s\S]*?)<\/div>/i)?.[1]?.trim();
    const reservationUrl = text.match(/<a[^>]+href="([^"]+)"[^>]*>/i)?.[1];
    return { name, address, phone, email, hours, reservationUrl };
  }

  // Fallback
  return { name: '' };
}
