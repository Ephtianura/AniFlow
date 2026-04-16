"use client";
import Link from 'next/link';

export default function Footer() {

    return (
        <footer className="bg-bg-dark shadow-[0_0_15px_rgba(0,0,0,0.2)] bottom-0 z-50 border-t-3 border-primary mt-6 ">
            <div className="flex flex-col w-full max-w-7xl mx-auto px-4 text-gray-text text-sm sm:text-base">

                {/* Ряд 1 - Авторіські права */}
                <div className="py-2">
                    <p>
                        У разі порушення авторських прав або інших повідомлень – звертайтесь на пошту{" "}
                        <a
                            href="mailto:info@aniflow.xyz"
                            className="text-primary hover:underline"
                        >
                            info@aniflow.xyz
                        </a>
                    </p>
                </div>


                {/* Ряд 2 - Посилання */}
                <div className="flex flex-col items-center  gap-4 sm:flex-row sm:justify-between py-2">

                    {/* Ссылки: на мобилках тоже в колонку, если их много, или в ряд с переносом */}
                    <div className='flex flex-col gap-2 xs:flex-row sm:gap-8'>
                        <Link href="/terms" className="hover:text-white transition-colors duration-200">
                            Угода
                        </Link>
                        <Link href="/privacy" className="hover:text-white transition-colors duration-200">
                            Конфіденційність
                        </Link>
                        <Link href="/for-right-holders" className="hover:text-white transition-colors duration-200">
                            Для правовласників
                        </Link>
                    </div>

                    {/* Копирайт */}
                    <div className="">
                        &copy; AniFlow 2024-{new Date().getFullYear()}
                    </div>
                </div>

            </div>
        </footer>
    );
}
