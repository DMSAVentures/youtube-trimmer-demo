import React, { useEffect, useState } from "react";
import { Video } from "@/types/video";
import { useGetVideos } from "@/hooks/useGetVideos";
import { Pagination } from "@/components/Pagination";

export interface IVideoListViewProps {
    onItemClicked: (id: string) => void;
}

interface VideoListItemProps {
    video: Video;
    isActive: boolean;
    onClick: (id: string) => void;
}

const VideoListItem: React.FC<VideoListItemProps> = ({ video, isActive, onClick }) => {
    const videoId = video.id.videoId;
    return (
        <div
            onClick={() => onClick(videoId)}
            className={`flex flex-col space-y-2 p-4 rounded-lg cursor-pointer transition-colors ${
                isActive ? 'bg-blue-100 border-2 border-blue-500' : 'bg-white hover:bg-gray-50'
            }`}
        >
            <h3 className="font-semibold text-lg text-gray-800">
                {video.snippet.title}
            </h3>
            <p className="text-gray-600">{video.snippet.description}</p>
        </div>
    );
};

export function VideoListView(props: IVideoListViewProps) {
    const { onItemClicked } = props;
    const { loading, videos, error } = useGetVideos();
    const [searchResults, setSearchResults] = useState<Video[]>([]);
    const [currentResults, setCurrentResults] = useState<Video[]>([]);
    const [activeVideo, setActiveVideo] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        setSearchResults(videos);
        setCurrentPage(1);
    }, [videos]);

    useEffect(() => {
        const start = (currentPage - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        setCurrentResults(searchResults.slice(start, end));
    }, [searchResults, currentPage]);

    const handleItemClicked = (id: string) => {
        setActiveVideo(id);
        onItemClicked(id);
    };

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const search = e.target.value.toLowerCase();
        const filteredVideos = videos.filter((item) =>
            item.snippet.title.toLowerCase().includes(search)
        );
        setSearchResults(filteredVideos);
        setCurrentPage(1);
    };

    const handlePageSelection = (page: number) => {
        setCurrentPage(page);
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className={"space-y-4"}>
            <input
                className={"p-4 w-full rounded-lg cursor-pointer text-gray-800 bg-white hover:bg-gray-50"}
                placeholder={"Search videos"}
                onChange={handleSearch}
            />
            <div className={"h-screen overflow-y-auto space-y-4 "}>
            {currentResults.map((video) => {
                const key = video.id.videoId;
                return (
                <VideoListItem
                    key={key}
                    video={video}
                    isActive={activeVideo === key}
                    onClick={handleItemClicked}
                />
            )})}
            </div>
            {searchResults.length > 0 && (
                <Pagination
                    itemsPerPage={itemsPerPage}
                    totalItems={searchResults.length}
                    onPageChange={handlePageSelection}
                    currentPage={currentPage}
                />
            )}
        </div>
    );
}
