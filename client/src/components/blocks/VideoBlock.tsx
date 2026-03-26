// client/src/components/blocks/VideoBlock.tsx
import { useEffect, useState } from 'react';
import { apiClient } from '../../utils/api';
import { Loader2, Video as VideoIcon } from 'lucide-react';

export default function VideoBlock({ query }: { query: string }) {
  const [videoId, setVideoId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const response = await apiClient.get(`/api/media/youtube?query=${encodeURIComponent(query)}`);
        setVideoId(response.data.videoId);
      } catch (err) {
        console.error("Failed to load video", err);
        setError(true);
      } finally {
        setIsLoading(false);
      }
    };

    if (query) fetchVideo();
  }, [query]);

  if (isLoading) {
    return (
      <div className="my-8 aspect-video bg-gray-100 rounded-xl flex flex-col items-center justify-center border-2 border-dashed border-gray-300">
        <Loader2 className="animate-spin w-8 h-8 text-blue-500 mb-2" />
        <p className="text-gray-500 font-medium animate-pulse">Searching for: "{query}"</p>
      </div>
    );
  }

  if (error || !videoId) {
    return (
      <div className="my-8 p-6 bg-red-50 text-red-700 rounded-xl flex items-center gap-3">
        <VideoIcon className="w-6 h-6" />
        <p>Could not load the related video for this topic.</p>
      </div>
    );
  }

  return (
    <div className="my-8 rounded-xl overflow-hidden shadow-lg border border-gray-200">
      <div className="aspect-video relative">
        <iframe
          className="absolute top-0 left-0 w-full h-full"
          src={`https://www.youtube.com/embed/${videoId}`}
          title="Educational Video"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
      <div className="bg-gray-50 px-4 py-3 border-t border-gray-200 flex items-center gap-2 text-sm text-gray-600">
        <VideoIcon className="w-4 h-4" /> Recommended supplementary viewing
      </div>
    </div>
  );
}