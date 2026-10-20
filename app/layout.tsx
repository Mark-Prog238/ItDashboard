import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from 'next-themes';
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
  title: "Butan Plin Dashboard",
  description: "Made by Mark@butanplinIT",
  icons: {
    icon: [
      {url: "/favicon.png", sizes: "32x32", type: "image/png"}
    ],
  }
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
      <html
          lang="en"
          className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
          suppressHydrationWarning /* <-- ADD THIS PROP HERE */
      >
      <body className="min-h-full flex flex-col">
      <ThemeProvider attribute="class" defaultTheme="system">
        {children}
      </ThemeProvider>
      </body>
      </html>
  );
}
