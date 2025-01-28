import React, {createContext, useState, useEffect, ReactNode, useCallback} from "react";

export interface VideoPlayerContextType {
    videoId: string;
    videoDuration: number;
    setVideoDuration: (duration: number) => void;
    storedTrimStart: number;
    storedTrimEnd: number;
    setPlayer: (player: any) => void;
    onTrim: (values: [number, number]) => void;
    pause: () => void;
    play: () => void;
    setVideoId?: (videoId: string) => void;
    isPlaying?: boolean;
    setIsPlaying?: (isPlaying: boolean) => void;
    currentSeekerTime: number;
}

const defaultContext: VideoPlayerContextType = {
    videoId: "",
    videoDuration: 0,
    setVideoDuration: () => {},
    storedTrimStart: 0,
    storedTrimEnd: 0,
    setPlayer: () => {},
    onTrim: () => {},
    pause: () => {},
    play: () => {},
    setVideoId: () => {},
    isPlaying: false,
    setIsPlaying: () => {},
    currentSeekerTime: 0,
}

export const VideoPlayerContext = createContext<VideoPlayerContextType>(defaultContext);

export const VideoPlayerProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [videoId, setVideoId] = useState<string>(""); // Default video ID
    const [videoDuration, setVideoDuration] = useState<number>(0);
    const storedTrimStart = Number(localStorage.getItem(`${videoId}-trimStart`))|| 0;
    const storedTrimEnd = Number(localStorage.getItem(`${videoId}-trimEnd`)) || videoDuration;
    const [trimStart, setTrimStart] = useState<number>(storedTrimStart);
    const [trimEnd, setTrimEnd] = useState<number>(videoDuration);
    const [player, setPlayer] = useState<any>(null);
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const [currentSeekerTime, setCurrentSeekerTime] = useState<number>(0);

    // Pause handler
    const pause = useCallback(() => {
        if (player) {
            player.pauseVideo();
            setIsPlaying(false);
        }
    }, [player]);

    // Play from `videoStart`
    const play = useCallback(() => {
        if (player) {
            player.seekTo(trimStart, true);
            player.playVideo();
            setIsPlaying(true);
        }
    }, [player, trimStart]);

    // Handle trim changes
    const handleTrimChange = (values: [number, number]) => {
        if (videoId === "") return;
        localStorage.setItem(`${videoId}-trimStart`, String(values[0]));
        localStorage.setItem(`${videoId}-trimEnd`, String(values[1]));

        console.log(player)
        if (player && values[0] !== trimStart) {
            player.seekTo(values[0], true);
            player.playVideo();
            setIsPlaying(true);
        }

        setTrimStart(values[0]);
        setTrimEnd(values[1]);
    };

    // Stop video when reaching `trimEnd`
    useEffect(() => {
        if (!player) return;

        const interval = setInterval(() => {
            const currentTime  = player.getCurrentTime();
            setCurrentSeekerTime(currentTime);
            if (currentTime >= trimEnd) {
                pause();
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [trimEnd, player]);

    return (
        <VideoPlayerContext.Provider
            value={{
                videoId,
                videoDuration,
                storedTrimStart,
                storedTrimEnd,
                setPlayer,
                onTrim: handleTrimChange,
                setVideoDuration,
                pause,
                play,
                setVideoId,
                isPlaying,
                setIsPlaying,
                currentSeekerTime,
            }}
        >
            {children}
        </VideoPlayerContext.Provider>
    );
};
