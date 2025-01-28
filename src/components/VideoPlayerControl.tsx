import React from "react";
import PlaybackTrimmer from "@/components/PlaybackTrimmer";
import { convertSecondsToTime } from "@/utils/time";

interface VideoControlsProps {
    isPlaying: boolean;
    play: () => void;
    pause: () => void;
    currentSeekerTime: number;
    trimStart: number;
    trimEnd: number;
    videoDuration: number;
    onTrim: (values: [number, number]) => void;
}

const VideoControls: React.FC<VideoControlsProps> = ({
                                                         isPlaying,
                                                         play,
                                                         pause,
                                                         currentSeekerTime,
                                                         trimStart,
                                                         trimEnd,
                                                         videoDuration,
                                                         onTrim,
                                                     }) => {
    return (
        <div className="mt-4 bg-white rounded-lg p-4 shadow-md">
            <div className="flex justify-between items-center space-x-4">
                <div className="flex flex-col justify-between items-center space-y-4">
                    <button
                        onClick={isPlaying ? pause : play}
                        className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-500 text-white hover:bg-blue-600 hover:cursor-pointer transition-colors"
                    >
                        {isPlaying ? "\u23F8" : "\u25B6"}
                    </button>
                    <span>{convertSecondsToTime(currentSeekerTime)}</span>
                </div>
                <PlaybackTrimmer
                    trimStart={trimStart}
                    trimEnd={trimEnd}
                    videoDuration={videoDuration}
                    onTrim={onTrim}
                />
            </div>
        </div>
    );
};

export default VideoControls;
