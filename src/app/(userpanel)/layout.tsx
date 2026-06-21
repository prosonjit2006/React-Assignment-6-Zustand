import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Header from "@/layout/user-panel/Header";
import Footer from "@/layout/user-panel/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Blog Hub",
  description: "Read and explore amazing blogs",
};

export default function UserLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="min-h-screen bg-background text-foreground">
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
