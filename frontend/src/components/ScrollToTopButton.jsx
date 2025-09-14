import React, { useState, useEffect } from "react";
import { animateScroll as scroll } from "react-scroll";
import Lottie from "lottie-react";
import arrowUpAnimation from "../images/arrowUp.json"; // Import JSON animacije

const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Proveravamo kada treba prikazati dugme
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  return (
    <div>
      {isVisible && (
        <button
          onClick={() => scroll.scrollToTop({ smooth: true, duration: 500 })}
          className="fixed bottom-24 right-6 bg-blue-600 p-3 rounded-full shadow-lg hover:bg-blue-500 transition-all z-30"
        >
          <Lottie
            animationData={arrowUpAnimation}
            className="w-10 h-10 invert"
            loop={true}
          />
        </button>
      )}
    </div>
  );
};

export default ScrollToTopButton;
