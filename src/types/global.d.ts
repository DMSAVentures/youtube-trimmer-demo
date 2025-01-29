// global.d.ts
import {YTPlayer, YTPlayerOptions} from "@/types/youtube";

export {};

declare global {
    interface Window {
        YT?: {
            Player: new (elementId: string, options: YTPlayerOptions) => YTPlayer;
            PlayerState: {
                PAUSED: number;
                PLAYING: number;
            };
        };
        onYouTubeIframeAPIReady?: () => void;
    }
}
