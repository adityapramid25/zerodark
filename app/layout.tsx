import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'ZeroDark Mobile: Pemindai Eco Dua Atmosfer',
  description:
    'Aplikasi web mobile Claymorphism interaktif untuk pemindaian ekologis dua atmosfer (Smog Kualitas Udara Siang Hari & Polusi Cahaya Malam Hari / Skala Bortle) dengan peta panas Leaflet interaktif dan simulasi kebijakan koridor gelap.',
  keywords: ['ZeroDark', 'Claymorphism', 'AQI', 'Bortle Scale', 'Light Pollution', 'Eco-Scanner', 'Next.js 14'],
  authors: [{ name: 'ZeroDark Engineering' }],
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#0B0F19',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="dark">
      <body className="bg-[#070A11] min-h-screen text-slate-100 antialiased selection:bg-[#DCFD8B] selection:text-[#0B0F19]">
        {children}
      </body>
    </html>
  );
}
