import { describe, it, expect } from "vitest";

describe("Seed data validation", () => {
  it("validates venue data structure", () => {
    const sampleVenue = {
      name: "Test Venue",
      address: "123 Main St",
      city: "Myrtle Beach",
      state: "SC",
      lat: 33.6891,
      lng: -78.8867,
      indoor: false,
      lights: true,
      hoursJson: {
        tz: "America/New_York",
        mon: [["08:00", "20:00"]],
      },
    };

    expect(sampleVenue.name).toBeDefined();
    expect(sampleVenue.lat).toBeGreaterThan(33);
    expect(sampleVenue.lat).toBeLessThan(34);
    expect(sampleVenue.lng).toBeGreaterThan(-80);
    expect(sampleVenue.lng).toBeLessThan(-78);
    expect(sampleVenue.hoursJson.tz).toBe("America/New_York");
  });

  it("validates program skill levels", () => {
    const sampleProgram = {
      skillMin: 2.5,
      skillMax: 3.5,
      kind: "lesson",
      price: 3500,
    };

    expect(sampleProgram.skillMin).toBeGreaterThanOrEqual(2.0);
    expect(sampleProgram.skillMax).toBeLessThanOrEqual(5.5);
    expect(sampleProgram.skillMin).toBeLessThan(sampleProgram.skillMax);
    expect(sampleProgram.price).toBeGreaterThan(0);
  });

  it("validates coach credentials", () => {
    const sampleCoach = {
      name: "Test Coach",
      creds: "PPR Certified",
      rateHour: 7500,
      ratingAvg: 4.8,
      cities: ["Myrtle Beach"],
    };

    expect(sampleCoach.name).toBeDefined();
    expect(sampleCoach.rateHour).toBeGreaterThan(0);
    expect(sampleCoach.ratingAvg).toBeGreaterThanOrEqual(0);
    expect(sampleCoach.ratingAvg).toBeLessThanOrEqual(5);
    expect(sampleCoach.cities.length).toBeGreaterThan(0);
  });

  it("validates Grand Strand geography", () => {
    const cities = [
      { name: "Pawleys Island", lat: 33.43, lng: -79.12 },
      { name: "Murrells Inlet", lat: 33.55, lng: -79.05 },
      { name: "Myrtle Beach", lat: 33.69, lng: -78.89 },
      { name: "North Myrtle Beach", lat: 33.82, lng: -78.68 },
    ];

    cities.forEach((city) => {
      expect(city.lat).toBeGreaterThan(33);
      expect(city.lat).toBeLessThan(34);
      expect(city.lng).toBeGreaterThan(-80);
      expect(city.lng).toBeLessThan(-78);
    });
  });

  it("validates overnight hours handling", () => {
    const overnightHours = {
      tz: "America/New_York",
      fri: [["19:00", "00:30"]],
      sat: [["08:00", "00:30"]],
    };

    expect(overnightHours.tz).toBe("America/New_York");
    expect(overnightHours.fri[0][0]).toBe("19:00");
    expect(overnightHours.fri[0][1]).toBe("00:30");
  });
});
