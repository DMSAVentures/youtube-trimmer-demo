import React, { useState, useEffect, useRef } from "react";
import { convertSecondsToTime } from "@/utils/time";

interface PlaybackTrimmerProps {
    trimStart: number;
    trimEnd: number;
    videoDuration: number;
    onTrim: (values: [number, number]) => void;
}

const PlaybackTrimmer: React.FC<PlaybackTrimmerProps> = ({
                                                             trimStart,
                                                             trimEnd,
                                                             videoDuration,
                                                             onTrim,
                                                         }) => {
    const [values, setValues] = useState<[number, number]>([trimStart, trimEnd]);
    const trackRef = useRef<HTMLDivElement>(null);
    const isDragging = useRef<"min" | "max" | null>(null);

    // Sync values with props
    useEffect(() => {
        setValues([trimStart, trimEnd]);
    }, [trimStart, trimEnd]);

    // Calculate percentage position
    const getPercentage = (value: number) =>
        videoDuration ? (value / videoDuration) * 100 : 0;

    // Handle dragging events
    const handleDragStart = (type: "min" | "max") => {
        isDragging.current = type;
        document.addEventListener("pointermove", handleDrag);
        document.addEventListener("pointerup", handleDragEnd);
    };

    const handleDrag = (e: PointerEvent) => {
        if (!isDragging.current || !trackRef.current) return;

        const rect = trackRef.current.getBoundingClientRect();
        const percentage = Math.max(
            0,
            Math.min(100, ((e.clientX - rect.left) / rect.width) * 100)
        );
        const newValue = Math.round((percentage * videoDuration) / 100);

        setValues((prev) => {
            const [start, end] = prev;
            if (isDragging.current === "min") {
                return [Math.min(newValue, end - 1), end];
            } else {
                return [start, Math.max(newValue, start + 1)];
            }
        });
    };

    const handleDragEnd = () => {
        isDragging.current = null;
        document.removeEventListener("pointermove", handleDrag);
        document.removeEventListener("pointerup", handleDragEnd);

        // Call onTrim only after dragging is complete
        onTrim(values);
    };

    return (
        <div className="flex w-full flex-col">
            {/* Time Display */}
            <div className="w-full flex justify-between px-2">
        <span className="text-sm font-medium text-gray-600">
          Start: {convertSecondsToTime(values[0])}
        </span>
                <span className="text-sm font-medium text-gray-600">
          End: {convertSecondsToTime(values[1])}
        </span>
            </div>

            {/* Trim Bar */}
            <div className="relative w-full h-16 select-none">
                {/* Track */}
                <div
                    ref={trackRef}
                    className="absolute top-1/2 left-0 right-0 h-8 bg-gray-300 transform -translate-y-1/2"
                >
                    <div
                        className="absolute h-full bg-blue-400"
                        style={{
                            left: `${getPercentage(values[0])}%`,
                            right: `${100 - getPercentage(values[1])}%`,
                        }}
                    />
                </div>

                {/* Min Handle */}
                <div
                    className="absolute top-1/2 w-4 h-8 bg-white border-2 border-blue-600 cursor-pointer transform -translate-x-1/2 -translate-y-1/2 hover:scale-110 transition-transform"
                    style={{ left: `${getPercentage(values[0])}%` }}
                    onPointerDown={() => handleDragStart("min")}
                    tabIndex={0}
                    role="slider"
                    aria-valuemin={0}
                    aria-valuemax={videoDuration}
                    aria-valuenow={values[0]}
                />

                {/* Max Handle */}
                <div
                    className="absolute top-1/2 w-4 h-8 bg-white border-2 border-blue-600 cursor-pointer transform -translate-x-1/2 -translate-y-1/2 hover:scale-110 transition-transform"
                    style={{ left: `${getPercentage(values[1])}%` }}
                    onPointerDown={() => handleDragStart("max")}
                    tabIndex={0}
                    role="slider"
                    aria-valuemin={0}
                    aria-valuemax={videoDuration}
                    aria-valuenow={values[1]}
                />
            </div>
        </div>
    );
};

export default PlaybackTrimmer;
