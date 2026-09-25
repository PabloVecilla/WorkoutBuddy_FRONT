import { useState, useEffect } from "react";

export const useWorkoutTimer = (startedAt) => {
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    if (!startedAt) {
      setElapsedSeconds(0);
      return;
    }

    const calculateElapsed = () => {
      const startTime = new Date(startedAt).getTime();
      const now = new Date().getTime();
      const diffInSeconds = Math.max(0, Math.floor((now - startTime) / 1000));
      setElapsedSeconds(diffInSeconds);
    };

    // Calculate immediately on mount/start
    calculateElapsed();

    // Update every second
    const interval = setInterval(calculateElapsed, 1000);

    return () => clearInterval(interval);
  }, [startedAt]);

  // Helper to format seconds into HH:MM:SS or MM:SS
  const formatTime = () => {
    const hours = Math.floor(elapsedSeconds / 3600);
    const minutes = Math.floor((elapsedSeconds % 3600) / 60);
    const seconds = elapsedSeconds % 60;

    const pad = (num) => String(num).padStart(2, "0");

    if (hours > 0) {
      return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
    }
    return `${pad(minutes)}:${pad(seconds)}`;
  };

  return { elapsedSeconds, formattedTime: formatTime() };
};