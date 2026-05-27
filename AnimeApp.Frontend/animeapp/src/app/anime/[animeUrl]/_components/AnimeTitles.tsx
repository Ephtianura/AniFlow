"use client";

import { TitleLanguage, TitleType } from "@/core/enums/AnimeTitle"
import { AnimeTitle } from "@/core/types"
import { useState } from "react"
import { getTitle } from "../_functions/getTitle";

type Props = {
    titles: AnimeTitle[]
}

export default function AnimeTitles({ titles }: Props) {

    const [openMore, setOpenMore] = useState(false)

    const synonyms = titles
        .filter(t => t.type !== TitleType.Official)
        .map(t => t.value)

    return (
        <div className="flex flex-col">
            <p className="text-primary-black text-[clamp(1.5rem,1.375rem+1.5vw,2.5rem)] font-medium py-1">
                {getTitle(titles, TitleLanguage.Ukrainian, TitleType.Official)}
            </p>

            <p className="text-primary-black text-sm">
                {getTitle(titles, TitleLanguage.Romaji, TitleType.Official)}
            </p>

            <p className="text-primary-black text-sm">
                {getTitle(titles, TitleLanguage.English, TitleType.Official)}
            </p>

            <p className="text-primary-black text-sm">
                {getTitle(titles, TitleLanguage.Japanese, TitleType.Official)}
            </p>


            {synonyms.length > 0 && (
                <div>
                    {openMore && (
                        <div className="text-primary-black text-sm">
                            {synonyms.join(", ")}
                        </div>
                    )}
                    <button onClick={() => setOpenMore(prev => !prev)}
                        className="cursor-pointer text-primary hover:text-purple-700 transition">
                        {openMore ? "Згорнути" : "Ще"}
                    </button>
                </div>
            )}

        </div>
    )
}
