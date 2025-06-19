
export const compressImage = (file: File, maxWidth: number = 1920, quality: number = 0.8): Promise<File> => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      // Calculate new dimensions
      let { width, height } = img;
      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }

      canvas.width = width;
      canvas.height = height;

      // Draw and compress
      ctx?.drawImage(img, 0, 0, width, height);
      
      canvas.toBlob(
        (blob) => {
          if (blob) {
            const compressedFile = new File([blob], file.name, {
              type: 'image/jpeg',
              lastModified: Date.now(),
            });
            resolve(compressedFile);
          } else {
            resolve(file);
          }
        },
        'image/jpeg',
        quality
      );
    };

    img.src = URL.createObjectURL(file);
  });
};

export const getImageOrientation = (file: File): Promise<number> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const arrayBuffer = e.target?.result as ArrayBuffer;
      const dataView = new DataView(arrayBuffer);
      
      if (dataView.getUint16(0, false) !== 0xFFD8) {
        resolve(1); // Not JPEG
        return;
      }

      let offset = 2;
      let marker;
      
      while (offset < dataView.byteLength) {
        marker = dataView.getUint16(offset, false);
        offset += 2;
        
        if (marker === 0xFFE1) {
          offset += 2;
          if (dataView.getUint32(offset, false) === 0x45786966) {
            const orientation = dataView.getUint16(offset + 16, false);
            resolve(orientation);
            return;
          }
        } else {
          offset += dataView.getUint16(offset, false);
        }
      }
      
      resolve(1); // Default orientation
    };
    reader.readAsArrayBuffer(file);
  });
};
