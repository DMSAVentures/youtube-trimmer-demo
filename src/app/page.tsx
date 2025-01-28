'use client'
import React, { useState } from 'react';
import {VideoListView} from "@/components/VideoListView";
// import { Play, Pause, Volume2, VolumeX } from 'lucide-react';

export default function Home() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [activeVideo, setActiveVideo] = useState(1);

  return (
      <div className="min-h-screen bg-gray-100">
        <div className="container mx-auto p-2">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Sidebar */}
            <aside className="lg:w-1/4 order-2 lg:order-1">
              <VideoListView onItemClicked={() => {
              }}/>
            </aside>

              {/* Main Content */}
              <main className="lg:w-3/4 order-1 lg:order-2">
                {/* Video Player */}
                <div className="bg-gray-900 aspect-video rounded-lg relative">
                  <img
                      src="https://images.unsplash.com/photo-1550784343-6bd0ce5d600b"
                      alt="Video thumbnail"
                      className="w-full h-full object-cover rounded-lg"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-white text-6xl">VIDEO</div>
                  </div>
                </div>

                {/* Video Controls */}
                <div className="mt-4 bg-white p-4 rounded-lg shadow-sm">
                  <div className="flex items-center gap-4">
                    <button
                        onClick={() => setIsPlaying(!isPlaying)}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                      {isPlaying ? (
                          // <Pause className="w-6 h-6" />
                          "Pause"
                      ) : (
                          // <Play className="w-6 h-6" />
                          "Play"
                      )}
                    </button>

                    <div className="flex-1 bg-gray-200 h-2 rounded-full">
                      <div
                          className="bg-blue-500 h-full rounded-full relative"
                          style={{width: '30%'}}
                      >
                        <div className="absolute right-0 -top-1 w-4 h-4 bg-blue-600 rounded-full shadow"></div>
                      </div>
                    </div>

                    <button
                        onClick={() => setIsMuted(!isMuted)}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                      {isMuted ? (
                          // <VolumeX className="w-6 h-6" />
                          "Mute"
                      ) : (
                          // <Volume2 className="w-6 h-6" />
                          "Unmute"
                      )}
                    </button>
                  </div>
                </div>
              </main>
          </div>
        </div>
      </div>
);
}
