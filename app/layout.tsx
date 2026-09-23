import type { Metadata } from "next";
import {
  Geist,
  Geist_Mono,
  Inter,
  Outfit,
  IBM_Plex_Mono,
} from "next/font/google";
import clsx from "clsx";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  weight: ["400", "500", "600"],
  subsets: ["latin"],
});
export const metadata: Metadata = {
  title: "Genuslab academy",
  description:
    "Genuslab Academy is an interactive learning and quiz platform where you can test your knowledge, build practical digital skills, compete in quizzes, earn rewards, and grow through structured technology education. Join today and start your journey from learning to earning.",
  icons: {
    icon: "/images/logo.png",
    shortcut: "/images/logo.png",
    apple: "/images/logo.png",
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
        className={clsx(
          geistSans.variable,
          geistMono.variable,
          inter.variable,
          outfit.variable,
          plexMono.variable,
          `antialiased`,
        )}
      >
        {children}
      </body>
    </html>
  );
}
