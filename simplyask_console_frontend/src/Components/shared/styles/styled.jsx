import isPropValid from '@emotion/is-prop-valid';
import { css, keyframes } from '@emotion/react';
import styled from '@emotion/styled';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Avatar,
  Button,
  Checkbox,
  CircularProgress,
  Divider,
  FormControl,
  FormControlLabel,
  IconButton,
  Popover,
  Radio,
  Slider,
  Stack,
  Switch,
  Tab,
  Tabs,
  TextareaAutosize,
  TextField,
  ToggleButton,
} from '@mui/material';
import { Panel, PanelResizeHandle } from 'react-resizable-panels';
import { Link } from 'react-router-dom';

import arrowDropDown from '../../../Assets/icons/arrowDropDown.svg';
import arrowDropUp from '../../../Assets/icons/arrowDropUp.svg';
import { GreyStyledButton } from '../REDISIGNED/controls/Button/StyledButton';

const cssTruncateText = ({ maxLines, ellipsis }) => {
  if (maxLines) {
    return css`
      display: -webkit-box;
      -webkit-line-clamp: ${maxLines};
      -webkit-box-orient: vertical;
      overflow: hidden;
      text-overflow: ellipsis;
    `;
  }

  if (ellipsis) {
    return css`
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    `;
  }

  return css``;
};

const fadeInAnimation = keyframes`
    from {
        opacity: 0;
    }

    to {
        opacity: 1;
    }
`;

export const StyledCard = styled.div`
  width: ${({ width }) => width || '100%'};
  height: ${({ height }) => height || 'unset'};
  flex-direction: column;
  box-shadow: ${({ theme }) => theme.boxShadows.box};
  padding: ${({ p }) => p || '22px 18px'};
  display: flex;
  border-radius: ${({ borderRadius }) => borderRadius || '25px'};
  background-color: ${({ theme, bgColor }) => bgColor || theme.colors.white};
`;

export const StyledDivider = styled(Divider, {
  shouldForwardProp: (prop) => !['borderWidth', 'm', 'color', 'height'].includes(prop),
})`
  ${({ orientation, borderWidth }) =>
    orientation !== 'vertical' &&
    `
    border-bottom-width: ${borderWidth ? `${borderWidth}px` : '1px'};
  `};

  ${({ orientation, borderWidth }) =>
    orientation === 'vertical' &&
    `
    border-right-width: ${borderWidth ? `${borderWidth}px` : '1px'};
  `};

  border-color: ${({ theme, color }) => color || theme.colors.dividerColor};
  margin: ${({ m }) => m || 0};
  ${({ height }) => height && `height: ${height}`};
`;

export const StyledMediumDivider = styled(Divider)`
  border-width: 1.5px;
  background-color: ${({ theme, color }) => (color ? `${color}` : theme.colors.mediumDividerColor)};
`;

export const StyledFlex = styled(Stack, {
  shouldForwardProp: (prop) => !['cursor', 'transform', 'ff', 'minWidth', 'opacity', 'onResize'].includes(prop),
})`
  font-family: ${({ ff }) => ff || 'Montserrat'};
  cursor: ${({ cursor }) => cursor || 'unset'};
  transform: ${({ transform }) => transform || 'none'};
  opacity: ${({ opacity }) => opacity || 1};
  min-width: ${({ minWidth }) => minWidth ?? 'unset'};
`;

export const StyledInlineFlex = styled.div`
  display: inline-flex;
`;

export const StyledDivOnHover = styled.div`
  &:hover {
    background-color: ${({ theme }) => theme.colors.altoGray};
  }
`;

export const StyledRowHoverText = styled.div`
  &:hover {
    & > span {
      color: ${({ theme }) => theme.colors.linkColor};
    }
  }
`;

export const StyledCellHoverText = styled('div', {
  shouldForwardProp: (prop) => !['pointer', 'underline'].includes(prop),
})`
  cursor: ${({ pointer }) => (pointer ? 'pointer' : 'default')};

  &:hover {
    color: ${({ theme }) => theme.colors.linkColor};
    text-decoration: ${({ underline }) => (underline ? 'underline' : 'none')};
  }
`;

export const StyledLink = styled(Link, {
  shouldForwardProp: (prop) =>
    isPropValid(prop) && !['underline', 'themeColor', 'themeHoverColor', 'hoverUnderline', 'cursor'].includes(prop),
})`
  cursor: ${({ cursor }) => cursor || 'pointer'};
  color: ${({ theme, themeColor }) => (themeColor ? theme.colors[themeColor] : theme.colors.linkColor)};
  text-decoration: ${({ underline }) => (underline ? 'underline' : 'none')};
  &:hover {
    color: ${({ theme, themeColor, themeHoverColor }) =>
      themeHoverColor || themeColor ? theme.colors[themeHoverColor || themeColor] : theme.colors.linkColor};
    text-decoration: ${({ hoverUnderline, underline }) => (hoverUnderline || underline ? 'underline' : 'none')};
  }
`;

