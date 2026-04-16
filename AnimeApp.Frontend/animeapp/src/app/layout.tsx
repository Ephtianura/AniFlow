import type { Metadata } from "next";

import "./globals.css";

import Navbar from '@/components/Navbar/Navbar';
import Footer from '@/components/Footer';
import { AuthProvider } from "@/context/AuthContext";

export const metadata: Metadata = {
  title: "AniFlow",
  description: "Дивитися аніме онлайн",
  viewport: 'width=device-width, initial-scale=1',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {

  return (
    <html lang="uk">
      <body className="antialiased transition-colors bg-bg-light h-screen flex flex-col">
        <AuthProvider>
          {/* Navbar / Header */}
          <Navbar />
          {/* Page Content */}
          <main className="flex-1 px-3 w-full max-w-7xl mx-auto">
            {children}
          </main>
          {/* Footer */}
          <Footer />
        </AuthProvider>
      </body>
    </html >
  );
}
