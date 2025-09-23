import { describe, it, expect } from "vitest";
import { renderEmailTemplate } from "../../../scripts/verifier/email-template";

describe("renderEmailTemplate", () => {
  it("fills subject and body with provided variables", () => {
    const { subject, body } = renderEmailTemplate({ name: "LBTS Courts", hours: "Mon-Fri 9-17", book_url: "https://example.com" });
    expect(subject).toMatch(/LBTS Courts/);
    expect(body).toMatch(/Mon-Fri 9-17/);
    expect(body).toMatch(/https:\/\/example.com/);
  });
});
