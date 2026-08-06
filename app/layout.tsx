import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import {
  absoluteUrl,
  authorName,
  defaultDescription,
  siteName,
  siteUrl,
  socialImage,
} from "@/lib/seo";
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
  metadataBase: new URL(siteUrl),
  title: {
    default: siteName,
    template: `%s | ${authorName}`,
  },
  description: defaultDescription,
  applicationName: siteName,
  authors: [{ name: authorName, url: siteUrl }],
  creator: authorName,
  publisher: authorName,
  keywords: [
    "Alberto Campagnolo",
    "web developer",
    "software developer",
    "React developer",
    "Next.js developer",
    "TypeScript developer",
    "AI integration",
    "Treviso developer",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName,
    title: siteName,
    description: defaultDescription,
    images: [
      {
        url: absoluteUrl(socialImage),
        alt: siteName,
      },
    ],
  },
  twitter: {
    card: "summary",
    title: siteName,
    description: defaultDescription,
    images: [absoluteUrl(socialImage)],
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/k.ico" },
      { url: "/k.svg", type: "image/svg+xml" },
    ],
    shortcut: "/favicon.ico",
    apple: "/k.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]`}
      >
        {children}
      </body>
    </html>
  );
}
