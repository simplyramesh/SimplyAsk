import styled from '@emotion/styled';
import Timeline from '@mui/lab/Timeline';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';

export const StyledTimeline = styled(Timeline)`
  padding: 0;
  padding-inline-start: 0;

  &.MuiTimeline-positionRight {
    padding: 0;

    & .MuiTimelineItem-root {
      &::before {
        display: none;
      }
    }
  }
`;

export const StyledTimelineItem = styled(TimelineItem)`
  &:not(:first-of-type) {
    margin-top: 20px;
  }

  &:last-child {
    & .MuiTimelineConnector-root {
      display: none;
      bottom: 23px;
    }
  }
`;

export const StyledTimelineSeparator = styled(TimelineSeparator)`
  position: relative;
  margin-right: calc(12px + 6px);
  padding-top: 10px;
`;

export const StyledTimelineDot = styled(TimelineDot, {
  shouldForwardProp: (prop) => prop !== 'color',
})`
  &.MuiTimelineDot-outlined {
    position: relative;
    margin: 3px 0;
    padding: 5px;
    border: ${({ theme }) => theme.borders.timeline.dot.border};
    background-color: ${({ theme, color }) => color || theme.colors.information};
    outline: ${({ theme }) => theme.borders.timeline.dot.outline};
  }
`;

export const StyledTimelineConnector = styled(TimelineConnector)`
  position: absolute;
  top: 30px;
  left: calc(50% - (3px / 2));
  bottom: -36px;
  width: 3px;
  background-color: ${({ theme }) => theme.colors.timelineConnector};
`;

export const StyledTimelineContent = styled(TimelineContent, {
  shouldForwardProp: (prop) => prop !== 'color',
})`
  font-family: 'Montserrat';
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
  color: ${({ theme }) => theme.colors.primary};
  letter-spacing: normal;
  position: relative;

  &.MuiTimelineContent-positionRight {
    padding: 3px 0 0 9px;
    border-left: ${({ color, theme }) => (color ? `6px solid ${color}` : theme.borders.timeline.content)};
  }

  &::before {
    content: '';
    position: absolute;
    left: -12px;
    top: 18px;
    border-style: solid;
    border-width: 0px 7px 6px 7px;
    border-color: ${({ theme, color }) => `transparent transparent ${color || theme.colors.information} transparent`};
    transform: rotate(270deg);
    z-index: 2;
  }
`;

export const StyledTimelineActions = styled('div')`
  position: absolute;
  right: 8px;
  top: 2px;
  width: 20px;
  display: none;
`;

export const StyledTimelineAction = styled('button')`
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: cneter;
  padding: 2px;
  border: 0;
  background: transparent;
  cursor: pointer;
  border-radius: 5px;

  & + & {
    margin-top: 4px;
  }

  svg {
    width: 100%;
    height: 100%;
  }

  &:hover {
    background-color: #d3d9e1;
  }
`;

export const StyledTimelineContentWrapper = styled('div', {
  shouldForwardProp: (prop) => prop !== 'editable',
})`
  position: relative;
  width: 100%;
  z-index: 1;
  padding-right: 32px;

  &:before {
    content: '';
    position: absolute;
    width: calc(100% + 16px);
    height: calc(100% + 16px);
    display: ${({ editable }) => (editable ? 'block' : 'none')};
    top: -8px;
    left: -8px;
    border-radius: 10px;
    background: ${({ theme }) => theme.colors.bgColorOptionTwo};
    opacity: 0;
    z-index: -1;
  }

  &:hover:before {
    opacity: 1;
  }

  &:hover ${StyledTimelineActions} {
    display: block;
  }
`;
