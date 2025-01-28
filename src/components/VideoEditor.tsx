import React, {useState, useEffect, useCallback} from "react";
import { YTVideoContainer } from "@/components/YoutubeVideoIFrame";
import VideoControls from "@/components/VideoPlayerControl";

export interface VideoPlayerProps {
    videoId: string;
}

export const VideoEditor: React.FC<VideoPlayerProps> = ({ videoId }) => {
    const [player, setPlayer] = useState<any>(null);
    const [videoDuration, setVideoDuration] = useState<number>(0);
    const [storedTrimStart,setStoredTrimStart] = useState<number>(0);
    const [storedTrimEnd, setStoredTrimEnd] = useState<number>(0);
    const [trimEnd, setTrimEnd] = useState<number>(storedTrimEnd);
    const [trimStart, setTrimStart] = useState<number>(storedTrimStart);
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const [currentSeekerTime, setCurrentSeekerTime] = useState<number>(0);

    useEffect(() => {
        setStoredTrimStart(Number(localStorage.getItem(`${videoId}-trimStart`)) || 0);
        setStoredTrimEnd(Number(localStorage.getItem(`${videoId}-trimEnd`)) || videoDuration);
    }, [videoDuration, videoId, storedTrimEnd]);

    // Pause handler
    const pause = () => {
        if (player) {
            player.pauseVideo();
            setIsPlaying(false);
        }
    };

    // Play handler
    const play = () => {
        if (player) {
            player.seekTo(Number(localStorage.getItem(`${videoId}-trimStart`)) || 0, true);
            player.playVideo();
            setIsPlaying(true);
        }
    };

    // Handle trim change
    const onTrim = useCallback((values: [number, number]) => {
        localStorage.setItem(`${videoId}-trimStart`, String(values[0]));
        localStorage.setItem(`${videoId}-trimEnd`, String(values[1]));

        if (player && values[0] !== trimStart) {
            player.seekTo(values[0], true);
            player.playVideo();
        }
        setTrimEnd(values[1]);
        setTrimStart(values[0]);
    }, [player, videoId, trimStart, setTrimStart, setTrimEnd]);

    // Monitor current playback time and stop at trimEnd
    useEffect(() => {
        if (!player) return;

        const interval = setInterval(() => {
            const currentTime = player.getCurrentTime();
            setCurrentSeekerTime(currentTime);
            if (currentTime >= trimEnd) {
                pause();
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [player, trimEnd]);

    if (!videoId) {
        return <div className={"flex justify-around items-center content-center text-gray-800 bg-gray-200 rounded-lg w-full lg:h-1/2 min-h-64"}>Select a video to edit</div>;
    }

    return (
        <>
            <YTVideoContainer
                videoId={videoId}
                storedTrimStart={storedTrimStart}
                setPlayer={setPlayer}
                setIsPlaying={setIsPlaying}
                setVideoDuration={setVideoDuration}
            />
            <VideoControls
                isPlaying={isPlaying}
                play={play}
                pause={pause}
                currentSeekerTime={currentSeekerTime}
                trimStart={storedTrimStart}
                trimEnd={storedTrimEnd}
                videoDuration={videoDuration}
                onTrim={onTrim}
            />
        </>
    );
};

export default VideoEditor;
