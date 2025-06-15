import React, { useEffect, useRef } from 'react';
import Lottie from 'lottie-web';
import animationData from '../public/Main Scene (1).json';

const AnimatedComponent = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current) {
      const anim = Lottie.loadAnimation({
        container: containerRef.current,
        renderer: 'svg',
        loop: true,
        autoplay: true,
        animationData: animationData
      });

      return () => {
        anim.destroy();
      };
    }
  }, []);

  return (
    <div className="animation-container">
      <div className="animation-wrapper">
        <div ref={containerRef} className="lottie-container"></div>
      </div>
    </div>
  );
};

export default AnimatedComponent; 