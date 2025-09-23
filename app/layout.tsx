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
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
            <h1 style={{ margin: 0, fontSize: 20 }}>Grand Strand Pickleball</h1>
            <nav style={{ display: 'flex', gap: 12, fontSize: 14 }}>
              <a href="https://github.com/RTSII/GS-Pickleball/blob/main/docs/specify.md" target="_blank" rel="noreferrer">Product Spec</a>
              <span style={{ color: '#9ca3af' }}>|</span>
              <a href="https://github.com/RTSII/GS-Pickleball/blob/main/.specify/memory/constitution.md" target="_blank" rel="noreferrer">Constitution</a>
              <span style={{ color: '#9ca3af' }}>|</span>
              <a href="https://github.com/RTSII/GS-Pickleball/tree/main/docs/agents" target="_blank" rel="noreferrer">Agent SOPs</a>
            </nav>
          </div>
        </header>
        <main style={{ padding: '16px 24px' }}>{children}</main>
      </body>
    </html>
  );
}
