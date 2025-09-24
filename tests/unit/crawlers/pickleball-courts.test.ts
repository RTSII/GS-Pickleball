import { describe, it, expect } from 'vitest';
import { parseVenueFromHtml } from '../../../scripts/crawlers/pickleball-courts';

// Mock HTML fixtures for unit tests
const visitMyrtleBeachHtml = `
<article class="content">
  <h3>Sample Venue</h3>
  <p>123 Main St, Myrtle Beach, SC 29577 (555) 123-4567</p>
  <ul class="hours">
    <li>Mon-Fri 9am-5pm</li>
    <li>Sat-Sun 10am-4pm</li>
  </ul>
  <a href="https://reserve.example.com">Reserve</a>
</article>
`;

const nmbHtml = `
<div class="content">
  <p>Sample Venue\n123 Main St\nHours: 9am-5pm\n(555) 123-4567\nhttps://reserve.example.com</p>
</div>
`;

const litchfieldHtml = `
<div class="venue">
  <h2>Sample Venue</h2>
  <div class="address">123 Main St, Litchfield, SC</div>
  <div class="phone">(555) 123-4567</div>
  <div class="email"><a href="mailto:info@example.com">info@example.com</a></div>
  <div class="hours">Mon-Fri 9am-5pm</div>
  <a href="https://reserve.example.com">Reserve</a>
</div>
`;

describe('Pickleball Courts Crawler Unit Tests', () => {
  it('should parse visitmyrtlebeach.com venue correctly', () => {
    const venue = parseVenueFromHtml(visitMyrtleBeachHtml);
    expect(venue.name).toBe('Sample Venue');
    expect(venue.address).toContain('123 Main St');
    expect(venue.phone).toBe('(555) 123-4567');
    expect(venue.hours).toEqual(['Mon-Fri 9am-5pm', 'Sat-Sun 10am-4pm']);
    expect(venue.reservationUrl).toBe('https://reserve.example.com');
  });

  it('should parse nmb.us venue correctly', () => {
    const venue = parseVenueFromHtml(nmbHtml);
    expect(venue.name).toBe('Sample Venue');
    expect(venue.address).toContain('123 Main St');
    expect(venue.phone).toBe('(555) 123-4567');
    expect(venue.hours).toBe('9am-5pm');
    expect(venue.reservationUrl).toBe('https://reserve.example.com');
  });

  it('should parse litchfieldpickle.com venue correctly', () => {
    const venue = parseVenueFromHtml(litchfieldHtml);
    expect(venue.name).toBe('Sample Venue');
    expect(venue.address).toContain('123 Main St');
    expect(venue.phone).toBe('(555) 123-4567');
    expect(venue.email).toBe('info@example.com');
    expect(venue.hours).toBe('Mon-Fri 9am-5pm');
    expect(venue.reservationUrl).toBe('https://reserve.example.com');
  });
});
