const sideModalWidths = {
  FIXED_LARGE_SCREENS: '650px',
  LARGE_SCREENS: '600px',
  MEDIUM_SCREENS: '450px',
  SMALL_SCREENS: '370px',
};

export function useFixedSideModalWidth() {
  const sideModalWidth = sideModalWidths.FIXED_LARGE_SCREENS;

  return sideModalWidth;
}
