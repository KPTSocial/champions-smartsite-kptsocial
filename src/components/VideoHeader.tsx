
import { useState } from 'react';

interface VideoHeaderProps {
  videoUrl: string;
  title?: string;
  description?: string;
  fallbackImageUrl?: string;
  className?: string;
}

const VideoHeader = ({ 
  videoUrl, 
  title, 
  description, 
  fallbackImageUrl,
  className = ""
}: VideoHeaderProps) => {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Debug logging
  console.log('VideoHeader - Video URL:', videoUrl);
  console.log('VideoHeader - Has error:', hasError);
  console.log('VideoHeader - Is loading:', isLoading);

  const handleVideoError = (e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
    console.error('Video failed to load:', e);
    console.error('Video URL that failed:', videoUrl);
    setHasError(true);
    setIsLoading(false);
  };

  const handleVideoLoaded = () => {
    console.log('Video loaded successfully:', videoUrl);
    setIsLoading(false);
  };

  const handleVideoCanPlay = () => {
    console.log('Video can play:', videoUrl);
    setIsLoading(false);
  };

  if (hasError) {
    console.log('Video failed to load, showing dark background');
    return (
      <div className={`absolute inset-0 w-full h-full bg-gray-900 ${className}`} />
    );
  }

  return (
    <>
      {isLoading && (
        <div className={`absolute inset-0 w-full h-full bg-gray-900 flex items-center justify-center ${className}`}>
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
        </div>
      )}
      <video
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        onError={handleVideoError}
        onLoadedData={handleVideoLoaded}
        onCanPlay={handleVideoCanPlay}
        className={`absolute inset-0 w-full h-full object-cover ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-500 ${className}`}
        style={{
          filter: 'brightness(1.15) contrast(1.1) saturate(1.2)',
        }}
        aria-label={description || title || "Header video"}
      >
        <source src={videoUrl} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </>
  );
};

export default VideoHeader;