export const StyledText = styled('span', {
  shouldForwardProp: (prop) =>
    isPropValid(prop) &&
    prop !== 'display' &&
    prop !== 'flex' &&
    prop !== 'textAlign' &&
    prop !== 'size' &&
    prop !== 'weight' &&
    prop !== 'color' &&
    prop !== 'themeColor' &&
    prop !== 'cursor' &&
    prop !== 'ff' &&
    prop !== 'lh' &&
    prop !== 'mt' &&
    prop !== 'ml' &&
    prop !== 'mb' &&
    prop !== 'mr' &&
    prop !== 'p' &&
    prop !== 'wrap' &&
    prop !== 'capitalize' &&
    prop !== 'uppercase' &&
    prop !== 'textDecoration' &&
    prop !== 'maxLines' &&
    prop !== 'width' &&
    prop !== 'maxWidth' &&
    prop !== 'wordBreak',
})`
  margin: 0;
  padding: ${({ p }) => p || 0};
  font-family: ${({ ff }) => ff || 'Montserrat'};
  font-size: ${({ size }) => (size ? `${size}px` : '16px')};
  font-weight: ${({ weight }) => (weight ? `${weight}` : '400')};
  font-style: normal;
  color: ${({ theme, color, themeColor }) => (color ? `${color}` : themeColor ? theme.colors[themeColor] : '#2d3a47')};
  cursor: ${({ cursor }) => cursor || 'inherit'};
  line-height: ${({ lh, size }) => (lh ? `${lh}px` : `${(size || 16) * ((1 + Math.sqrt(5)) / 2)}px`)};
  margin-bottom: ${({ mb }) => (mb ? `${mb}px` : '0px')};
  margin-top: ${({ mt }) => (mt ? `${mt}px` : '0px')};
  margin-left: ${({ ml }) => (ml ? `${ml}px` : '0px')};
  margin-right: ${({ mr }) => (mr ? `${mr}px` : '0px')};
  white-space: ${({ wrap }) => (!wrap ? 'normal' : wrap)};
  word-break: ${({ wordBreak }) => (!wordBreak ? 'unset' : wordBreak)};
  text-transform: ${({ capitalize, uppercase }) =>
    (capitalize && 'capitalize') || (uppercase && 'uppercase') || 'none'};
  text-align: ${({ textAlign }) => textAlign || 'left'};
  display: ${({ display }) => display || 'block'};
  text-decoration: ${({ textDecoration }) => textDecoration || 'none'};
  word-break: ${({ wordBreak }) => wordBreak || 'none'};
  width: ${({ width }) => width || 'auto'};
  max-width: ${({ maxWidth }) => maxWidth || 'auto'};
  justify-content: ${({ justifyContent }) => justifyContent || 'inherit'};
  flex: ${({ flex }) => flex || 'inherit'};
  ${cssTruncateText};
`;

export const StyledCheckbox = styled(Checkbox)`
  color: ${({ theme }) => theme.colors.primary};

  &.Mui-checked,
  &.MuiCheckbox-indeterminate {
    color: ${({ theme }) => theme.colors.secondary};
  }
`;

export const StyledAccordion = styled(Accordion, {
  shouldForwardProp: (prop) =>
    !['width', 'fontSize', 'bgColor', 'color', 'fontWeight', 'boxShadow', 'rootBorderRadius'].includes(prop),
})`
  border: none;
  box-shadow: ${({ boxShadow }) => boxShadow || 'none'};
  border-radius: 0;
  background-color: ${({ bgColor }) => bgColor || 'transparent'};
  margin: 0;
  padding: 0;
  width: 100%;

  ::before {
    display: none;
  }

  &.MuiPaper-root {
    margin: 0;
    border-radius: ${({ rootBorderRadius }) => rootBorderRadius || '0'};
  }
`;

export const StyledAccordionSummary = styled(AccordionSummary, {
  shouldForwardProp: (prop) =>
    !['p', 'iconWidth', 'hoverBg', 'borderRadius', 'flexGrow', 'iconColor', 'justifyContent', 'margin'].includes(prop),
})`
  padding: ${({ p }) => p || '28px 0'};
  margin: ${({ margin }) => margin || '0'};
  border-radius: ${({ borderRadius }) => borderRadius || '0px'};
  ${({ justifyContent }) => justifyContent && `justify-content: ${justifyContent}`};

  &:hover {
    background-color: ${({ theme, hoverBg }) => hoverBg || theme.colors.accordionHover};
  }

  & .MuiAccordionSummary-content,
  .MuiAccordionSummary-content.Mui-expanded {
    margin: 0;
    ${({ flexGrow }) => flexGrow && `flex-grow: ${flexGrow}`};
  }

  & .MuiAccordionSummary-expandIconWrapper .MuiSvgIcon-root {
    color: ${({ iconColor, theme }) => iconColor || theme.colors.primary};
    width: ${({ iconWidth }) => iconWidth || '32px'};
    height: ${({ iconWidth }) => iconWidth || '32px'};
  }
`;

