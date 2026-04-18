import type { Metadata } from "next";

import "./globals.css";
import "react-toastify/dist/ReactToastify.css";

import Navbar from '@/components/Navbar/Navbar';
import Footer from '@/components/Footer';
import { AuthProvider } from "@/context/AuthContext";
import { ToastContainer } from "react-toastify";
import { ThemeProvider } from 'next-themes'

export const metadata: Metadata = {
  title: "AniFlow",
  description: "Дивитися аніме онлайн",
};
export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: 'black'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {

  return (
    <html lang="uk" suppressHydrationWarning>
      <body className="antialiased transition-colors bg-bg-light h-screen flex flex-col">
        <AuthProvider>
          {/* Navbar / Header */}
          <Navbar />
          {/* Page Content */}
          <main className="flex-1 px-3 w-full max-w-7xl mx-auto">
            {children}
            {/* <ThemeProvider attribute="class"></ThemeProvider> */}
            <ToastContainer
              limit={1}
              position="top-right"
              autoClose={3000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
            />
          </main>
          {/* Footer */}
          <Footer />
        </AuthProvider>
      </body>
    </html >
  );
}
