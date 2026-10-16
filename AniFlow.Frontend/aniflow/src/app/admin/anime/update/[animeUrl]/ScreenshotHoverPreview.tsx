"use client";

type HoverPreviewProps = {
    src: string;
    isVisible: boolean;
};

export default function ScreenshotHoverPreview({ src, isVisible }: HoverPreviewProps) {
    return (
        <div 
            className={`fixed inset-0 flex items-center justify-center z-20 pointer-events-none p-4 `}
        >
            <div 
                className={`relative max-w-3xl max-h-[70vh] rounded-lg overflow-hidden shadow-2xl bg-black transition-all duration-300 ease-out ${
                    isVisible 
                        ? "opacity-100 scale-100" 
                        : "opacity-0 scale-95"
                }`}
            >
                <img 
                    src={src} 
                    alt="Enlarged preview" 
                    className="w-full h-full object-contain max-h-[70vh] select-none"
                />
            </div>
        </div>
    );
}