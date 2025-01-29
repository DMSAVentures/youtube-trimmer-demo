'use client'
import React, {useCallback} from 'react';
import {VideoListView} from "@/components/VideoListView";
import {VideoEditor} from "@/components/VideoEditor";
import {ErrorBoundary} from "@/app/ErrorBoundary";

export default function Home() {
  const [videoId, setVideoId] = React.useState('');

  const handleSetVideoId = useCallback((videoId: string) => {
      setVideoId(videoId);
  }, []);
  return (
      <ErrorBoundary>
      <div className="min-h-screen bg-gray-100">
        <div className="container mx-auto p-4">
          <div className="flex flex-col lg:flex-row gap-6">
            <aside className="lg:w-1/4 order-2 lg:order-1">
              <VideoListView onItemClicked={handleSetVideoId}/>
            </aside>
            <main className="lg:w-3/4 order-1 lg:order-2">
                <VideoEditor videoId={videoId}/>
              </main>
          </div>
        </div>
      </div>
      </ErrorBoundary>
);
}
