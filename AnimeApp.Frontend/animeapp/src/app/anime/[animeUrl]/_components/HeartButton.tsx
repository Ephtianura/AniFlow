"use client";

import { useState } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa6";

interface HeartButtonProps {
    animeId: number;
    isFavorite: boolean | null;
}

export default function HeartButton({isFavorite} : HeartButtonProps) {
    const [liked, setLiked] = useState(isFavorite ?? false);;

    return (
        <div >
            <button className="relative justify-end active:scale-90 transition cursor-pointer" onClick={() => setLiked(prev => !prev)}>
                
                <FaHeart className={`absolute w-8 h-8 text-primary transition-all duration-200 
                ${liked ? "opacity-100 scale-100" : "opacity-0 scale-75"}`}/>

                <FaRegHeart className={`w-8 h-8 text-white sm:text-primary transition-all duration-200 
                ${liked ? "opacity-0 scale-75" : "opacity-100 scale-100"}`}/>
                
            </button>
        </div>
    )
}
