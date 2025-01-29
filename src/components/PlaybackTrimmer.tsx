import React, { useState} from "react";
import {convertSecondsToTime} from "@/utils/time";

interface PlaybackTrimmerProps {
    trimStart: number;
    trimEnd: number;
    videoDuration: number;
    onTrim: (values: [number, number]) => void;
}

/**
 * This PlaybackTrimmer uses two native range inputs to simulate
 * a single slider with two handles.
 * Disclaimer: This component was heavily inspired from range slider component in design system I coded myself.
 * You can find it at https://github.com/DMSAVentures/webapp/tree/main/src/components/simpleui/Slider/RangeSlider
 */
export const PlaybackTrimmer: React.FC<PlaybackTrimmerProps> = ({
                                                             trimStart, trimEnd, videoDuration, onTrim,
                                                         }) => {
    const [minVal, setMinVal] = useState(trimStart);
    const [maxVal, setMaxVal] = useState(trimEnd);

    const clamp = (val: number, min: number, max: number) => Math.max(min, Math.min(val, max));

    // Whenever minVal changes, ensure it can't exceed maxVal
    const handleMinChange = (value: number) => {
        const clampedValue = clamp(value, 0, maxVal);
        setMinVal(clampedValue);
        onTrim([clampedValue, maxVal]);
    };

    // Whenever maxVal changes, ensure it can't go below minVal
    const handleMaxChange = (value: number) => {
        const clampedValue = clamp(value, minVal, videoDuration);
        setMaxVal(clampedValue);
        onTrim([minVal, clampedValue]);
    };

    // Calculate percentages for the colored track sections
    const minPercentage = (minVal / videoDuration) * 100;
    const maxPercentage = (maxVal / videoDuration) * 100;

    return (<div className="flex w-full flex-col space-y-6">
        <div className="w-full flex justify-between">
            <span className="text-sm font-medium text-gray-600">
              Start: {convertSecondsToTime(minVal)}
            </span>
            <span className="text-sm font-medium text-gray-600">
              End: {convertSecondsToTime(maxVal)}
            </span>
        </div>
        <div className="trimmer">
            <div className="trimmer__track"/>
            <div
                className="trimmer__progress"
                style={{
                    left: `${minPercentage}%`,
                    width: `${maxPercentage - minPercentage}%`
                }}
            />
            {/* Slider for MIN value */}
            <input
                type="range"
                min={0}
                max={videoDuration}
                step={1}
                value={minVal}
                onChange={(e) => handleMinChange(Number(e.target.value))}
                className="trimmer__range"
            />

            {/* Slider for MAX value - stacked */}
            <input
                type="range"
                min={0}
                max={videoDuration}
                step={1}
                value={maxVal}
                onChange={(e) => handleMaxChange(Number(e.target.value))}
                className="trimmer__range"
            />
        </div>
    </div>);
};
