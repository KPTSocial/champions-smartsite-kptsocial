
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

  const handleVideoError = () => {
    console.error('Video failed to load, falling back to image');
    setHasError(true);
    setIsLoading(false);
  };

  const handleVideoLoaded = () => {
    setIsLoading(false);
  };

  if (hasError) {
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
