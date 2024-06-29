import styled from '@emotion/styled';

export const StyledHorizontalTrack = styled('div', {
  shouldForwardProp: (prop) =>
    !['styles', 'radius', 'thumbWidth', 'trackBorder', 'trackWidth', 'trackColor', 'thumbColor', 'showTrack'].includes(
      prop
    ),
})`
  ${({ styles }) => ({ ...styles })}
  right: ${({ showTrack, thumbWidth = '0', trackWidth = '0' }) =>
    showTrack.vertical && showTrack.horizontal
      ? `${+thumbWidth.match(/\d+/g)[0] + +trackWidth.match(/\d+/g)[0] + 2}px`
      : '2px'};
  bottom: 2px;
  left: 2px;
  // display: ${({ showTrack }) => (showTrack.horizontal ? 'flex' : 'none')};
  align-items: center;
  border: ${({ trackBorder }) => trackBorder || 0};
  border-radius: ${({ radius }) => radius || '3px'};
  height: ${({ trackWidth, thumbWidth }) => trackWidth || thumbWidth || '6px'};
  background-color: ${({ trackColor }) => trackColor || 'transparent'};
`;

export const StyledHorizontalThumb = styled('div', {
  shouldForwardProp: (prop) =>
    !['styles', 'radius', 'thumbWidth', 'trackBorder', 'trackWidth', 'trackColor', 'thumbColor', 'showTrack'].includes(
      prop
    ),
})`
  ${({ styles }) => ({ ...styles })}

  cursor: pointer;
  border-radius: ${({ radius }) => radius || 'inherit'};
  background-color: ${({ theme, thumbColor }) => thumbColor || `${theme.colors.primary}50`};
  height: ${({ thumbWidth }) => thumbWidth || '100%'};
`;

export const StyledVerticalTrack = styled('div', {
  shouldForwardProp: (prop) =>
    !['styles', 'radius', 'thumbColor', 'thumbWidth', 'trackBorder', 'trackWidth', 'trackColor', 'showTrack'].includes(
      prop
    ),
})`
  ${({ styles }) => ({ ...styles })}

  right: 2px;
  bottom: ${({ showTrack, thumbWidth = '0', trackWidth = '0' }) =>
    showTrack.vertical && showTrack.horizontal
      ? `${+thumbWidth.match(/\d+/g)[0] + +trackWidth.match(/\d+/g)[0] + 2}px`
      : '2px'};
  top: 2px;
  // display: ${({ showTrack }) => (showTrack.vertical ? 'flex' : 'none')};
  justify-content: center;
  border: ${({ trackBorder }) => trackBorder || 0};
  border-radius: ${({ radius }) => radius || '3px'};
  background-color: ${({ trackColor }) => trackColor || 'transparent'};
  width: ${({ trackWidth, thumbWidth }) => trackWidth || thumbWidth || '6px'};
`;

export const StyledVerticalThumb = styled('div', {
  shouldForwardProp: (prop) =>
    !['styles', 'radius', 'thumbWidth', 'trackBorder', 'trackWidth', 'trackColor', 'thumbColor', 'showTrack'].includes(
      prop
    ),
})`
  ${({ styles }) => ({ ...styles })}

  cursor: pointer;
  border-radius: ${({ radius }) => radius || 'inherit'};
  background-color: ${({ theme, thumbColor }) => thumbColor || `${theme.colors.primary}50`};
  width: ${({ thumbWidth }) => thumbWidth || '100%'};
`;

export const StyledView = styled('div', {
  shouldForwardProp: (prop) =>
    !['styles', 'radius', 'thumbWidth', 'trackBorder', 'trackWidth', 'trackColor', 'thumbColor', 'showTrack'].includes(
      prop
    ),
})`
  ${({ styles }) => ({ ...styles })}
`;
