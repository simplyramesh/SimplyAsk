import isPropValid from '@emotion/is-prop-valid';
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { Button, Tooltip, tooltipClasses, Stack } from '@mui/material';
import { styled as styledTooltip, useTheme } from '@mui/material/styles';
import SvgIcon from '@mui/material/SvgIcon';
import { keyframes } from '@mui/system';

import PoweredIcon from '../../../assets/SimplyAskCharcoal.svg?component';
import { device } from '../../../config/theme';

export const StyledFlex = styled(Stack, {
  shouldForwardProp: (prop) => !['cursor', 'transform', 'hoverBg', 'backgroundColor'].includes(prop),
})(({ cursor, transform, hoverBg, backgroundColor }) => ({
  fontFamily: 'Montserrat',
  cursor: cursor || 'unset',
  transform: transform || 'none',
  transition: 'all 200ms ease-in',
  backgroundColor: backgroundColor || 'transparent',

  '&:hover': {
    ...(hoverBg && { backgroundColor: hoverBg }),
  },
}));

const cssTruncateText = ({ maxLines }) => {
  if (!maxLines) {
    return css``;
  }

  return css`
    display: -webkit-box;
    -webkit-line-clamp: ${maxLines};
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
  `;
};

export const StyledText = styled('span', {
  shouldForwardProp: (prop) =>
    isPropValid(prop) &&
    prop !== 'display' &&
    prop !== 'textAlign' &&
    prop !== 'size' &&
    prop !== 'weight' &&
    prop !== 'color' &&
    prop !== 'themeColor' &&
    prop !== 'cursor' &&
    prop !== 'lh' &&
    prop !== 'mt' &&
    prop !== 'mb' &&
    prop !== 'p' &&
    prop !== 'wrap' &&
    prop !== 'capitalize' &&
    prop !== 'uppercase' &&
    prop !== 'textDecoration' &&
    prop !== 'maxLines' &&
    prop !== 'width' &&
    prop !== 'wordBreak' &&
    prop !== 'smSize' &&
    prop !== 'smMt' &&
    prop !== 'opacity',
})`
  margin: 0;
  padding: ${({ p }) => p || 0};
  font-family: 'Montserrat';
  font-size: ${({ size }) => (size ? `${size}px` : '16px')};
  font-weight: ${({ weight }) => (weight ? `${weight}` : '400')};
  font-style: normal;
  color: ${({ color }) => (color ? `${color}` : '#2d3a47')};
  cursor: ${({ cursor }) => cursor || 'inherit'};
  line-height: ${({ lh, size }) => (lh ? `${lh}px` : `${(size || 16) * ((1 + Math.sqrt(5)) / 2)}px`)};
  margin-bottom: ${({ mb }) => (mb ? `${mb}px` : '0px')};
  margin-top: ${({ mt }) => (mt ? `${mt}px` : '0px')};
  white-space: ${({ wrap }) => (!wrap ? 'normal' : wrap)};
  word-break: ${({ wordBreak }) => (!wordBreak ? 'unset' : wordBreak)};
  text-transform: ${({ capitalize, uppercase }) =>
    (capitalize && 'capitalize') || (uppercase && 'uppercase') || 'none'};
  text-align: ${({ textAlign }) => textAlign || 'left'};
  display: ${({ display }) => display || 'block'};
  text-decoration: ${({ textDecoration }) => textDecoration || 'none'};
  word-break: ${({ wordBreak }) => wordBreak || 'none'};
  width: ${({ width }) => width || 'auto'};
  opacity: ${({ opacity }) => opacity || 1};
  ${cssTruncateText};

  @media ${device.mobileL} {
    font-size: ${({ smSize }) => (smSize ? `${smSize}px` : '14px')};
    margin-top: ${({ smMt }) => (smMt ? `${smMt}px` : '0px')};
  }
`;

export const StyledCard = styled.div`
  width: ${({ width }) => width || '100%'};
  flex-direction: column;
  box-shadow: ${({ theme }) => theme.boxShadows.box};
  padding: ${({ p }) => p || '22px 18px'};
  display: flex;
  border-radius: ${({ borderRadius }) => borderRadius || '25px'};
  background-color: ${({ theme, bgColor }) => bgColor || theme.colors.white};
`;

export const StyledSubmissionForm = styled('form', {
  shouldForwardProp: (prop) => isPropValid(prop) && !['flex'].includes(prop),
})`
  flex: ${({ flex }) => flex || 'auto'};
`;

