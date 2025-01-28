import * as data from "./data.json"
import React from "react";
import {Video} from "@/types/video";

export function useGetVideos() {
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);
    const [videos, setVideos] = React.useState<Video[]>([]);

    React.useEffect(() => {
        setLoading(true);
        try {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            setVideos(data.items.filter((item: Video) => item.id.kind === "youtube#video"));
        } catch {
            setError("Failed to fetch videos");
            setLoading(false);
        } finally {
            setLoading(false);
        }
    }, []);

    return { loading, error, videos };
}
