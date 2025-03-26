
import React, { useState, useEffect } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";
import { Slider } from "@/components/ui/slider";

interface ScrollControlProps {
  containerRef: React.RefObject<HTMLDivElement>;
}

export function ScrollControl({ containerRef }: ScrollControlProps) {
  const [scrollPosition, setScrollPosition] = useState(0);

  // Handle scroll position changes
  const handleScroll = () => {
    if (containerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
      const maxScroll = scrollHeight - clientHeight;
      const position = maxScroll > 0 ? (scrollTop / maxScroll) * 100 : 0;
      setScrollPosition(position);
    }
  };

  // Update scroll position when slider changes
  const handleSliderChange = (value: number[]) => {
    if (containerRef.current) {
      const { scrollHeight, clientHeight } = containerRef.current;
      const maxScroll = scrollHeight - clientHeight;
      const newScrollTop = (maxScroll * value[0]) / 100;
      containerRef.current.scrollTop = newScrollTop;
    }
  };

  // Quick scroll buttons
  const scrollUp = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({ top: -150, behavior: "smooth" });
    }
  };

  const scrollDown = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({ top: 150, behavior: "smooth" });
    }
  };

  // Add scroll event listener
  useEffect(() => {
    const currentRef = containerRef.current;
    
    if (currentRef) {
      currentRef.addEventListener("scroll", handleScroll);
      return () => {
        currentRef.removeEventListener("scroll", handleScroll);
      };
    }
  }, [containerRef]);

  return (
    <div className="fixed left-4 top-1/2 transform -translate-y-1/2 z-50 flex flex-col items-center gap-1 bg-white shadow-lg rounded-lg p-1 border border-primary/10">
      <button
        onClick={scrollUp}
        className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-gray-100 text-primary"
        aria-label="Scroll up"
      >
        <ChevronUp className="h-4 w-4" />
      </button>
      
      <div className="h-16 px-1">
        <Slider
          orientation="vertical"
          value={[scrollPosition]}
          onValueChange={handleSliderChange}
          className="h-full"
          step={1}
        />
      </div>
      
      <button
        onClick={scrollDown}
        className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-gray-100 text-primary"
        aria-label="Scroll down"
      >
        <ChevronDown className="h-4 w-4" />
      </button>
    </div>
  );
}
