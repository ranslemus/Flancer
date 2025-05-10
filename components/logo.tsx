import { useState, useEffect } from 'react';

const Logo = () => {
  const [windowWidth, setWindowWidth] = useState(0);

  // Update window width on resize
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);

    // Set initial window width
    handleResize();

    // Add resize event listener
    window.addEventListener('resize', handleResize);

    // Clean up listener on unmount
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Determine which image to display based on window width
  const imageSrc = windowWidth > 1024 ? '/flancer_logo_textOnly.png' : '/flancer_logo_logoOnly.png';

  return (
    <img
    src={imageSrc}
    alt="Flancer Logo"
    className="w-auto h-9 md:h-12 lg:h-16 rounded-full"
    />
  );
};

export default Logo;
