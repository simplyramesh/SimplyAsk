import { useEffect, useState } from 'react';

import { sideModalScreens, sideModalWidths } from '../config/sideModalWidth';

import useWindowSize from './useWindowSize';

export function useFixedSideModalWidth(isMediumFixedWidth = false, isSmallFixedWidth = false) {
  let sideModalWidth = sideModalWidths.FIXED_LARGE_SCREENS;

  if (isMediumFixedWidth)sideModalWidth = sideModalWidths.FIXED_MEDIUM_SCREENS;
  if (isSmallFixedWidth)sideModalWidth = sideModalWidths.FIXED_SMALL_SCREENS;

  return sideModalWidth;
}

function useSideModalWidth() {
  const [sideModalWidth, setSideModalWidth] = useState();
  const size = useWindowSize();
  useEffect(() => {
    if (size.width > sideModalScreens.LARGE_SCREENS) {
      setSideModalWidth(sideModalWidths.LARGE_SCREENS);
    } else if (size.width > sideModalScreens.MEDIUM_SCREENS) {
      setSideModalWidth(sideModalWidths.MEDIUM_SCREENS);
    } else {
      setSideModalWidth(sideModalWidths.SMALL_SCREENS);
    }
  }, [size.width]);

  return sideModalWidth;
}

export default useSideModalWidth;
