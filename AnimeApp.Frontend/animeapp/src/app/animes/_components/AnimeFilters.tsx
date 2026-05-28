"use client";

import { useState } from "react";
import AnimeFilter from "./AnimeFilter";
import { motion, AnimatePresence } from "framer-motion";
import { IoCloseSharp } from "react-icons/io5";
import { VscSettings } from "react-icons/vsc";

export default function AnimeFilters() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Desktop */}
      <div className="hidden lg:block w-85">
        <AnimeFilter />
      </div>

      <button
        className="lg:hidden slider-opener"
        onClick={() => setIsOpen(prev => !prev)}
      >
        <VscSettings className="w-5 h-5" />
        Фільтр
      </button>

      {/* Mobile */}
      <div className="lg:hidden h-full">
        <AnimatePresence>
          {isOpen && (
            <div className="fixed inset-0 w-full h-full z-50 pointer-events-none">

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute right-0 top-0 bg-primary-black/50 w-full h-full z-10 pointer-events-auto"
                onClick={() => setIsOpen(false)}
              />

              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{
                  duration: 0.25,
                  ease: "easeOut",
                }}
                className="absolute right-0 h-full w-full max-w-100 lg:w-85 z-20 pointer-events-auto"
              >
                <div className="h-full w-full bg-white border-l-3 border-primary ">
                  <button className="absolute right-1 top-0.5 text-xl p-2 active:scale-95 transition" onClick={() => setIsOpen(prev => !prev)}>
                    <IoCloseSharp className="w-8 h-8 text-white" />
                  </button>
                  <AnimeFilter />
                </div>

              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>

    </>
  );
}