export const StyledAccordionDetails = styled(AccordionDetails, {
  shouldForwardProp: (prop) => !['p', 'm', 'mb'].includes(prop),
})(({ p, m, mb }) => ({
  padding: p || '0',
  ...(m && { margin: m }),
  ...(mb && { marginBottom: mb }),
}));

export const StyledZoomSlider = styled(Slider)`
  height: 8px;
  color: ${({ theme }) => theme.colors.secondary};

  & .MuiSlider-thumb {
    width: 18px;
    height: 18px;
    background-color: ${({ theme }) => theme.colors.white};
    border: 2px solid ${({ theme }) => theme.colors.secondary};
    transition:
      background-color 250ms ease-in-out,
      border 250ms ease-in-out;

    &:hover {
      background-color: ${({ theme }) => theme.colors.secondary};
      border: 2px solid ${({ theme }) => theme.colors.white};
      box-shadow: ${({ theme }) => theme.boxShadows.box};
    }

    &::before {
      box-shadow: ${({ theme }) => theme.boxShadows.box};
    }
  }

  & .MuiSlider-track {
    background-color: ${({ theme }) => theme.colors.secondary};
    border: 2px solid ${({ theme }) => `${theme.colors.secondary}50`};
    opacity: 1;
  }

  & .MuiSlider-rail {
    background-color: ${({ theme }) => theme.colors.secondary};
    border: 2px solid ${({ theme }) => theme.colors.secondary};
    opacity: 0.5;
  }
`;

export const StyledStatus = styled('div', {
  shouldForwardProp: (prop) =>
    isPropValid(prop) &&
    !['color', 'minWidth', 'maxWidth', 'width', 'height', 'bgColor', 'textColor', 'hoverBgColor'].includes(prop),
})`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: ${({ minWidth }) => minWidth || '128px'};
  max-width: ${({ maxWidth }) => maxWidth || 'auto'};
  height: ${({ height }) => height || '41px'};
  line-height: ${({ height }) => height || '41px'};
  border-radius: 10px;
  padding: 0 15px;
  font-size: 15px;
  font-weight: 600;
  width: ${({ width }) => width || 'auto'};
  color: ${({ theme, color, textColor }) => textColor || theme.statusColors[color]?.color};
  background-color: ${({ theme, color, bgColor }) => bgColor || theme.statusColors[color]?.bg};
  position: relative;
  ${({ hoverBgColor }) => hoverBgColor && `&:hover { background-color: ${hoverBgColor}; }`}
`;

export const StyledStage = styled(StyledFlex)`
  gap: 6px 0;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  min-width: 160px;
  padding: 18px 0;
  font-size: 15px;
  font-weight: 600;
  line-height: 18px;
  pointer-events: ${({ pointerEvents }) => pointerEvents || 'auto'};
  cursor: ${({ cursor }) => cursor || 'default'};

  color: ${({ theme, color }) => theme.statusColors[color]?.color};
  background-color: ${({ theme, color }) => theme.statusColors[color]?.bg};

  & p:last-child {
    margin: 0;
    padding: 0;
    font-size: 12px;
    font-weight: 500;
    line-height: 15px;
    text-transform: capitalize;
    color: ${({ theme }) => theme.colors.primary};
  }
`;

export const StyledRadio = styled(Radio)`
  color: ${({ theme }) => theme.colors.primary};

  &.Mui-checked {
    color: ${({ theme }) => theme.colors.secondary};
  }

  & .MuiSvgIcon-root {
    font-size: 18px;

    &[data-testId='RadioButtonCheckedIcon'] {
      font-size: 22px;
      margin: calc((18px - 22px) / 2);
    }
  }

  &:hover {
    background-color: transparent;
  }
`;

export const StyledFormControlLabel = styled(FormControlLabel, {
  shouldForwardProp: (prop) => !['size'].includes(prop),
})`
  &:last-child {
    margin-right: 0;
  }

  & .MuiFormControlLabel-label {
    font-size: ${({ size }) => (size ? `${size}px` : '16px')};
    font-weight: 400;
    line-height: 21px;
    color: ${({ theme }) => theme.colors.primary};
    font-family: 'Montserrat';
  }
`;

