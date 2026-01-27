import React, { useState, useEffect } from 'react';
import './SplashScreen.css';

const SplashScreen = ({ onComplete }) => {
  const [animationStage, setAnimationStage] = useState('slide-in'); // slide-in, pause, slide-out

  useEffect(() => {
    // Slide in to center (0.8s)
    const slideInTimer = setTimeout(() => {
      setAnimationStage('pause');
    }, 800);

    // Pause at center (1.5s)
    const pauseTimer = setTimeout(() => {
      setAnimationStage('slide-out');
    }, 2300); // 800ms slide-in + 1500ms pause

    // Slide out to right (0.8s)
    const slideOutTimer = setTimeout(() => {
      onComplete();
    }, 3100); // 800ms slide-in + 1500ms pause + 800ms slide-out

    return () => {
      clearTimeout(slideInTimer);
      clearTimeout(pauseTimer);
      clearTimeout(slideOutTimer);
    };
  }, [onComplete]);

  return (
    <div className="splash-screen">
      <div className={`splash-logo ${animationStage}`}>
        <img src="/app-logo.jpg" alt="AmbuCheck Logo" />
      </div>
    </div>
  );
};

export default SplashScreen;
