import { useEffect, useState } from "react";

const useStoredTrimValues = (videoId: string, videoDuration: number | null) => {
    const [storedTrimStart, setStoredTrimStart] = useState<number>(0);
    const [storedTrimEnd, setStoredTrimEnd] = useState<number>(0);

    useEffect(() => {
        if (videoId) {
            const trimStart = Number(localStorage.getItem(`${videoId}-trimStart`)) || 0;
            const trimEnd = Number(localStorage.getItem(`${videoId}-trimEnd`)) || videoDuration || 0;

            setStoredTrimStart(trimStart);
            setStoredTrimEnd(trimEnd);
        }
    }, [videoId, videoDuration]);

    const storeTrimValues = (trimStart: number, trimEnd: number) => {
        localStorage.setItem(`${videoId}-trimStart`, String(trimStart));
        localStorage.setItem(`${videoId}-trimEnd`, String(trimEnd));
    }

    return { storedTrimStart, storedTrimEnd, storeTrimValues };
};

export default useStoredTrimValues;
