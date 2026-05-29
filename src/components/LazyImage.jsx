import React, { useState } from 'react';

const LazyImage = ({ src, alt, ...props }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div style={{ position: 'relative', overflow: 'hidden' }}>
      {!isLoaded && <div style={{ position: 'absolute', inset: 0, background: 'var(--surface-hover)', filter: 'blur(10px)' }} />}
      <img
        src={src}
        alt={alt}
        onLoad={() => setIsLoaded(true)}
        style={{ ...props.style, opacity: isLoaded ? 1 : 0, transition: 'opacity 0.3s ease-in-out' }}
        {...props}
      />
    </div>
  );
};

export default LazyImage;
