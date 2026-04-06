"use client";
import Link from 'next/link';

export default function Footer() {

    return (
        <footer className="bg-bg-dark shadow-[0_0_15px_rgba(0,0,0,0.2)] bottom-0 z-50 border-t-3 border-primary mt-6">
            <div className="flex flex-col  max-w-7xl mx-auto px-4 text-gray-text text-md
            min-w-[1340px] max-w-[1340px]">

                {/* Ряд 1 - Авторіські права */}
                <div className="py-2">
                    <p>
                        У разі порушення авторських прав або інших повідомлень — звертайтесь на пошту{" "}
                        <a
                            href="mailto:info@aniflow.org"
                            className="text-primary hover:underline"
                        >
                            info@aniflow.org
                        </a>
                    </p>
                </div>


                {/* Ряд 2 - Посилання */}
                <div className="flex justify-between py-2">

                    <div className='flex gap-8'>
                        <div >
                            <Link href="/" className="hover:text-white transition-colors duration-200">
                                Угода
                            </Link>
                        </div>
                        <div >
                            <Link href="/" className="hover:text-white transition-colors duration-200">
                                Конфіденційність
                            </Link>
                        </div>
                        <div >
                            <Link href="/" className="hover:text-white transition-colors duration-200">
                                Для правовласників
                            </Link>
                        </div>
                    </div>

                    <div>
                        &copy; AniFlow 2024-{new Date().getFullYear()}
                    </div>
                </div>

            </div>
        </footer>
    );
}
