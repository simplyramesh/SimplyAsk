import { useEffect, useState } from 'react';

import useWindowSize from './useWindowSize';

export const useSidebarScrollStyles = (elementRef) => {
  const [withScroll, setWithScroll] = useState(false);
  const windowSize = useWindowSize();

  useEffect(() => {
    if (elementRef) {
      if (elementRef.current.scrollHeight > elementRef.current.clientHeight) {
        setWithScroll(true);
      } else {
        setWithScroll(false);
      }
    }
  }, [windowSize, elementRef]);

  return withScroll;
};
