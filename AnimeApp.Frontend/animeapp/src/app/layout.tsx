import type { Metadata } from "next";

import "./globals.css";

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { AuthProvider } from "@/context/AuthContext";

export const metadata: Metadata = {
  title: "AnimeApp",
  description: "Дивитися аніме онлайн",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  
  return (
    <html lang="uk">
      <body className="antialiased min-h-screen transition-colors">
        <div className="bg-bg-light min-h-screen flex flex-col">
          <AuthProvider>

            <Navbar />
            <main className="flex-1 min-w-[1340px] max-w-[1340px] justify-center mx-auto px-4">
              {children}
            </main>
            <Footer />
          </AuthProvider>

        </div>
      </body>
    </html >
  );
}