export const StyledTextField = styled(TextField, {
  shouldForwardProp: (prop) =>
    ![
      'isDisabled',
      'fontSize',
      'fontWeight',
      'lineHeight',
      'width',
      'minHeight',
      'height',
      'p',
      'ff',
      'borderRadius',
      'borderColor',
      'invalid',
      'maxLength',
      'textColor',
      'bgColor',
      'readOnly',
    ].includes(prop),
})`
  font-family: ${({ ff }) => ff || 'Montserrat'};
  border-radius: ${({ borderRadius }) => borderRadius || '10px'};
  border: 1px solid ${({ theme, borderColor }) => borderColor || theme.colors.altoGray};
  width: ${({ width }) => width || '100%'};
  min-height: ${({ minHeight }) => minHeight || '41px'};
  height: ${({ height }) => height || 'auto'};
  padding: ${({ p }) => p || '4px 10px'};
  outline: none;
  ${({ bgColor }) => (bgColor ? `background-color: ${bgColor};` : '')};
  pointer-events: ${({ readOnly }) => (readOnly ? 'none' : 'all')};
  appearance: none;

  & .MuiInputBase-root {
    font-family: 'Montserrat';
    font-size: ${({ fontSize }) => fontSize || '15px'};
    font-weight: ${({ fontWeight }) => fontWeight || '400'};
    line-height: ${({ lineHeight }) => lineHeight || '20px'};
    color: ${({ theme, textColor }) => textColor || theme.colors.primary};

    outline: none;
    border: 0;

    &::before,
    &::after {
      display: none;
    }
  }

  &:focus,
  &:focus-within,
  &:hover {
    border: 1px solid ${({ theme, borderColor }) => borderColor || theme.colors.primary};
  }

  ${({ theme, invalid }) =>
    invalid &&
    `
      border: 1px solid ${theme.colors.validationError};
  
      &:focus,
      &:focus-within,
      &:hover {
        border: 1px solid ${theme.colors.validationError};
      }
    `}

  ${({ theme, invalid, maxLength }) =>
    maxLength &&
    `
      & .MuiFormHelperText-root {
        font-family: 'Montserrat';
        position: absolute;
        right: -6px;
        bottom: -23px;
        font-size: 12px;
        line-height: 18px;
        color: ${!invalid ? theme.colors.primary : theme.colors.validationError};
      }
    `}
    
    ${({ theme, isDisabled }) =>
    isDisabled &&
    `
      background-color: ${theme.colors.disabledBtnBg};
      pointer-events: none;
  
      & .MuiInputBase-input {
        pointer-events: none;
      }
    `}
`;

export const StyledTextareaAutosize = styled(TextareaAutosize, {
  shouldForwardProp: (prop) =>
    ![
      'isDisabled',
      'fontSize',
      'fontWeight',
      'lineHeight',
      'width',
      'minHeight',
      'height',
      'p',
      'ff',
      'borderRadius',
      'borderColor',
      'invalid',
      'maxLength',
      'textColor',
      'bgColor',
      'readOnly',
      'secured',
    ].includes(prop),
})`
  font-family: ${({ ff }) => ff || 'Montserrat'};
  border-radius: ${({ borderRadius }) => borderRadius || '10px'};
  border: 1px solid ${({ theme, borderColor }) => borderColor || theme.colors.altoGray};
  max-width: 100%;
  width: ${({ width }) => width || '100%'};
  height: ${({ height }) => height || '41px'};
  padding: ${({ p }) => p || '9px 10px 10px'};
  outline: none;
  ${({ bgColor }) => (bgColor ? `background-color: ${bgColor};` : '')};
  pointer-events: ${({ readOnly }) => (readOnly ? 'none' : 'all')};

  font-size: ${({ fontSize }) => fontSize || '15px'};
  font-weight: ${({ fontWeight }) => fontWeight || '400'};
  line-height: ${({ lineHeight }) => lineHeight || '20px'};
  color: ${({ theme, textColor }) => textColor || theme.colors.primary};
  resize: none;
  -webkit-text-security: ${({ secured }) => secured ? 'disc' : 'none'};

  &::placeholder {
    color: ${({ theme }) => theme.colors.optional};
    opacity: 0.5;
  }

  &:focus,
  &:focus-within,
  &:hover {
    border: 1px solid ${({ theme, borderColor }) => borderColor || theme.colors.primary};
  }

  ${({ theme, invalid }) =>
    invalid &&
    `
      border: 1px solid ${theme.colors.validationError};
  
      &:focus,
      &:focus-within,
      &:hover {
        border: 1px solid ${theme.colors.validationError};
      }
    `}

  ${({ theme, invalid, maxLength }) =>
    maxLength &&
    `
      & .MuiFormHelperText-root {
        font-family: 'Montserrat';
        position: absolute;
        right: -6px;
        bottom: -23px;
        font-size: 12px;
        line-height: 18px;
        color: ${!invalid ? theme.colors.primary : theme.colors.validationError};
      }
    `}

    ${({ theme, isDisabled }) =>
    isDisabled &&
    `
      background-color: ${theme.colors.disabledBtnBg};
      pointer-events: none;
  
      & .MuiInputBase-input {
        pointer-events: none;
      }
    `}
`;

export const StyledImgLogoUpload = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
`;

export const StyledImgLogoUploadContainer = styled.div`
  width: 92px;
  height: 70px;
  border: 2px solid ${({ theme }) => theme.colors.lightGrey};
  margin-left: -18px;
  border-radius: 10px;
  background-color: ${({ theme }) => theme.colors.white};
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2px;

  &:hover {
    border: 2px solid ${({ theme }) => theme.colors.black};
  }
