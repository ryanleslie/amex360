
import { useState, useEffect, useRef } from 'react';

interface UseCountUpOptions {
  end: number;
  duration?: number;
  decimals?: number;
  start?: number;
}

export function useCountUp({ end, duration = 800, decimals = 2, start = 0 }: UseCountUpOptions) {
  const [count, setCount] = useState(start);
  const frameRef = useRef<number>();
  const startTimeRef = useRef<number>();

  useEffect(() => {
    const startAnimation = (timestamp: number) => {
      if (!startTimeRef.current) {
        startTimeRef.current = timestamp;
      }

      const progress = Math.min((timestamp - startTimeRef.current) / duration, 1);
      
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      
      const current = start + (end - start) * easeOutQuart;
      setCount(current);

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(startAnimation);
      }
    };

    // Reset for new animation
    startTimeRef.current = undefined;
    frameRef.current = requestAnimationFrame(startAnimation);

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [end, duration, start]);

  // Format the number based on decimals
  return Number(count.toFixed(decimals));
}
