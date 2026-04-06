import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'ViewTracker | Cross-Platform Social Intelligence',
  description: 'Monitor your TikTok, Instagram, and YouTube views in one unified premium dashboard.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  );
}
