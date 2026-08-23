import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'ZeroDark Mobile: Dual-Atmosphere Eco-Scanner',
  description:
    'Playful, tactile 3D Claymorphism mobile web app for dual-atmospheric eco-scanning (Daytime AQI Smog & Nighttime Light Pollution / Bortle Scale) with interactive Leaflet heatmap and dark corridor policy simulation.',
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
    <html lang="en" className="dark">
      <body className="bg-[#070A11] min-h-screen text-slate-100 antialiased selection:bg-[#DCFD8B] selection:text-[#0B0F19]">
        {children}
      </body>
    </html>
  );
}
