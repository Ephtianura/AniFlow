"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoCloseSharp } from "react-icons/io5";
import Link from "next/link";
import { LuBuilding2, LuLibraryBig, LuSettings } from "react-icons/lu";
import { MdSpeakerNotes } from "react-icons/md";
import { LiaToolsSolid } from "react-icons/lia";
import { FaMasksTheater } from "react-icons/fa6";
import { RiMovie2AiLine } from "react-icons/ri";
import { TbHomeStats } from "react-icons/tb";

export default function MobileAdminSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const onClose = () => setIsOpen(prev => !prev)
  return (
    <>
      <button
        className="xl:hidden slider-opener"
        onClick={() => setIsOpen(prev => !prev)}
      >
        <LiaToolsSolid className="w-5 h-5" />
        Меню
      </button>

      {/* Mobile */}
      <div className="w-full h-full select-none">
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
                <div className="h-full w-full bg-bg-dark border-l-3 border-primary flex flex-col text-[#dee2e6]">
                  <div className="flex items-center justify-center relative p-4 h-8">
                    <button className="absolute right-1 top-0.5 text-xl p-2 active:scale-95 transition" onClick={onClose}>
                      <IoCloseSharp className="w-8 h-8" />
                    </button>
                  </div>
                  <div className="p-4 mt-2">
                    <h5 className="text-[1.5rem] font-medium mb-2">
                      Меню
                    </h5>
                    <hr className="text-hr-clr opacity-30 my-1" />
                    <div className="flex flex-col gap-1 text-[1.25rem]">
                      <Link href="/admin/dashboard" className="slider-btn" onClick={onClose}>
                        <TbHomeStats className="w-5 h-5" />
                        <p>Головна</p>
                      </Link>
                      <Link href="/admin/anime/create" className="slider-btn" onClick={onClose}>
                        <RiMovie2AiLine className="w-5 h-5" />
                        <p>Управління аніме</p>
                      </Link>
                      <Link href="/admin/studios/create" className="slider-btn" onClick={onClose}>
                        <LuBuilding2 className="w-5 h-5" />
                        <p>Управління студіями</p>
                      </Link>
                      <Link href="/admin/genres/create" className="slider-btn" onClick={onClose}>
                        <FaMasksTheater className="w-5 h-5" />
                        <p>Управління жанрами</p>
                      </Link>
                    </div>
                  </div>

                </div>

              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
