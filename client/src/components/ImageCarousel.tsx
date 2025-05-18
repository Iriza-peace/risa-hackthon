import React, { useState } from "react";
import { Box, IconButton, styled } from "@mui/material";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ImageCarouselProps {
  images: string[];
  height?: number;
  isDetailed?: boolean;
}

const CarouselContainer = styled(Box)(({ theme }) => ({
  position: "relative",
  overflow: "hidden",
  borderRadius: theme.shape.borderRadius,
  marginBottom: theme.spacing(2),
  maxWidth: "100%",
}));

const CarouselTrack = styled(Box)({
  display: "flex",
  transition: "transform 0.5s ease",
  height: "100%",
});

const CarouselImage = styled("img")({
  objectFit: "contain", // Changed from "cover" to "contain" to prevent zooming
  width: "100%",
  minWidth: "100%",
  height: "100%",
  display: "block",
  backgroundColor: "#f5f5f5", // Light background to fill empty spaces
});

const NavButton = styled(IconButton)(({ theme }) => ({
  position: "absolute",
  top: "50%",
  transform: "translateY(-50%)",
  backgroundColor: "rgba(255, 255, 255, 0.8)",
  color: theme.palette.grey[800],
  "&:hover": {
    backgroundColor: "rgba(255, 255, 255, 0.95)",
  },
  zIndex: 2,
  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
}));

const ImageCounter = styled(Box)(({ theme }) => ({
  position: "absolute",
  bottom: 8,
  right: 8,
  backgroundColor: "rgba(0, 0, 0, 0.7)",
  color: "white",
  padding: "4px 8px",
  borderRadius: 12,
  fontSize: 12,
  zIndex: 2,
  fontWeight: 500,
}));

const DotIndicator = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  position: "absolute",
  bottom: 8,
  left: 0,
  right: 0,
  zIndex: 2,
}));

const Dot = styled("div")<{ active: boolean }>(({ theme, active }) => ({
  width: 8,
  height: 8,
  borderRadius: "50%",
  backgroundColor: active
    ? theme.palette.primary.main
    : "rgba(255, 255, 255, 0.7)",
  margin: "0 4px",
  transition: "background-color 0.3s ease",
  cursor: "pointer",
}));

const ImageCarousel: React.FC<ImageCarouselProps> = ({
  images,
  height = 200,
  isDetailed = false,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // If there are no images or only one image, just render the image directly
  if (!images || images.length === 0) {
    return null;
  }

  // Calculate responsive height
  const displayHeight = isDetailed ? 300 : height; // Reduced from 400 to 300 for detailed view

  if (images.length === 1) {
    return (
      <Box
        sx={{
          borderRadius: 1,
          mb: 2,
          overflow: "hidden",
          height: displayHeight,
          maxWidth: "100%",
          border: "1px solid #e0e0e0",
        }}
      >
        <CarouselImage
          src={images[0]}
          alt="Complaint"
          height={displayHeight}
        />
      </Box>
    );
  }

  const goToPrevious = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const goToIndex = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <CarouselContainer 
      sx={{ 
        height: displayHeight,
        border: "1px solid #e0e0e0",
        maxWidth: isDetailed ? "600px" : "100%", // Limit max width for detailed view
        margin: isDetailed ? "0 auto" : "0", // Center the carousel in detailed view
      }}
    >
      <CarouselTrack
        sx={{
          transform: `translateX(-${currentIndex * 100}%)`,
        }}
      >
        {images.map((image, index) => (
          <CarouselImage
            key={index}
            src={image}
            alt={`Image ${index + 1}`}
            height={displayHeight}
          />
        ))}
      </CarouselTrack>

      <NavButton onClick={goToPrevious} sx={{ left: 8 }} size="small">
        <ChevronLeft size={20} />
      </NavButton>

      <NavButton onClick={goToNext} sx={{ right: 8 }} size="small">
        <ChevronRight size={20} />
      </NavButton>

      <ImageCounter>
        {currentIndex + 1}/{images.length}
      </ImageCounter>

      {images.length > 1 && images.length <= 5 && (
        <DotIndicator>
          {images.map((_, index) => (
            <Dot
              key={index}
              active={index === currentIndex}
              onClick={() => goToIndex(index)}
            />
          ))}
        </DotIndicator>
      )}
    </CarouselContainer>
  );
};

export default ImageCarousel;