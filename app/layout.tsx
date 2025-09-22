import type { ReactNode } from "react";

export const metadata = {
  title: "Grand Strand Pickleball",
  description: "Find pickleball courts, coaches, programs, and shops across the Grand Strand.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body style={{ fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif', margin: 0 }}>
        <header style={{ padding: '16px 24px', borderBottom: '1px solid #e5e7eb' }}>
          <h1 style={{ margin: 0, fontSize: 20 }}>Grand Strand Pickleball</h1>
        </header>
        <main style={{ padding: '16px 24px' }}>{children}</main>
      </body>
    </html>
  );
}
