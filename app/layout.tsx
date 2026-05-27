import type { Metadata } from 'next';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { AuthProvider } from '@/app/providers';
import { PushNotificationAd } from '@/components/ads/PushNotificationAd';
import '@/app/globals.css';

export const metadata: Metadata = {
  title: 'HydPropertiesHub | Verified Hyderabad Properties',
  description: 'HydPropertiesHub is a premium property platform for verified Hyderabad homes and trusted agent-led services.',
  icons: {
    icon: '/icon.svg',
    apple: '/apple-icon.svg',
  },
  openGraph: {
    title: 'HydPropertiesHub',
    description: 'Verified Hyderabad properties by trusted local agents.',
    url: 'https://www.hydpropertieshub.com',
    siteName: 'HydPropertiesHub',
    images: [
      {
        url: 'https://www.hydpropertieshub.com/logo.svg',
        width: 1200,
        height: 630,
        alt: 'HydPropertiesHub',
      },
    ],
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="min-h-screen bg-zinc-50 text-zinc-950 antialiased font-sans">
        <AuthProvider>
          <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.12),_transparent_45%)]">
            <PushNotificationAd />
            <Navbar />
            <main>{children}</main>
            <Footer />
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
