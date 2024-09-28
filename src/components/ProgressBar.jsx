import { useEffect, useState } from "react";

export default function ProgressBar({ TIMER, open }) {
  // Receive open prop
  const [remainingTime, setRemainingTime] = useState(TIMER);

  useEffect(() => {
    let interval;
    if (open) {
      // Start timer only if open is true
      interval = setInterval(() => {
        setRemainingTime((prevTime) => {
          if (prevTime <= 0) {
            clearInterval(interval);
            return 0;
          }
          return prevTime - 10;
        });
      }, 10);
    } else {
      setRemainingTime(TIMER); // Reset timer if open is false
    }

    return () => {
      clearInterval(interval);
    };
  }, [TIMER, open]); // Add open as a dependency

  return <progress value={remainingTime} max={TIMER} />;
}
