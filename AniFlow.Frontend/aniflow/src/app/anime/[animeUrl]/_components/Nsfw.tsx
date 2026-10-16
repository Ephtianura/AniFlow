"use client"

import { useState } from "react";
import NsfwOverlay from "./NsfwOverlay";

type NsfwOverlayProps = {
    isNsfw: boolean
};

export default function Nsfw({ isNsfw }: NsfwOverlayProps) {
    if (!isNsfw) return null;
    const [showNsfw, setShowNsfw] = useState<boolean>(isNsfw);

    return (
        <>
            {showNsfw && (
                <NsfwOverlay
                    onClose={() => setShowNsfw(false)}
                />
            )}
        </>
    );
}