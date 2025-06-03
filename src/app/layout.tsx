import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Kardeş Bitkiler Rehberi | Uyumlu Bitki Eşleştirme",
  description: "Bahçenizde hangi bitkilerin birlikte yetişeceğini öğrenin. Kardeş bitkiler rehberi ile permakültür ve organik bahçecilik için en iyi eşleştirmeleri keşfedin.",
  keywords: "kardeş bitkiler, companion planting, uyumlu bitkiler, bahçecilik, permakültür",
  metadataBase: new URL('https://kardesbitkiler.vercel.app'),
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: '/',
  },
  verification: {
    google: 'google-site-verification-code', // Google Search Console doğrulama kodu
  },
  authors: [{ name: 'Site Sahibinin Adı' }],
  creator: 'Site Sahibinin Adı',
  publisher: 'Site Sahibinin Adı',
  openGraph: {
    title: "Kardeş Bitkiler Rehberi | Uyumlu Bitki Eşleştirme",
    description: "Bahçenizde hangi bitkilerin birlikte yetişeceğini öğrenin. Kardeş bitkiler rehberi ile en iyi eşleştirmeleri keşfedin.",
    type: "website",
    locale: "tr_TR",
    url: '/',
    siteName: 'Kardeş Bitkiler',
    images: [
      {
        url: '/og-image.jpg', // Open Graph resmi ekleyin
        width: 1200,
        height: 630,
        alt: 'Kardeş Bitkiler Rehberi',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Kardeş Bitkiler Rehberi",
    description: "Bahçenizde hangi bitkilerin birlikte yetişeceğini öğrenin.",
    images: ['/og-image.jpg'],
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