`;

export const StyledIconWrapper = styled(StyledFlex)`
  color: ${({ theme, color }) => color || theme.colors.white};
  background-color: ${({ theme, backgroundColor }) => backgroundColor || theme.colors.primary};
  border-radius: 50%;
  width: 18px;
  height: 18px;
  justify-content: center;
  align-items: center;
  font-size: 13px;
`;

export const StyledSwitch = styled(
  (props) => <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />,
  {
    shouldForwardProp: (prop) => isPropValid(prop) && !['withCheck'].includes(prop),
  }
)(({ theme, withCheck }) => {
  const checkIconSvgAttrs = 'xmlns="http://www.w3.org/2000/svg" height="18" width="18" viewBox="0 0 24 24"';
  const checkIconFill = `fill="${encodeURIComponent(theme.colors.white)}"`;
  const checkIconPathData =
    'd="M9 16.17 5.53 12.7a.9959.9959 0 0 0-1.41 0c-.39.39-.39 1.02 0 1.41l4.18 4.18c.39.39 1.02.39 1.41 0L20.29 7.71c.39-.39.39-1.02 0-1.41a.9959.9959 0 0 0-1.41 0z"';

  return {
    width: 51,
    height: 28.05,
    padding: 0,
    '& .MuiSwitch-switchBase': {
      padding: 4.25,
      margin: 0,
      transitionDuration: '300ms',
      '&.Mui-checked': {
        transform: 'translateX(22.75px)',
        color: theme.colors.white,
        '& + .MuiSwitch-track': {
          backgroundColor: theme.colors.secondary,
          opacity: 1,
          border: 0,
        },
        '&.Mui-disabled + .MuiSwitch-track': {
          opacity: 0.5,
        },
      },
      '&.Mui-focusVisible .MuiSwitch-thumb': {
        color: theme.colors.white,
        border: `6px solid ${theme.colors.white}`,
        boxShadow: 'none',
      },
      '&.Mui-disabled .MuiSwitch-thumb': {
        color: theme.colors.inputBorder,
      },
      '&.Mui-disabled + .MuiSwitch-track': {
        opacity: 0.7,
      },
    },
    '& .MuiSwitch-thumb': {
      boxSizing: 'border-box',
      width: 19.55,
      height: 19.55,
      boxShadow: 'none',
    },
    '& .MuiSwitch-track': {
      borderRadius: 16,
      backgroundColor: theme.colors.primary,
      opacity: 1,
      transition: theme.transitions.create(['background-color'], {
        duration: 500,
      }),
      ...(withCheck && {
        '&::before, &::after': {
          content: '""',
          position: 'absolute',
          top: '50%',
          transform: 'translateY(-50%)',
          width: 18,
          height: 18,
        },
        '&::before': {
          '& path': {
            fill: theme.colors.white,
          },
          backgroundImage: `url('data:image/svg+xml;utf8,<svg ${checkIconSvgAttrs}><path ${checkIconFill} ${checkIconPathData}/></svg>')`,
          left: 6,
        },
      }),
    },
  };
});

export const StyledAvatar = styled(Avatar, {
  shouldForwardProp: (prop) =>
    isPropValid(prop) && !['width', 'fontSize', 'bgColor', 'color', 'fontWeight'].includes(prop),
})`
  width: ${({ width }) => width || '34px'};
  height: ${({ width }) => width || '34px'};
  background-color: ${({ theme, bgColor }) => bgColor || theme.colors.primary};
  font-family: Montserrat;
  font-style: normal;
  font-size: ${({ fontSize }) => fontSize || '1.25rem'};
  font-weight: ${({ fontWeight }) => fontWeight || '400'};
  color: ${({ theme, color }) => color || theme.colors.white};
`;

export const StyledRowHoverActionCellIconWrapper = styled(StyledFlex)(({ theme }) => ({
  display: 'none',
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '25px',
  cursor: 'pointer',
  backgroundColor: theme.colors.antiFlashWhite,
  boxShadow: theme.boxShadows.rowHoverAction,
}));

export const StyledToggleButton = styled(ToggleButton, {
  shouldForwardProp: (prop) => isPropValid(prop),
})`
  font-family: Montserrat;
  font-style: normal;
  border: 2px solid ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.primary};
  border-radius: 8px;
  text-transform: unset;
  font-weight: 600;
  font-size: 15px;
  line-height: 20px;

  &.Mui-selected {
    color: ${({ theme }) => theme.colors.secondary};
    background-color: ${({ theme }) => theme.colors.secondaryBg};
    border-color: ${({ theme }) => theme.colors.secondary};
    pointer-events: none;

    &:hover {
      background-color: ${({ theme }) => theme.colors.secondaryBg};
    }
  }
`;

export const StyledResizeHandle = styled(PanelResizeHandle)`
  position: relative;
  width: 12px;
  height: 100%;
  border-right: 4px solid transparent;

  &:hover,
  &:focus {
    border-color: ${({ theme }) => theme.colors.tableEditableCellFocusBorder};
  }
