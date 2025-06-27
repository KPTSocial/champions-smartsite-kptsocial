
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
  fallbackImageUrl = "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=3000&auto=format&fit=crop",
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
    console.log('Rendering fallback image due to video error');
    return (
      <img 
        src={fallbackImageUrl}
        alt={title || "Header background"}
        className={`absolute inset-0 w-full h-full object-cover ${className}`}
      />
    );
  }

  return (
    <>
      {isLoading && (
        <img 
          src={fallbackImageUrl}
          alt={title || "Header background"}
          className={`absolute inset-0 w-full h-full object-cover ${className}`}
        />
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
        aria-label={description || title || "Header video"}
      >
        <source src={videoUrl} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </>
  );
};

export default VideoHeader;
