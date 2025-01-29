import React, {useState, useEffect, useCallback} from "react";
import VideoControls from "@/components/VideoPlayerControl";
import useYouTubePlayer from "@/hooks/useYoutubePlayer";
import useStoredTrimValues from "@/hooks/useStoredTrimValues";

export interface VideoPlayerProps {
    videoId: string;
}

export const VideoEditor: React.FC<VideoPlayerProps> = ({videoId}) => {
    const elementId = "youtube-player";
    const {player, isPlayerReady, videoDuration, isPlaying, getCurrentTime} = useYouTubePlayer(elementId, videoId);
    const {storedTrimStart, storedTrimEnd, storeTrimValues} = useStoredTrimValues(videoId, videoDuration);
    const [seekToTime, setSeekToTime] = useState<number>(0);

    useEffect(() => {
        setSeekToTime(storedTrimStart);
    }, [storedTrimStart]);

    // Pause handler
    const pause = () => {
        if (isPlayerReady && player) {
            player.pauseVideo();
        }
    };

    // Play handler
    const play = () => {
        if (isPlayerReady && player) {
            player.seekTo(seekToTime, true);
            player.playVideo();
        }
    };

    // Handle trim change
    const onTrim = useCallback((values: [number, number]) => {
        storeTrimValues(values[0], values[1]);

        if (player && values[0] !== seekToTime) {
            player.seekTo(values[0], true);
            player.playVideo();
        }

        setSeekToTime(values[0]);
    }, [player, videoId, seekToTime, setSeekToTime]);

    if (!videoId) {
        return <div
            className={"flex justify-around items-center content-center text-gray-800 bg-gray-200 rounded-lg relative aspect-video lg:top-2 lg:sticky"}>
            Select a video to edit
        </div>;
    }

    return (<div className={"flex flex-col space-y-4 lg:top-2 lg:sticky"}>
            <div className="relative aspect-video">
                <div id={elementId} className="absolute inset-0 w-full h-full"></div>
            </div>
            <VideoControls
                isPlayerReady={isPlayerReady}
                isPlaying={isPlaying}
                play={play}
                pause={pause}
                handleGetPlayerCurrentSeekerTime={getCurrentTime}
                initTrimValues={[storedTrimStart, storedTrimEnd]}
                videoDuration={videoDuration}
                onTrim={onTrim}
            />
        </div>);
};

export default VideoEditor;
