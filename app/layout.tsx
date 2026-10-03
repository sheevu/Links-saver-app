import type { Metadata, Viewport } from 'next';
import './globals.css';

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#FAFAFA' },
    { media: '(prefers-color-scheme: dark)', color: '#09090B' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: 'LinkSaver — Ultra Modern Notion Vibrant Bookmark Manager',
  description:
    'Ultra-modern, high-contrast bookmark manager with real-time Google Sheets synchronization, keyboard navigation, and instant categorization. Powered by Sudarshan AI and Vyapai Blogs.',
  keywords: [
    'LinkSaver',
    'Bookmark Manager',
    'Google Sheets Sync',
    'Sudarshan AI',
    'Vyapai Blogs',
    'Productivity Tools',
    'Resource Organizer',
    'Next.js Link Saver',
  ],
  authors: [
    { name: 'Sudarshan AI', url: 'https://sudarshan-ai.com/' },
    { name: 'Vyapai Blogs', url: 'https://blogs.vyapai.in/' },
  ],
  creator: 'LinkSaver Team',
  publisher: 'Sudarshan AI',
  metadataBase: new URL('https://sudarshan-ai.com/'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'LinkSaver — Ultra Modern Notion Vibrant Bookmark Manager',
    description:
      'Ultra-modern bookmark manager with Google Sheets sync. Curate links, search instantly, and scale your personal knowledge base. Supported by Sudarshan AI & Vyapai Blogs.',
    url: 'https://sudarshan-ai.com/',
    siteName: 'LinkSaver',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LinkSaver — Ultra Modern Notion Vibrant Bookmark Manager',
    description:
      'Curate and sync links to Google Sheets in real-time. Supported by Sudarshan AI & Vyapai Blogs.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://sudarshan-ai.com" />
        <link rel="dns-prefetch" href="https://blogs.vyapai.in" />
      </head>
      <body className="antialiased min-h-screen">{children}</body>
    </html>
  );
}
