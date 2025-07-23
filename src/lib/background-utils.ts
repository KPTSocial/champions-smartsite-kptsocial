export interface BackgroundStyle {
  backgroundImage: string;
  backgroundSize: string;
  backgroundPosition: string;
  backgroundRepeat: string;
  filter?: string;
}

export function createBackgroundStyle(
  imageUrl: string, 
  options: {
    grayscale?: boolean;
    position?: string;
    size?: string;
  } = {}
): BackgroundStyle {
  const { grayscale = false, position = 'center', size = 'cover' } = options;
  
  return {
    backgroundImage: `url(${imageUrl})`,
    backgroundSize: size,
    backgroundPosition: position,
    backgroundRepeat: 'no-repeat',
    ...(grayscale && { filter: 'grayscale(10%)' }),
  };
}