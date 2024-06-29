import { createTheme } from '@mui/material/styles';

export const themeConfig = {
  boxShadows: {
    box: '1px 1px 10px 2px rgba(0, 0, 0, 0.1)',
    chatWidgetPreviewPopOver: '1px 1px 10px 2px #0000001A',
  },
  colors: {
    primary: '#2d3a47',
    tertiary: '#FEF2E9',
    tertiaryDark: '#FFE2CC',
    background: '#FBFBFB',
    white: '#ffffff',
    statusOverdue: '#e03b24',
    charcoal: '#2D3A47',
    linkColor: '#2075f5',
    validationError: '#E03B24',
    optional: '#909090',
    borderNoError: '#c4c4c4',
    bgColorOptionTwo: '#F2F4F6',
    cardGridItemBorder: '#DFE4ED',
    iconColorOrange: '#F57B20',
    mercury: '#E9E9E9',
    extraLightBlack: '#00000080',
    extraLightCharcoal: '#2D3A4773',
    chatBotSilverFooter: '#F3F3F3',
    extraLightSilver: '#0000001A',
    extraLightWhiteHover: '#FFFFFF40',
    extraLightBlackHover: '#00000040',
    grayTypingLoading: '#9d9f9f',
  },
};

export const theme = createTheme(themeConfig);

const size = {
  mobileM: '475px',
  mobileL: '565px',
  tabletSm: '650px',
  tablet: '730px',
};

export const device = {
  mobileWidthM: `(max-width: ${size.mobileM})`,
  mobileHeightM: `(max-height: ${size.tabletSm})`,
  mobileL: `(max-width: ${size.mobileL}), (max-height: ${size.tablet})`,
  tablet: `(max-height: ${size.tablet})`,
};
