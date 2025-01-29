import React, {useEffect, useRef, useState} from "react";
import {PlaybackTrimmer} from "@/components/PlaybackTrimmer";
import { convertSecondsToTime } from "@/utils/time";

interface VideoControlsProps {
    isPlayerReady: boolean;
    isPlaying: boolean;
    play: () => void;
    pause: () => void;
    handleGetPlayerCurrentSeekerTime: () => number;
    initTrimValues: [number, number];
    videoDuration: number;
    onTrim: (values: [number, number]) => void;
}

interface PlayerCurrentTimeStampProps {
    handleGetPlayerCurrentSeekerTime: () => number;
}

const PlayerCurrentTimeStamp: React.FC<PlayerCurrentTimeStampProps> = (props: PlayerCurrentTimeStampProps) => {
    const { handleGetPlayerCurrentSeekerTime } = props;
    const [currentTime, setCurrentTime] = useState<number>(0);

    useEffect(() => {
        const interval = setInterval(() => {
            const currentTime = handleGetPlayerCurrentSeekerTime();
            setCurrentTime(currentTime);
        }, 1000);

        return () => clearInterval(interval);
    }, [handleGetPlayerCurrentSeekerTime]);

    return <span>{convertSecondsToTime(currentTime)}</span>;
}

interface PlayPauseButtonProps {
    isPlaying: boolean,
    pause: () => void,
    play: () => void,
    handleGetPlayerCurrentSeekerTime: () => number;
}

const PlayPauseButton: React.FC<PlayPauseButtonProps> = (props: PlayPauseButtonProps) => {
    return <div className="flex flex-col justify-between items-center space-y-4">
        <button
            onClick={props.isPlaying ? props.pause : props.play}
            className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-600 text-white hover:bg-blue-800 hover:cursor-pointer transition-colors"
        >
            {props.isPlaying ? "\u23F8" : "\u25B6"}
        </button>
        <PlayerCurrentTimeStamp handleGetPlayerCurrentSeekerTime={props.handleGetPlayerCurrentSeekerTime}/>
    </div>;
}

const VideoControls: React.FC<VideoControlsProps> = ({
                                                         isPlaying,
                                                         isPlayerReady,
                                                         play,
                                                         pause,
                                                         handleGetPlayerCurrentSeekerTime,
                                                         initTrimValues: [trimStart, trimEnd],
                                                         videoDuration,
                                                         onTrim,
                                                     }) => {
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    const handleTrimChange = ([newTrimStart, newTrimEnd] : [number, number]) => {
        onTrim([newTrimStart, newTrimEnd]);

        // Clear previous interval if exists
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }

        intervalRef.current = setInterval(() => {
            const currentTime = handleGetPlayerCurrentSeekerTime();
            if (currentTime >= newTrimEnd) {
                pause();
                clearInterval(intervalRef.current!);
            }
        }, 1000);
    };

    if (!isPlayerReady) return null;

    return (
        <div className="mt-4 bg-white rounded-lg p-4 shadow-md">
            <div className="flex justify-between items-center space-x-4">
                <PlayPauseButton isPlaying={isPlaying} pause={pause} play={play} handleGetPlayerCurrentSeekerTime={handleGetPlayerCurrentSeekerTime}/>
                <PlaybackTrimmer
                    trimStart={trimStart}
                    trimEnd={trimEnd}
                    videoDuration={videoDuration}
                    onTrim={handleTrimChange}
                />
            </div>
        </div>
    );
};

export default VideoControls;
