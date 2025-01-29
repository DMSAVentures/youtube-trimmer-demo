export interface YTPlayer {
    getDuration(): number;
    getCurrentTime(): number;
    playVideo(): void;
    pauseVideo(): void;
    destroy(): void;
    seekTo(duration: number, play: boolean): void;
}

export interface YTPlayerEvent {
    target: YTPlayer;
    data: number;
}

export interface YTPlayerOptions {
    videoId: string;
    playerVars?: Record<string, unknown>;
    events?: {
        onReady?: (event: YTPlayerEvent) => void;
        onStateChange?: (event: YTPlayerEvent) => void;
    };
}
