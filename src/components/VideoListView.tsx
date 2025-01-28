import React, {useEffect, useState} from "react";
import {Video} from "@/types/video";
import {useGetVideos} from "@/hooks/useGetVideos";

export interface IVideoListViewProps {
    onItemClicked: (id: string) => void;
    items: Video
}

export function VideoListView(props: IVideoListViewProps) {
    const { onItemClicked } = props;
    const {loading, videos, error } = useGetVideos();
    const [currentResults, setCurrentResults] = useState<Video[]>([]);
    const [activeVideo, setActiveVideo] = React.useState<string | null>(null);


    useEffect(() => {
        setCurrentResults(videos.slice(0, 10));
    }, [videos]);

    const handleItemClicked = (id: string) => {
        setActiveVideo(id);
        onItemClicked(id);
    }

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const search = e.target.value;
        const filteredVideos = videos.filter((item) => item.snippet.title.toLowerCase().includes(search.toLowerCase()));
        setCurrentResults(filteredVideos.slice(0, 10));
    }

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className={'space-y-4'}>
            <input className={'p-4 w-full rounded-lg cursor-pointer text-gray-800 bg-white hover:bg-gray-50'} placeholder={"Search videos"} onChange={handleSearch}/>
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