export const StyledHiddenInput = styled.input`
  display: none;
`;

export const StyledSettingsDiv = styled(StyledFlex)`
  border-radius: 15px;
  z-index: 5000;
  width: 347px;

  @media ${device.mobileWidthM} {
    width: calc(100vw - 49px);
  }
`;

export const StyledHyperLink = styled.a`
  display: flex;
  justify-content: center;
  align-items: center;
  padding-bottom: 10px;
  gap: 5px;
  transition: all 200ms ease-in;
  text-decoration: none !important;
  cursor: pointer;

  &:hover {
    opacity: 0.7 !important;
  }
`;

export const StyledTextHyperLink = styled.a`
  font-weight: ${({ weight }) => weight || 400};
  font-size: ${({ size }) => size || '10px'};
  transition: all 200ms ease-in;
  text-decoration: none !important;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.linkColor};

  &:hover {
    text-decoration: underline !important;
  }
`;

export const StyledAttachmentButton = styled(Button, {
  shouldForwardProp: (prop) => !['bg', 'color', 'hoverBg'].includes(prop),
})(({ color, bg, hoverBg }) => ({
  minWidth: '24px',
  maxWidth: '24px',
  maxHeight: '27px',
  height: '100%',
  backgroundColor: bg,
  padding: 0,
  color,
  transition: 'all 200ms ease-in',

  '&:hover': {
    ...(hoverBg && { backgroundColor: hoverBg }),
  },
}));

export const SendButton = styled(Button, {
  shouldForwardProp: (prop) => !['bg', 'color', 'hoverBg'].includes(prop),
})(({ color, bg, hoverBg }) => ({
  padding: 0,
  minWidth: '50px',
  maxWidth: '50px',
  height: '26px',
  display: 'flex',
  gap: '3px',
  alignItems: 'center',
  textAlign: 'right',
  justifyContent: 'center',
  backgroundColor: bg,
  color,
  fontSize: '10px',
  fontWeight: 600,
  textTransform: 'inherit',
  position: 'absolute',
  right: '17px',
  transition: 'all 200ms ease-in',

  '&:hover': {
    ...(hoverBg && { backgroundColor: hoverBg }),
  },
}));

export const StyledWidgetImage = styled('img', {
  shouldForwardProp: (prop) => !['width', 'height', 'color'].includes(prop),
})`
  width: fit-content;
  height: ${({ height }) => height || '32px'};
  color: ${({ theme, color }) => color || theme.colors.primary};
  object-fit: contain;
`;

export const StyledPoweredImage = styled(PoweredIcon)`
  height: 14px;
`;

export const StyledHeaderImage = styled('img', {
  shouldForwardProp: (prop) => !['width', 'height'].includes(prop),
})`
  object-fit: contain;
  max-width: 150px;
  max-height: 96px;
`;

export const StyledHr = styled.hr`
  flex: 1;
  border-bottom: ${({ theme }) => theme.colors.primary};
  opacity: 0.8;
`;

export const StyledFlexText = styled(StyledText)`
  flex: 3;
  opacity: 0.8;
`;

export const StyledFileDownloadHyperLink = styled('a', {
  shouldForwardProp: (prop) => !['color', 'borderColor', 'hoverBg'].includes(prop),
})(({ borderColor, color, hoverBg, theme }) => ({
  transition: 'all 200ms ease-in',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '7px',
  textDecoration: 'none !important',
  height: '35px',
  maxWidth: '120px',
  borderRadius: '8px',
  color: color || theme.colors.primary,
  border: '2px solid',
  borderColor: borderColor || theme.colors.primary,
  cursor: 'pointer',
  padding: '8px',

  '&:hover': {
    ...(hoverBg && { backgroundColor: hoverBg }),
  },
}));

export const StyledFileName = styled(StyledText, {
  shouldForwardProp: (prop) => !['color'].includes(prop),
})`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: ${({ theme, color }) => color || theme.colors.primary};

  @media ${device.mobileL} {
    font-size: 8px;
  }
`;

