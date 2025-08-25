import { useState, useEffect } from "react";
import bg1 from "../../assets/images/backgrounds/plain.webp";
import bg2 from "../../assets/images/backgrounds/island.webp";
import bg3 from "../../assets/images/backgrounds/swamp.webp";
import bg4 from "../../assets/images/backgrounds/mountain.webp";
import bg5 from "../../assets/images/backgrounds/forest.webp";
const images = [bg1, bg2, bg3, bg4, bg5];

const BackgroundSlideshow = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState<boolean[]>(
    Array(images.length).fill(false)
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 15000); // Change image every 15 seconds

    return () => clearInterval(interval);
  }, []);

  const handleImageLoad = (index: number) => {
    setImagesLoaded((prevState) => {
      const updatedState = [...prevState];
      updatedState[index] = true; // Mark the image as loaded
      return updatedState;
    });
  };

  return (
    <div className="background-container">
      {images.map((image, index) => (
        <img
          className="fixed top-0 left-0 w-screen h-screen"
          key={`bg` + index}
          src={image}
          alt={`Background ${index + 1}`}
          onLoad={() => handleImageLoad(index)}
          style={{
            transition: "opacity 0.5s",
            opacity: imagesLoaded[index]
              ? index === currentImageIndex
                ? 1
                : 0
              : 0, // Show current image if loaded
            zIndex: -index - 1, // Decreasing z-index for subsequent images
          }}
        />
      ))}
      {!imagesLoaded[currentImageIndex] && (
        <div
          className="fixed top-0 left-0 w-screen h-screen bg-placeholder"
          style={{
            zIndex: -images.length - 1, // Ensure placeholder is behind all images
          }}
        />
      )}
    </div>
  );
};

export default BackgroundSlideshow;
