import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import './globals.css';

export const metadata: Metadata = {
  title: 'ZeroDark: Dual-Atmosphere Scanner',
  description:
    'Mobile-first Tactile Claymorphism Eco-Scanner powered by Google Teachable Machine Image Classification for Dual-Atmosphere analysis (Daytime Air Smog & Nighttime Light Pollution / Bortle Scale).',
  keywords: [
    'ZeroDark',
    'Dual-Atmosphere Scanner',
    'Teachable Machine',
    'Claymorphism',
    'Air Quality AQI',
    'Bortle Scale',
    'Light Pollution',
    'Eco-Scanner',
  ],
  authors: [{ name: 'ZeroDark Engineering' }],
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#0B0F17',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        {/* Load TensorFlow.js and Teachable Machine via High-Speed CDN */}
        <Script
          src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@latest/dist/tf.min.js"
          strategy="beforeInteractive"
        />
        <Script
          src="https://cdn.jsdelivr.net/npm/@teachablemachine/image@latest/dist/teachablemachine-image.min.js"
          strategy="beforeInteractive"
        />
      </head>
      <body className="bg-[#0B0F17] min-h-screen text-slate-100 antialiased selection:bg-emerald-500 selection:text-slate-950">
        {children}
      </body>
    </html>
  );
}
