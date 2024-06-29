import styled from '@emotion/styled';
import { media } from '../../../shared/styles/media';
import { StyledFlex } from '../../../shared/styles/styled';

export const StyledGenerativeEditorCard = styled('div', {
  shouldForwardProp: (prop) => prop !== 'borderColor',
})`
  width: 100%;
  max-width: 746px;
  padding: 24px 30px;
  box-shadow: ${({ theme }) => theme.boxShadows.box};
  background-color: ${({ theme }) => theme.colors.white};
  border-radius: 25px;
  border-top: 10px solid ${({ theme, borderColor }) => theme.colors[borderColor]};

  ${media.xs} {
    max-width: 100%;
  }
`;

export const transitionDuration = 300;
export const transitionClass = `slide`;

export const StyledActionSidebar = styled('div', {
  shouldForwardProp: (prop) => prop !== 'absolute',
})`
  display: flex;
  flex-direction: column;
  width: 500px;
  height: 100%;
  box-shadow: ${({ theme }) => theme.boxShadows.box};
  background: ${({ theme }) => theme.colors.white};
  z-index: 199;
  position: relative;
  flex-shrink: 0;

  &.${transitionClass}-enter {
    margin-right: -100%;
  }

  &.${transitionClass}-enter-active {
    margin-right: 0;
    transition: all ${transitionDuration}ms ease;
  }

  &.${transitionClass}-exit {
    margin-right: 0;
  }

  &.${transitionClass}-exit-active {
    margin-right: -100%;
    transition: all ${transitionDuration}ms linear;
  }

  ${media.sm} {
    position: absolute;
    top: 0;
    right: 0;
  }
`;

export const StyledGenerativeEditorCards = styled(StyledFlex, {
  shouldForwardProp: (prop) => prop !== 'sidebarOpen',
})`
  ${media.sm} {
    align-items: ${({ sidebarOpen }) => (sidebarOpen ? 'flex-start' : 'center')};
  }
  padding-bottom: 106px;
`;
