import data from "./data.json";
import React from "react";
import {Video} from "@/types/video";

// Currently this hook is getting data from json and returning it.
// This can be extended to fetch data from an API with pagination support
export function useGetVideos() {
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);
    const [videos, setVideos] = React.useState<Video[]>([]);

    React.useEffect(() => {
        setLoading(true);
        try {
            // As I'm reading data from file, I'm disabling the eslint rule.
            // When fetching data from an API, there will be proper validation on properties of the data.
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
