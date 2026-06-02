import type { Metadata } from "next";

//@ts-ignore
import "./globals.css";
//@ts-ignore
import "react-toastify/dist/ReactToastify.css";

import Navbar from '@/components/Navbar/Navbar';
import Footer from '@/components/Footer';
import { ToastContainer } from "react-toastify";
import { ThemeProvider } from 'next-themes'
import MobileFooter from "@/components/MobileFooter";
import GlobalOstPlayer from "./anime/[animeUrl]/_components/GlobalPlayer/GlobalOstPlayer";

export const metadata: Metadata = {
  title: "AniFlow",
  description: "Дивитися аніме онлайн українською мовою в високій якості",
};
export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: 'black'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {

  return (
    <html lang="uk" suppressHydrationWarning>
      <body
        className="antialiased transition-colors bg-bg-light min-h-screen flex flex-col text-primary-black "
        suppressHydrationWarning={true}
      >
        {/* Navbar */}
        <Navbar />

        {/* Page Content */}
        <main className="flex-1 px-3 mb-20 w-full max-w-7xl xl:max-w-[1600px] mt-21 mx-auto">
          {children}
          {/* <ThemeProvider attribute="class"></ThemeProvider> */}
          <ToastContainer
            className="select-none"
            limit={2}
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

          <GlobalOstPlayer/>
        </main>
        {/* Footer */}
        <Footer />
        <div className="mb-16 md:mb-0"/>
        <MobileFooter />
      </body>
    </html >
  );
}
