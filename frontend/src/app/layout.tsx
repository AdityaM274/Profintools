import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { AuthProvider } from '@/hooks/useAuth';
import AdUnit from '@/components/AdUnit';
import { AD_SLOTS, AD_CONFIG } from '@/config/ads';
import Script from 'next/script';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'ProFinTools - Professional Finance Tools',
  description: 'Professional-grade financial calculators and tools. SIP, Loan, Tax, and more. 100% Client-side privacy.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen flex flex-col bg-background text-foreground`}>
        <AuthProvider>
          {AD_CONFIG.enabled && AD_CONFIG.googlePublisherId && (
            <Script
              async
              src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${AD_CONFIG.googlePublisherId}`}
              crossOrigin="anonymous"
              strategy="afterInteractive"
            />
          )}

          <Navbar />
          <main className="flex-grow pt-24">
            {children}
          </main>

          <div className="container mx-auto px-4 mb-4">
            <AdUnit slot={AD_SLOTS.HOME_FOOTER} className="max-w-4xl mx-auto" />
          </div>

          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
