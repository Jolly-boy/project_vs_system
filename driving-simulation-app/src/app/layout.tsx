import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import { Sidebar } from "@/components/layout/sidebar";

// Load the Inter font for a clean, professional look
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AI Driver Safety Monitoring System",
  description: "Final-year IT project prototype for driver safety monitoring and incident recording.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased bg-background text-foreground`}>
        <div className="flex h-screen overflow-hidden">
          {/* 
            Suspense is required here because Sidebar uses usePathname(), 
            which is a dynamic client hook that blocks static prerendering in Next.js 15.
          */}
          <Suspense fallback={<div className="w-64 border-r bg-muted/40 h-screen" />}>
            <Sidebar />
          </Suspense>
          
          <main className="flex-1 overflow-y-auto p-6 md:p-8">
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}