export type ChangeSet = {
  entity: "Venue"|"Program"|"Coach";
  id?: string;
  changes: Record<string, { before: unknown; after: unknown }>;
  approvedBy?: string;
  timestamp?: string;
};

export function renderEmailTemplate(vars: { name: string; hours: string; book_url?: string; contact_name?: string }): { subject: string; body: string } {
  const subject = `Quick verification for ${vars.name}`;
  const lines = [
    `Hi ${vars.contact_name ?? "there"},`,
    `We list ${vars.name} for local pickleball players. Could you verify:`,
    `- Hours (local): ${vars.hours}`,
    `- Booking link: ${vars.book_url ?? "(none)"}`,
    `Reply with any corrections. Thank you!`,
  ];
  return { subject, body: lines.join("\n") };
}
