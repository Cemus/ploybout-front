import { useEffect, useState } from "react";

export const useWindowWidth = () => {
  const [currentWidth, setCurrentWidth] = useState<number>(window.innerWidth);
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth !== currentWidth) {
        setCurrentWidth(window.innerWidth);
      }
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [currentWidth]);
  return currentWidth;
};
