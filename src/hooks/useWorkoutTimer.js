import { useState, useEffect } from "react";

export const useWorkoutTimer = (startedAt) => {
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    if (!startedAt) return;

    const calculateElapsed = () => {
      const startTime = new Date(startedAt).getTime();
      const diffInSeconds = Math.max(0, Math.floor((Date.now() - startTime) / 1000));
      setElapsedSeconds(diffInSeconds);
    };

    const initialUpdate = setTimeout(calculateElapsed, 0); // execute it after all current synchronous code on the call stack is finished
    // Update every second
    const interval = setInterval(calculateElapsed, 1000);

    return () => {
      clearTimeout(initialUpdate); 
      clearInterval(interval);
    }
  }, [startedAt]);

  const visibleSeconds = startedAt ? elapsedSeconds : 0; 
  // Helper to format seconds into HH:MM:SS or MM:SS
  const formatTime = () => {
    const hours = Math.floor(visibleSeconds / 3600);
    const minutes = Math.floor((visibleSeconds % 3600) / 60);
    const seconds = visibleSeconds % 60;

    const pad = (num) => String(num).padStart(2, "0");

    if (hours > 0) {
      return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
    }
    return `${pad(minutes)}:${pad(seconds)}`;
  };

  return { visibleSeconds, formattedTime: formatTime() };
};