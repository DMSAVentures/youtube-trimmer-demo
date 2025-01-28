import React from "react";
import {Video} from "@/types/video";
import {useGetVideos} from "@/hooks/useGetVideos";

export interface IVideoListViewProps {
    onItemClicked: (id: string) => void;
    items: Video
}

export function VideoListView(props: IVideoListViewProps) {
    const { onItemClicked } = props;
    const {loading, videos, error } = useGetVideos()
    const [activeVideo, setActiveVideo] = React.useState<string | null>(null);


    const handleItemClicked = (id: string) => {
        setActiveVideo(id);
        onItemClicked(id);
    }

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    const currentResults = videos.slice(0, 10);

    return (
        <div className={'space-y-4'}>
            {currentResults.map((item) => (
                <div
                    key={item.id.videoId}
                    onClick={() => handleItemClicked(item.id.videoId)}
                    className={`p-4 rounded-lg cursor-pointer transition-colors ${
                        activeVideo === item.id.videoId
                            ? 'bg-blue-100 border-2 border-blue-500'
                            : 'bg-white hover:bg-gray-50'
                    }`}
                >
                    <h3 className="font-semibold text-lg text-gray-800">{item.snippet.title}</h3>
                    <p className="text-gray-600 mt-1">{item.snippet.description}</p>
                </div>
            ))}
        </div>
    );
}
