import { useEffect, useState } from 'react';

export const useCycledStrings = (stringsArray, interval = 5000) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % (stringsArray.length - 1));
    }, interval);

    return () => clearInterval(intervalId);
  }, [stringsArray, interval]);

  return stringsArray[currentIndex];
};
