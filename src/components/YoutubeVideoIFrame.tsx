import React, { useEffect } from "react";

interface YTVideoContainerProps {
    videoId: string;
    storedTrimStart: number;
    setPlayer: (player: any) => void;
    setIsPlaying: (isPlaying: boolean) => void;
    setVideoDuration: (duration: number) => void;
}

export const YTVideoContainer: React.FC<YTVideoContainerProps> = ({
                                                                      videoId,
                                                                      storedTrimStart,
                                                                      setPlayer,
                                                                      setVideoDuration,
                                                                      setIsPlaying,
                                                                  }) => {
    useEffect(() => {
        let ytPlayer: any;

        const createPlayer = () => {
            ytPlayer = new (window as any).YT.Player("youtube-player", {
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
                    start: storedTrimStart,
                },
                events: {
                    onReady: (event: any) => {
                        const ytPlayerInstance = event.target;
                        setPlayer(ytPlayerInstance);
                        setVideoDuration(ytPlayerInstance.getDuration());
                    },
                    onStateChange: (event: any) => {
                        if (event.data === (window as any).YT.PlayerState.PLAYING) {
                            setIsPlaying(true);
                        } else if (event.data === (window as any).YT.PlayerState.PAUSED) {
                            setIsPlaying(false);
                        }
                    }
                },
            });
        };

        if (!(window as any).YT || !(window as any).YT.Player) {
            const tag = document.createElement("script");
            tag.src = "https://www.youtube.com/iframe_api";
            const firstScriptTag = document.getElementsByTagName("script")[0];
            firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

            (window as any).onYouTubeIframeAPIReady = () => {
                createPlayer();
            };
        } else {
            createPlayer();
        }

        return () => {
            if (ytPlayer) {
                ytPlayer.destroy();
            }
        };
    }, [videoId, storedTrimStart, setPlayer, setVideoDuration]);

    return (
        <div className="relative aspect-video bg-black rounded-lg">
            <div id="youtube-player" className="absolute inset-0 w-full h-full"></div>
        </div>
    );
};
