// "use client";

// import { useState, useEffect } from "react";
// import { IoClose, IoChevronBack, IoChevronForward, IoSearch } from "react-icons/io5";

// export default function ScreenshotsCarousel({ images }: { images: string[] }) {
//     const [open, setOpen] = useState(false);
//     const [currentIndex, setCurrentIndex] = useState(0);
//     const [closing, setClosing] = useState(false); 

//     const VISIBLE_IMAGES = images.slice(0, 4);

//     useEffect(() => {
//         if (!open) return;

//         const handleKey = (e: KeyboardEvent) => {
//             if (e.key === "ArrowLeft") prev();
//             if (e.key === "ArrowRight") next();
//             if (e.key === "Escape") handleClose();
//         };

//         window.addEventListener("keydown", handleKey);
//         return () => window.removeEventListener("keydown", handleKey);
//     }, [open, currentIndex]);

//     const openViewer = (realIndex: number) => {
//         setCurrentIndex(realIndex);
//         setOpen(true);
//         setClosing(false);
//     };

//     const next = () => setCurrentIndex((prev) => (prev + 1) % images.length);
//     const prev = () => setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);

//     const handleClose = () => {
//         setClosing(true);
//         setTimeout(() => setOpen(false), 300); // 300ms = 
//     };

//     const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
//         if ((e.target as HTMLDivElement).id === "backdrop") {
//             handleClose();
//         }
//     };

//     return (
//         <>
//             {/* ---- БЛОК С КАРТИНКАМИ ---- */}
//             <div className="mt-3">
//                 <h4 className="text-primary-black text-2xl font-medium mb-3">Кадри</h4>
//                 <div className="flex gap-3">
//                     {images.slice(0, Math.min(images.length, 3)).map((src, i) => (
//                         <div key={i} className="relative group cursor-pointer" onClick={() => openViewer(i)}>
//                             <img src={src} className="h-[175px] rounded object-cover" alt="" />
//                             <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
//                                 <IoSearch className="text-white w-10 h-10" />
//                             </div>
//                         </div>
//                     ))}

//                     {images.length >= 4 && (
//                         <>
//                             {images.length === 4 ? (
//                                 <div className="relative group cursor-pointer" onClick={() => openViewer(3)}>
//                                     <img src={images[3]} className="h-[175px] rounded object-cover" alt="" />
//                                     <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
//                                         <IoSearch className="text-white w-10 h-10" />
//                                     </div>
//                                 </div>
//                             ) : (
//                                 <div onClick={() => openViewer(3)} className="relative h-[175px] rounded cursor-pointer overflow-hidden">
//                                     <img src={images[3]} className="w-full h-full object-cover brightness-50" alt="" />
//                                     <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white text-3xl font-medium">
//                                         +{images.length - 3}
//                                     </div>
//                                 </div>
//                             )}
//                         </>
//                     )}
//                 </div>
//             </div>

//             {/* ---- ПОЛНОЕКРАННА МОДАЛКА ---- */}
//             {open && (
//                 <div
//                     id="backdrop"
//                     onClick={handleBackdropClick}
//                     className={`
//                         fixed inset-0 bg-black/80 z-9999
//                         flex flex-col items-center justify-center
//                         transition-opacity duration-300
//                         ${closing ? "opacity-0" : "opacity-100"}
//                     `}
//                 >
//                     <div className="absolute top-0 w-full h-13 bg-black/40 backdrop-blur flex items-center justify-between px-6 text-white text-lg">
//                         <span>{currentIndex + 1} / {images.length}</span>
//                         <button onClick={handleClose}>
//                             <IoClose className="w-8 h-8" />
//                         </button>
//                     </div>

//                     <img src={images[currentIndex]} className="max-h-[80vh] max-w-[90vw] object-contain rounded" alt="" />

//                     <button onClick={prev} className="absolute left-6 top-1/2 -translate-y-1/2 p-3 bg-black/40 rounded-full">
//                         <IoChevronBack className="text-white w-8 h-8" />
//                     </button>
//                     <button onClick={next} className="absolute right-6 top-1/2 -translate-y-1/2 p-3 bg-black/40 rounded-full">
//                         <IoChevronForward className="text-white w-8 h-8" />
//                     </button>
//                 </div>
//             )}
//         </>
//     );
// }
