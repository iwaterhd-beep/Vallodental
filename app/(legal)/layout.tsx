import type { Metadata } from "next";

export const metadata: Metadata = {
  robots: { index: true, follow: true }
};

export default function LegalLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400&family=DM+Sans:wght@300;400;500&display=swap"
        rel="stylesheet"
      />
      <link rel="stylesheet" href="/legal.css" />
      {children}
    </>
  );
}
