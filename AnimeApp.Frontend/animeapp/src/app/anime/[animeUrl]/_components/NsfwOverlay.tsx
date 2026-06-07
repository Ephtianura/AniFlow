import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

type NsfwOverlayProps = {
    onClose: () => void;
};

export default function NsfwOverlay({ onClose }: NsfwOverlayProps) {
    const router = useRouter();

    useEffect(() => {
        const originalHtmlOverflow = document.documentElement.style.overflow;
        const originalBodyOverflow = document.body.style.overflow;
        document.documentElement.style.overflow = "hidden";
        document.body.style.overflow = "hidden";
        return () => {
            document.documentElement.style.overflow = originalHtmlOverflow;
            document.body.style.overflow = originalBodyOverflow;
        };
    }, []);

    return (
        <div className="fixed inset-0 top-15.5 bottom-16 md:bottom-0 z-40 flex flex-col items-center justify-center px-6 bg-black/80 backdrop-blur-md">
            <div className="text-center text-white flex flex-col mb-8 ">
                <h2 className="text-[2.5rem] font-bold">
                    Вам вже є 18 років?
                </h2>
                <p className="text-[1.25rem] text-[#D9D7E0] mb-2">
                    Доступ до цієї сторінки дозволено лише повнолітнім користувачам
                </p>
                <div className="text-[#868E96]">
                    <p>
                        <span>Ця сторінка містить </span>
                        <Link href={`https://en.wikipedia.org/wiki/Not_safe_for_work`}
                            className="primary-link">
                            <span>NSFW</span>
                        </Link>
                        <span> матеріал з віковим обмеженням</span> <span className="text-primary">18+</span>
                    </p>
                    <p>
                        Під час перегляду вмісту ви підтверджуєте, що вам є <span className="text-primary">18 років</span>
                    </p>
                </div>


            </div>
            <div className="flex gap-6 justify-center h-9.5">
                <button
                    onClick={() => router.back()}
                    className="btn-white w-38 text-primary-black font-medium"
                >
                    Назад
                </button>
                <button
                    onClick={onClose}
                    className="btn-purple w-38 font-medium"
                >
                    Мені є 18 років
                </button>


            </div>
        </div>
    );
}