`;

export const StyledPanelSlider = styled(Panel, {
  shouldForwardProp: (prop) => isPropValid(prop) && !['isOpen'].includes(prop),
})`
  background-color: ${({ theme }) => theme.colors.white};
  transition: flex 0.3s linear;

  ${({ isOpen }) =>
    !isOpen &&
    `
    flex: 0 !important;
  `}
`;

export const StyledExpandButton = styled('button', {
  shouldForwardProp: (prop) => isPropValid(prop) && !['top', 'bottom', 'left', 'right'].includes(prop),
})`
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 55px;
  bottom: ${({ bottom }) => bottom || 'auto'};
  right: ${({ right }) => right || 'auto'};
  left: ${({ left }) => left || 'auto'};
  top: ${({ top }) => top || 'auto'};
  background-color: ${({ theme }) => theme.colors.white};
  border-radius: 15px 0 0 15px;
  border: 0;
  box-shadow: ${({ theme }) => theme.boxShadows.panelExpandButton};
  color: ${({ theme }) => theme.colors.primary};
  transition: color 0.3s;
  cursor: pointer;

  &:hover {
    color: ${({ theme }) => theme.colors.secondary};
  }
`;

export const StyledEmptyValue = styled.span`
  &::after {
    content: '---';
  }
  color: ${({ theme }) => theme.colors.charcoal};
`;

export const StyledPopover = styled(Popover)`
  & .MuiPopover-paper {
    box-shadow: ${({ theme }) => theme.boxShadows.box};
    border-radius: 10px;
    background: ${({ theme }) => theme.colors.white};
  }
`;

export const StyledSubmissionForm = styled.form`
  // Add css when required
`;

export const StyledColourButton = styled('button', {
  shouldForwardProp: (prop) => isPropValid(prop) && !['bgColor', 'textColor, isSelected'].includes(prop),
})(({ textColor, bgColor, isSelected }) => ({
  width: '50px',
  height: '40px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: `linear-gradient(90deg, ${textColor} 50%, ${bgColor} 50%)`,
  padding: 0,
  border: 0,
  boxShadow: 'none',
  borderRadius: '3px',
  flexGrow: '0',

  [`&:hover ${StyledColourButtonSelected}`]: {
    display: 'flex',
  },

  ...(isSelected && {
    [StyledColourButtonSelected]: {
      display: 'flex',
    },
  }),
}));

export const StyledColourButtonSelected = styled(StyledFlex)(({ theme }) => ({
  display: 'none',
  alignItems: 'center',
  justifyContent: 'center',
  flexGrow: 0,
  backgroundColor: theme.colors.white,
  boxShadow: theme.boxShadows.checkIcon,
  borderRadius: '50%',
  width: '20px',
  height: '20px',
  color: theme.colors.primary,
  fontSize: '18px',
  flexShrink: 0,
  '& .MuiSvgIcon-root': { fontSize: 'inherit' },
}));

export const StyledIconButton = styled(IconButton, {
  shouldForwardProp: (prop) =>
    isPropValid(prop) &&
    !['bgColor', 'hoverBgColor', 'iconColor', 'size', 'iconSize', 'borderRadius', 'padding'].includes(prop),
})(({ theme, bgColor, hoverBgColor, iconColor, size, iconSize, borderRadius, padding }) => ({
  width: size || '18px',
  height: size || '18px',
  backgroundColor: bgColor || theme.colors.palePeach,
  transition: 'background-color 0.3s ease',
  borderRadius: borderRadius || '50%',
  padding: padding || '6px',
  color: iconColor || theme.colors.primary,

  '& .MuiSvgIcon-root': {
    color: iconColor || theme.colors.primary,
    fontSize: iconSize || '18px',
  },

  '&:hover': {
    backgroundColor: hoverBgColor || theme.colors.peachPuff,

    '& .MuiSvgIcon-root': {
      color: iconColor || theme.colors.primary,
    },
  },

  '&.Mui-disabled': {
    opacity: 0.5,
    backgroundColor: bgColor || theme.colors.palePeach,
  },
}));

export const StyledColorSquareContainer = styled.div`
  position: relative;
  display: inline-block;
`;

export const StyledColorSquare = styled.div`
  width: 24px; /* Adjust as needed */
  height: 24px; /* Adjust as needed */
  top: 0;
  left: 0;
  cursor: ${({ cursor }) => cursor || 'pointer'};
  z-index: 2;
  margin-left: ${({ ml }) => ml || '-6px'};
  border-radius: 4px;
  margin-right: ${({ mr }) => mr || '6px'};
  background-color: ${(props) => props.backgroundColor || 'transparent'};
  border: 1px solid;
  border-color: ${({ theme }) => theme.colors.timberwolfGray};
