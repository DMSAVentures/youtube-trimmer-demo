import { useEffect, useState } from "react";
import { YTPlayer, YTPlayerEvent } from "@/types/youtube";

const useYouTubePlayer = (elementId: string, videoId: string) => {
    const [player, setPlayer] = useState<YTPlayer| null>(null);
    const [videoDuration, setVideoDuration] = useState<number>(0);
    const [isPlayerReady, setIsPlayerReady] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);

    useEffect(() => {
        let ytPlayer: YTPlayer;

        const createPlayer = async () => {
            return new Promise((resolve) => {
                ytPlayer = new window.YT!.Player(elementId, {
                    videoId,
                    playerVars: {
                        autoplay: 0,
                        controls: 0,
                        disablekb: 1,
                        fs: 0,
                        iv_load_policy: 3,
                        rel: 0,
                        playsinline: 1,
                        modestbranding: 1,
                    },
                    events: {
                        onReady: (event: YTPlayerEvent) => {
                            const ytPlayerInstance = event.target;
                            setPlayer(ytPlayerInstance);
                            setVideoDuration(ytPlayerInstance.getDuration());
                            setIsPlayerReady(true);
                            resolve(ytPlayerInstance);
                        },
                        onStateChange: (event: YTPlayerEvent) => {
                            if (event.data === window.YT!.PlayerState.PLAYING) {
                                setIsPlaying(true);
                            } else if (event.data === window.YT!.PlayerState.PAUSED) {
                                setIsPlaying(false);
                            }
                        },
                    },
                });
            });
        };

        if (!window.YT || !window.YT.Player) {
            const tag = document.createElement("script");
            tag.src = "https://www.youtube.com/iframe_api";
            const firstScriptTag = document.getElementsByTagName("script")[0];
            firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

            window.onYouTubeIframeAPIReady = async () => {
                await createPlayer();
            };
        } else {
            createPlayer();
        }

        return () => {
            if (ytPlayer) {
                ytPlayer.destroy();
                setIsPlayerReady(false);
                setIsPlaying(false);
            }
        };
    }, [elementId, videoId]);

    const getCurrentTime = () => {
        if (player) {
            return player.getCurrentTime();
        }
        return 0;
    }

    return { player, isPlayerReady , videoDuration, isPlaying, getCurrentTime };
};

export default useYouTubePlayer;
