import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { AuthProvider } from '@/app/providers';
import { PushNotificationAd } from '@/components/ads/PushNotificationAd';
import '@/app/globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  title: 'HydPropertiesHub | Verified Hyderabad Properties',
  description: 'HydPropertiesHub is a premium property platform for verified Hyderabad homes and trusted agent-led services.',
  openGraph: {
    title: 'HydPropertiesHub',
    description: 'Verified Hyderabad properties by trusted local agents.',
    url: 'https://hydpropertieshub.com',
    siteName: 'HydPropertiesHub',
    images: [
      {
        url: 'https://res.cloudinary.com/demo/image/upload/v1690000000/og-image.jpg',
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
    <html lang="en" className={`${inter.variable} scroll-smooth`}>
      <body className="min-h-screen bg-zinc-50 text-zinc-950 antialiased">
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
