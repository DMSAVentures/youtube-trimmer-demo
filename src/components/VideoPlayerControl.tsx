import React from "react";
import RangeSlider from "@/components/RangeSlider";

interface VideoControlsProps {
    isPlaying: boolean;
    onPlay: () => void;
    onPause: () => void;
    trimStart: number;
    trimEnd: number;
    duration: number;
    onTrimChange: (position: number, isStart: boolean) => void;
}

const VideoControls: React.FC<VideoControlsProps> = ({
                                                         isPlaying,
                                                         onPlay,
                                                         onPause,
                                                         trimStart,
                                                         trimEnd,
                                                         duration,
                                                         onTrimChange
                                                     }) => {
    return (
        <div className="mt-4 bg-white rounded-lg p-4 shadow-md">

            <div className="flex justify-between items-center">
            {/* Play/Pause Button */}
            <button
                onClick={isPlaying ? onPause : onPlay}
                className="flex items-center justify-center w-12 h-12 rounded-full bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
            >
                {isPlaying ? '\u23F8' : '\u25B6'}
            </button>
                <RangeSlider min={0} max={100} minValue={0} maxValue={100} minRange={0} onMinChange={() => {}} onMaxChange={() => {}} step={1} label={'Trim Video'} optional={false} />
            </div>

        </div>
    );
};

export default VideoControls;
