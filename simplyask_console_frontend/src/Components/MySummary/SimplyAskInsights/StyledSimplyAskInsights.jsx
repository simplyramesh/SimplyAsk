import styled from '@emotion/styled';

import { Card } from 'simplexiar_react_components';
import { StyledText } from '../../shared/styles/styled';

export const StyledInsightsSection = styled(Card)`
  margin: 0;
  padding: 30px;
`;

export const StyledInsightsHeaderCarousel = styled.div`
  padding-bottom: 30px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

export const StyledCarouselHandler = styled.div`
  margin-left: auto;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 7px;
`;

export const StyledCarousel = styled.div``;

export const StyledCarouselItem = styled('div', {
  shouldForwardProp: (prop) => prop !== 'shown',
})`
  display: none;
  height: 0;
  opacity: 0;
  font-size: 16px;
  line-height: 1.5;
  transition: opacity 1s;
  cursor: pointer;

  &:nth-of-type(${({ shown }) => shown}) {
    display: block;
    height: auto;
    opacity: 1;
  }
`;

export const StyledCarouselInfo = styled(StyledText)`
  display: flex;
  justify-content: center;
  gap: 4px;
  width: 30px;
  line-height: 20px;
`;

export const StyledCarouselImgHolder = styled('div', {
  shouldForwardProp: (prop) => prop !== 'isHover',
})`
  position: relative;
  width: 100%;
  height: 0;
  padding-bottom: 34%;
  margin-bottom: 20px;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: ${({ isHover }) => (isHover ? '0 0 15px 3px rgba(0,0, 0, 0.25)' : 'none')};
`;

export const StyledCarouselImg = styled.img`
  width: 100%;
`;

export const StyledCarouselAutoplayIndication = styled('span', {
  shouldForwardProp: (prop) => !['duration', 'autoplay'].includes(prop),
})`
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 10px;
  opacity: 0.7;
  background: ${({ theme }) => theme.colors.charcoal};
  animation: progressLine linear 1;
  animation-fill-mode: forwards;
  animation-duration: ${({ duration }) => `${duration || 0}s`};

  animation-play-state: ${({ autoplay }) => (autoplay ? 'running' : 'paused')};

  @keyframes progressLine {
    from {
      width: 0;
    }

    to {
      width: 100%;
    }
  }
`;

export const StyledInsightsTags = styled.div`
  margin: 20px 0 10px;
  display: flex;
  gap: 10px;
  font-size: 14px;
  line-height: 17px;
  font-weight: 600;
  text-transform: capitalize;
`;

export const StyledInsightsTag = styled.span`
  padding: 5px 15px;
  color: ${({ theme }) => theme.colors.buttonSpecial};
  background: ${({ theme }) => theme.colors.statusUnassignedBackground};
  border: 2px solid ${({ theme }) => theme.colors.statusUnassignedBackground};
  border-radius: 27px;
  cursor: pointer;
`;

export const StyledDropdownContent = styled.div`
  display: flex;
  align-items: center;
  border-radius: 10px;
  color: ${({ theme }) => theme.colors.charcoal};
  background-color: ${({ theme }) => theme.colors.background};
  box-shadow: ${({ theme }) => theme.boxShadows.box};
`;

export const StyledDropdownItem = styled.span`
  display: flex;
  gap: 6px;
  padding: 8px 18px;
  font-size: 15px;
  font-weight: 500;
  font-style: normal;
  white-space: nowrap;
  cursor: pointer;

  &:hover {
    background-color: ${({ theme }) => theme.colors.bgColorOptionTwo};
  }
`;