`;

export const StyledNumberWrapper = styled.span`
  position: absolute;

  &:after,
  &:before {
    position: absolute;
    right: 6%;
    width: 16px;
    height: 16px;
    font-size: 10px;
    pointer-events: none;
    background-repeat: no-repeat;
    background-size: contain;
  }

  &:after {
    content: '';
    background-image: url(${arrowDropDown});
    margin-top: -19px;
  }

  &:before {
    content: '';
    background-image: url(${arrowDropUp});
    margin-top: 6px;
  }
`;

export const StyledNumberedInput = styled('input', {
  shouldForwardProp: (prop) => !['height', 'borderColor', 'textAlign', 'invalid'].includes(prop),
})`
  appearance: none;
  resize: none;
  display: flex;
  flex: 1 1 auto;
  align-items: center;
  width: 100%;
  height: ${({ height }) => height || '42px'};
  padding: 10px 16px 10px 14px;
  border: ${({ theme, borderColor }) =>
    borderColor ? `1px solid ${borderColor}` : `1px solid ${theme.colors.borderNoError}`};
  border-radius: 10px;
  outline: none;
  background-color: ${({ theme }) => theme.colors.white};
  font-size: 16px;
  font-weight: 400;
  font-style: normal;
  color: ${({ theme }) => theme.colors.primary};
  text-align: ${({ textAlign }) => textAlign || 'left'};

  &::-webkit-inner-spin-button,
  &::-webkit-outer-spin-button {
    opacity: 0;
    width: 40px;
    height: 40px;
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.optional};
  }

  &:focus {
    border: ${({ theme, borderColor }) =>
      borderColor ? `1px solid ${borderColor}` : `1px solid ${theme.colors.primary}`};
  }

  ${({ theme, invalid }) => invalid && `border: 1px solid ${theme.colors.validationError} !important;`}
`;

export const CustomGreyStyledButton = styled(GreyStyledButton)((props) => ({
  justifyContent: 'flex-start',
  height: props.height,
  marginLeft: props.marginLeft,
  textTransform: props.texttransform || 'none',

  '&:hover': {
    backgroundColor: props.theme.colors.bgColorOptionTwo,
    color: 'black',
    padding: '7px 20px',
    border: '2px solid',
    borderRadius: '10px',
    boxShadow: 'none',
    textTransform: 'none',
    fontSize: 15,
    fontWeight: 600,
    lineHeight: 1.5,
  },
}));

export const CustomBlackAndWhiteStyledButtonSideBar = styled(GreyStyledButton)((props) => ({
  color: props.theme.colors.charcoal,
  padding: '8px 15px',
  border: `2px solid ${props.theme.colors.charcoal}`,
  maxHeight: '40px',

  '&:hover': {
    backgroundColor: props.theme.colors.bgColorOptionTwo,
    border: `2px solid ${props.theme.colors.charcoal}`,
  },
}));

export const BlueLinkNoUnderLine = styled.a`
  color: ${({ theme }) => theme.colors.blue};
  text-decoration: none;
`;

export const TransitionSlidePrimaryContainer = styled.div`
  transition: 700ms;
  height: 100%;
  z-index: 1;
  transform: translateX(${({ state }) => (state === 'entering' || state === 'entered' ? 0 : -100)}%);
  position: absolute;
  width: -webkit-fill-available;
`;

export const TransitionSlideSecondaryContainer = styled.div`
  transition: 700ms;
  height: 100%;
  z-index: 1;
  transform: translateX(${({ state }) => (state === 'entering' || state === 'entered' ? 0 : 100)}%);
  position: absolute;
  width: -webkit-fill-available;
`;

export const AddNewRowButton = styled(Button)`
  height: 41px;
  padding: 6px 22px;
  background-color: ${({ theme }) => theme.colors.white};
  box-shadow: ${({ theme }) => theme.boxShadows.box};
  border-radius: 75px;
  gap: 10px;
