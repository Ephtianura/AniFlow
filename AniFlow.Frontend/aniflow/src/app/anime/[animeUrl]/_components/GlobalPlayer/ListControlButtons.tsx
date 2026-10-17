"use client"

import { usePlayerStore } from "@/stores/usePlayerStore";
import { RiCollapseDiagonalLine } from "react-icons/ri";
import Switch from "react-switch";


export default function ListControlButtons() {
    const {
        isMini,
        autoplay,
        isLoop,
        setIsMini,
        setAutoplay,
        setIsLoop,
    } = usePlayerStore();

    function toggleAutoplay(): void {
        setAutoplay(!autoplay)
        if (isLoop) setIsLoop(!isLoop)
    }

    function toggleLoop(): void {
        setIsLoop(!isLoop)
        if (autoplay) setAutoplay(!autoplay)
    }


    return (
        <div className="flex flex-col xl:flex-row xl:justify-between gap-2 items-center md:items-end xl:items-center text-lg w-full">

            <div className="flex order-2 xl:order-1  gap-4 justify-between">



                {/* Auto-play: */}
                <div className="flex gap-4 items-center ">
                    <span>Auto-play:</span>
                    <Switch
                        checked={autoplay}
                        onChange={toggleAutoplay}

                        onHandleColor="#FFFFFF" // Кружок
                        onColor="#a855f7" // Фон

                        offHandleColor="#9F93B8"
                        offColor="#453D53"

                        handleDiameter={25}
                        uncheckedIcon={false}
                        checkedIcon={false}
                        boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
                        activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
                        height={25}
                        width={50}
                        className=""
                    />
                </div>

                {/* Repeat: */}
                <div className="flex gap-4 items-center">
                    <span>Repeat:</span>
                 <Switch
                        checked={isLoop}
                        onChange={toggleLoop}

                        onHandleColor="#FFFFFF" // Кружок
                        onColor="#a855f7" // Фон

                        offHandleColor="#9F93B8"
                        offColor="#453D53"

                        handleDiameter={25}
                        uncheckedIcon={false}
                        checkedIcon={false}
                        boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
                        activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
                        height={25}
                        width={50}
                        className=""
                    />
                </div>
            </div>

            {/* Згорнути */}

            <div className="flex gap-1.5 items-center order-1 xl:order-2 cursor-pointer select-none" onClick={() => setIsMini(!isMini)}>
                <span className="pb-1 xl:hidden 2xl:flex">Згорнути</span>

                <button
                    className="ost-player-btn "
                >
                    <RiCollapseDiagonalLine />
                </button>
            </div>

        </div>
    );
}