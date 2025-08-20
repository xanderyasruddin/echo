import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { DM_Serif_Text } from "next/font/google";

import "./globals.css";
import { ClerkProvider } from '@clerk/nextjs';
// import { ThemeProvider } from "@/components/theme-provider";
import Navbar from "@/components/Navbar";
import { Toaster } from "react-hot-toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const dmSerifText = DM_Serif_Text({
  variable: "--font-dm-serif-text",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Echo Application",
  description: "QMUL Final Project",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${geistSans.variable} ${geistMono.variable} ${dmSerifText.variable} antialiased`}>     
            <div className="min-h-screen">
              <Navbar />
              <main className="py-8 pt-[95px] bg-gradient-to-r from-gray-600 to-black">
                <div className="max-w-7xl mx-auto px-4">
                  {children}
                </div>      
              </main>
            </div>
            <Toaster />
          
        </body>
      </html>
    </ClerkProvider>
  );
}