`;

export const StyledTabs = styled(Tabs, {
  shouldForwardProp: (prop) => !['activeBarHeight', 'activeBarColor'].includes(prop),
})((props) => ({
  '& .MuiTabs-flexContainer': {
    gap: 32,
  },

  '.MuiTabs-indicator': {
    backgroundColor: props.activeBarColor || props.theme.colors.primary,
    height: props.activeBarHeight,
  },
}));

export const StyledTab = styled(Tab)((props) => ({
  color: props.theme.colors.primary,
  padding: 0,
  fontWeight: 600,
  textTransform: 'none',
  fontSize: 16,
  minWidth: 0,
  minHeight: 55,

  '&.Mui-selected': {
    color: props.theme.colors.primary,
  },

  '&[unread-count]': {
    display: 'flex',
    flexDirection: 'row',

    '&:after': {
      content: 'attr(unread-count)',
      color: props.theme.colors.white,
      backgroundColor: props.theme.colors.secondary,
      borderRadius: '50%',
      height: 24,
      minWidth: 24,
      lineHeight: '24px',
      width: 'fit-content',
      fontSize: 12,
      fontWeight: 400,
      marginLeft: 6,
    },
  },
}));
/*
  Copy/paste Password example from: https://mui.com/material-ui/react-text-field/#input-adornments
  and remove <InputLabel> and label= prop from OutlinedInput; use outlined versions of the <Visibility/Off/> icons
*/
export const StyledPasswordFormControl = styled(FormControl, {
  shouldForwardProp: (prop) =>
    !['borderRadius', 'borderColor', 'minHeight', 'height', 'p', 'width', 'invalid'].includes(prop),
})(({ theme, variant, borderRadius, borderColor, minHeight, height, p, width, invalid }) => ({
  ...(variant === 'outlined' && {
    fontFamily: 'Montserrat',
    borderRadius: borderRadius || '10px',
    border: `1px solid ${borderColor || theme.colors.altoGray}`,
    width: width || '100%',
    minHeight: minHeight || '41px',
    height: height || 'auto',
    padding: p || '0px 2px',
    outline: 'none',
    justifyContent: 'center',

    '&:focus, &:focus-within, &:hover': {
      border: `1px solid ${theme.colors.primary}`,
    },

    ...(invalid && {
      border: `1px solid ${theme.colors.validationError}`,

      '&:focus, &:focus-within, &:hover': {
        border: `1px solid ${theme.colors.validationError}`,
      },
    }),

    '& .MuiOutlinedInput-notchedOutline': {
      border: 'none',
    },

    '& legend': {
      display: 'none',
    },
  }),
}));

export const StyledHoverDiv = styled.div`
  &:hover {
    background: ${({ theme }) => theme.colors.tableRowHover};
  }
`;

export const StyledHoverText = styled('div', {
  shouldForwardProp: (prop) => !['isLinkedClickable'].includes(prop),
})(({ theme, isLinkedClickable }) => ({
  '&:hover': {
    '& span': {
      color: isLinkedClickable ? theme.colors.linkColor : 'initial',
      textDecoration: isLinkedClickable ? 'underline' : 'none',
      cursor: 'default',
    },
  },
}));

export const StyledFadeInContainer = styled(StyledFlex)`
  animation: ${fadeInAnimation} ease-in 1;
  animation-fill-mode: forwards;
  animation-duration: 0.2s;
  gap: 2px;
`;

export const StyledSpinnerContainer = styled(StyledFlex, {
  shouldForwardProp: (prop) =>
    ![
      'global',
      'parent',
      'inline',
      'fadeBgParent',
      'roundedBg',
      'globalFadeBgParent',
      'fadeBgParentFixedPosition',
    ].includes(prop),
})(({ theme, global, parent, inline, fadeBgParent, globalFadeBgParent, fadeBgParentFixedPosition }) => ({
  position: 'relative',
  backgroundColor: 'transparent',
  zIndex: 9999999999999,
  textAlign: 'center',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',

  ...(global && {
    position: 'fixed',
    left: 0,
    top: 0,
    height: '100%',
    width: '100%',
    zIndex: 999999999999999,
  }),
  ...(globalFadeBgParent && {
    position: 'fixed',
    left: 0,
    top: 0,
    height: '100%',
    width: '100%',
    zIndex: 999999999999999,
    background: 'rgba(255,255,255, 0.6)',
  }),
  ...(parent && {
    position: 'absolute',
    left: 0,
    top: 0,
    height: 'calc(100vh - 2*var(--navbarHeight))',
    width: '100%',
  }),
  ...(fadeBgParent && {
    position: 'absolute',
    left: 0,
    top: 0,
    height: '100%',
    width: '100%',
    background: 'rgba(255,255,255, 0.6)',
  }),
  ...(fadeBgParentFixedPosition && {
    position: 'fixed',
    left: 0,
    top: 0,
    height: '100%',
    width: '100%',
    background: 'rgba(255,255,255, 0.6)',
  }),
  ...(inline && {
    width: '100%',
    height: '100%',
    margin: 'auto',
  }),
}));
export const StyledSpinner = styled(CircularProgress, {
  shouldForwardProp: (prop) => !['medium', 'small', 'extraSmall'].includes(prop),
})(({ theme, medium, small, extraSmall }) => ({
  color: `${theme.colors.primary} !important`,
  margin: '0 auto',
  width: '80px !important',
  height: '80px !important',
  ...(medium && {
    color: `${theme.colors.primary} !important`,
    margin: '0 auto',
    width: '40px !important',
    height: '40px !important',
  }),
  ...(small && {
    color: `${theme.colors.primary} !important`,
    margin: '0 auto',
    width: '30px !important',
    height: '30px !important',
  }),
  ...(extraSmall && {
    color: `${theme.colors.primary} !important`,
    margin: '0 auto',
    width: '20px !important',
    height: '20px !important',
  }),
}));

export const StyledGrayIcon = styled('div', {
  shouldForwardProp: (prop) => !['disabled'].includes(prop),
})`
  filter: ${({ disabled }) => (disabled ? 'grayscale(100%)' : 'none')};
  opacity: ${({ disabled }) => (disabled ? 0.7 : 1)};
`;
