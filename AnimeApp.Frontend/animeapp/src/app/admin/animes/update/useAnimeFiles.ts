import { useState } from "react";

export function useAnimeFiles(initialPosterUrl: string | null = null, initialScreenshotsUrls: string[] = []) {
    const [poster, setPoster] = useState<File | null>(null);
    const [posterPreview, setPosterPreview] = useState<string | null>(initialPosterUrl);
    const [screenshots, setScreenshots] = useState<File[]>([]);
    const [previews, setPreviews] = useState<string[]>(initialScreenshotsUrls);

    const handleFilesChange = (files: FileList) => {
        const newFiles = Array.from(files);
        setScreenshots([...screenshots, ...newFiles]);
        setPreviews([...previews, ...newFiles.map(f => URL.createObjectURL(f))]);
    };

    const removeScreenshot = (index: number) => {
        setScreenshots(screenshots.filter((_, i) => i !== index));
        setPreviews(previews.filter((_, i) => i !== index));
    };

    const handleScreenshotUrlChange = (url: string, index: number) => {
        const newPreviews = [...previews];
        newPreviews[index] = url;
        setPreviews(newPreviews);
    };

    return {
        poster, setPoster,
        posterPreview, setPosterPreview,
        screenshots, setScreenshots,
        previews, setPreviews,
        handleFilesChange,
        removeScreenshot,
        handleScreenshotUrlChange
    };
}