export const StyledTooltip = styledTooltip(
  ({ className, ...props }) => <Tooltip {...props} classes={{ popper: className }} />,
  {
    shouldForwardProp: (prop) => prop !== 'maxWidth',
  }
)(({ maxWidth, p, ff, size, lh, weight, radius, color, bgTooltip, textAlign, boxShadow }) => {
  const { colors } = useTheme();
  return {
    zIndex: 5003,

    [`& .${tooltipClasses.tooltip}`]: {
      maxWidth: maxWidth || '214px',
      padding: p || '14px 22px',
      fontFamily: ff || 'Montserrat',
      fontSize: size || '14px',
      lineHeight: lh || 'inherit',
      fontWeight: weight || 400,
      color: color || colors.white,
      textAlign: textAlign || 'center',
      background: bgTooltip || colors.primary,
      borderRadius: radius || '10px',
      boxShadow: boxShadow || 'none',
    },

    [`& .${tooltipClasses.arrow}`]: {
      color: bgTooltip || colors.primary,

      '&:before': {
        borderRadius: '0 0 5px 0',
      },
    },
  };
});

export const StyledWidgetNotification = styled('div', {
  shouldForwardProp: (prop) => !['bgColor', 'color'].includes(prop),
})`
  width: 27px;
  height: 27px;
  border-radius: 50%;
  position: absolute;
  bottom: 51px;
  right: 0px;
  background: ${({ theme, bgColor }) => bgColor || theme.colors.statusOverdue};
  color: ${({ theme, color }) => color || theme.colors.white};
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;

  @media ${device.mobileL} {
    width: 22px;
    height: 22px;
    bottom: 48px;
    right: 2px;
  }
`;

export const StyledWidgetPreviewCircularButton = styled(Button, {
  shouldForwardProp: (prop) =>
    !['transform', 'bgColor', 'color', 'hoverBg', 'visibility', 'opacity', 'margin'].includes(prop),
})`
  width: 72px;
  height: 72px;
  background-color: ${({ theme, bgColor }) => bgColor || theme.colors.primary};
  color: ${({ theme, color }) => color || theme.colors.white};
  border-radius: 50%;
  box-shadow: ${({ theme }) => theme.boxShadows.chatWidgetPreviewPopOver};
  margin: ${({ margin }) => margin};
  transition:
    visibility 250ms ease 0s,
    opacity 250ms ease 0s,
    transform 250ms ease 0s,
    background-color 250ms ease-in;
  transform: ${({ transform }) => transform};
  visibility: ${({ visibility }) => visibility};
  opacity: ${({ opacity }) => opacity};

  &:hover {
    background-color: ${({ hoverBg }) => hoverBg};
  }

  @media ${device.mobileL} {
    width: 65px;
    height: 65px;
  }
`;

export const WidgetRoot = styled(StyledFlex, {
  shouldForwardProp: (prop) => !['transform', 'visibility', 'opacity'].includes(prop),
})`
  transition:
    transform 200ms ease 0s,
    opacity 200ms ease 0s,
    visibility 0ms;
  transform: ${({ transform }) => transform};
  visibility: ${({ visibility }) => visibility};
  opacity: ${({ opacity }) => opacity};
`;

export const TransitionContainer = styled.div`
  transition: 700ms;
  width: 346px;
  height: 200px;
  z-index: 1;
  bottom: -6px;
  transform: translateY(${({ state }) => (state === 'entering' || state === 'entered' ? 0 : 200)}px);

  position: absolute;
`;

export const StyledFlexContainerRoot = styled(StyledFlex)`
  height: 665px;
  width: 346px;

  @media ${device.mobileL} {
    height: 585px;
  }

  @media ${device.mobileHeightM} {
    height: calc(100vh - 40px);
  }

  @media ${device.mobileWidthM} {
    width: calc(100vw - 48px);
    height: calc(100vh - 40px);
  }
`;

const bounce = keyframes`
  0% {
    transform: translateY(-4px);
  }
  50% {
    transform: translateY(4px);
  }
  100% {
    transform: translateY(-4px);
  }
`;

export const TypingBalls = styled.div`
  display: flex;
  align-items: center;
  margin: 2px 3px;
  width: 30px;
  height: 10px;
  position: relative;

  & > span {
    width: 8px;
    height: 8px;
    background-color: ${({ theme }) => theme.colors.grayTypingLoading};
    display: flex;
    margin: 1.5px;
    border-radius: 50%;
    position: absolute;

    &:nth-child(1) {
      animation: ${bounce} 1.2s infinite;
    }
    &:nth-child(2) {
      animation: ${bounce} 1.2s infinite 0.2s;
      margin-left: 12.5px;
    }
    &:nth-child(3) {
      animation: ${bounce} 1.2s infinite 0.4s;
      margin-left: 23px;
    }
  }
`;

export const RootSvgIcon = styled(SvgIcon)`
  width: 33px;
  height: 33px;

  @media ${device.mobileL} {
    width: 29px;
    height: 29px;
  }
`;
