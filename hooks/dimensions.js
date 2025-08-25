import { useEffect, useState } from "react";

export default function useDimensions() {
  const [dimensions, setDimensions] = useState({
    arcSize: 400,
    strokeWidth: 20
  });

  useEffect(() => {
    const updateDimensions = () => {
      const screenWidth = window.innerWidth;
      
      // Calculate responsive arc size (between 300 and 600)
      const responsiveArcSize = Math.max(300, Math.min(600, screenWidth * 0.8));
      
      // Calculate responsive stroke width (between 12 and 30)
      const responsiveStrokeWidth = Math.max(12, Math.min(30, screenWidth * 0.02));
      
      setDimensions({
        arcSize: responsiveArcSize,
        strokeWidth: responsiveStrokeWidth
      });
    };

    updateDimensions();

    window.addEventListener('resize', updateDimensions);

    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  return dimensions;
}
