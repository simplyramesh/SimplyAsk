import styled from '@emotion/styled';
import { StyledFlex } from '../../../shared/styles/styled';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';

export const StyledFlowSidebar = styled('div', {
  shouldForwardProp: (prop) => !['open, width'].includes(prop),
})`
  position: relative;
  box-shadow: ${({ theme }) => theme.boxShadows.box};
  width: ${({ width }) => width};
  margin-right: ${({ open, width }) => `${open ? 0 : `-${width}`}`};
  transition: all 0.3s ease;
  height: 100%;
  z-index: 100;
  background: ${({ theme }) => theme.colors.white};
`;
export const StyledFlowSidebarInner = styled(StyledFlex)`
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
  z-index: 100;
`;

export const StyledSidebarItem = styled(StyledFlex, {
  shouldForwardProp: (prop) => !['selected', 'hovered'].includes(prop),
})`
  position: relative;
  transition: all 0.3s ease;
  background: ${({ theme, selected, hovered }) => (selected || hovered ? theme.colors.bgColorOptionTwo : 'white')};

  &:hover {
    background: ${({ theme }) => theme.colors.bgColorOptionTwo};
    cursor: pointer;
  }
`;

export const StyledSidebarItemTopIcon = styled.div`
  &:hover path {
    fill: ${({ theme }) => theme.colors.secondary};
  }

  & > svg {
    transform: ${({ open }) => `scale(1, ${open ? 1 : -1})}`};
  }
`;

export const StyledSidebarItemIcon = styled.div`
  display: flex;
  flex-shrink: 0;

  & > svg {
    max-width: 25px;
    max-height: 25px;
  }
`;

export const StyledSidebarItemWrap = styled.div``;

export const StyledSidebarBackIcon = styled(KeyboardBackspaceIcon)`
  width: 32px;
  height: 27px;
  border-radius: 50%;
  transition: all 160ms ease-in;

  &:hover {
    background: ${({ theme }) => theme.colors.galleryGray};
    cursor: pointer;
  }
`;
