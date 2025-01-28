import React, {useEffect, useState} from "react";
import {Video} from "@/types/video";
import {useGetVideos} from "@/hooks/useGetVideos";
import {Pagination} from "@/components/Pagination";

export interface IVideoListViewProps {
    onItemClicked: (id: string) => void;
    items: Video
}

export function VideoListView(props: IVideoListViewProps) {
    const { onItemClicked } = props;
    const {loading, videos, error } = useGetVideos();
    const [searchResults, setSearchResults] = useState<Video[]>([]);
    const [currentResults, setCurrentResults] = useState<Video[]>([]);
    const [activeVideo, setActiveVideo] = React.useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        // Initialize search results and pagination when videos change
        setSearchResults(videos);
        setCurrentPage(1);
    }, [videos]);

    useEffect(() => {
        // Update currentResults whenever searchResults or currentPage changes
        const start = (currentPage - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        setCurrentResults(searchResults.slice(start, end));
    }, [searchResults, currentPage]);

    const handleItemClicked = (id: string) => {
        setActiveVideo(id);
        onItemClicked(id);
    }

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const search = e.target.value;
        const filteredVideos = videos.filter((item) => item.snippet.title.toLowerCase().includes(search.toLowerCase()));
        setSearchResults(filteredVideos);
        setCurrentPage(1); // Reset to the first page when searching
    }

    const handlePageSelection = (page: number) => {
        setCurrentPage(page);
        const start = (page - 1) * 10;
        const end = start + 10;
        setCurrentResults(videos.slice(start, end));
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
                    key={item.id.videoId ? item.etag + item.id.videoId : item.etag + item.id.channelId}
                    onClick={() => handleItemClicked(item.id.videoId)}
                    className={`p-4 rounded-lg cursor-pointer transition-colors ${
                        activeVideo === item.id.videoId
                            ? 'bg-blue-100 border-2 border-blue-500'
                            : 'bg-white hover:bg-gray-50'
                    }`}
                >
                    <h3 className="font-semibold text-lg text-gray-800">{item.snippet.title} {item.id.videoId}</h3>
                    <p className="text-gray-600 mt-1">{item.snippet.description}</p>
                </div>
            ))}
            <Pagination itemsPerPage={itemsPerPage} totalItems={searchResults.length} onPageChange={handlePageSelection} currentPage={currentPage}/>
        </div>
    );
}
