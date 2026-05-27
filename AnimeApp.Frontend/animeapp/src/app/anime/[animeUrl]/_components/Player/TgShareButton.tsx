"use client";

import clsx from "clsx";
import { useEffect, useState } from "react";
import { FaTelegramPlane } from "react-icons/fa";
import { TelegramShareButton } from "react-share";

export default function TgShareButton() {
    const [url, setUrl] = useState("");
    useEffect(() => {
        setUrl(window.location.href);
    }, []);

    return (
        <div className="py-3 border-y border-[#3f3e3f] flex gap-2 items-center">
            <span className="text-player-text text-lg">Поділитися з друзями:</span>
            <TelegramShareButton url={url} >
                <div className={clsx(
                    "bg-[#468bcc] flex items-center gap-2 px-2 py-0.5 rounded-xs",
                    "hover:bg-[#509fe8]",
                    "active:scale-95 transition-all duration-200"
                )}>
                    <FaTelegramPlane className="w-5 h-5" />
                    <span>Telegram</span>
                </div>
            </TelegramShareButton>
        </div>
    )
}

{/* <div className="flex gap-2 items-center text-lg">
                    <span className="text-player-text ">Дата виходу:</span>
                    <span className="text-white">{"10 січня 2025"}</span>
                </div> */}
