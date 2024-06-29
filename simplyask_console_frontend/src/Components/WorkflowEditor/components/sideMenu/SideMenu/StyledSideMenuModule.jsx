import styled from '@emotion/styled';
import { Button } from '@mui/material';

export const StyledWorkflowSideMenuContainer = styled('div', {
  shouldForwardProp: (prop) => !['dataExpanded'].includes(prop),
})`
  display: flex;
  position: absolute;
  right: 0;
  top: 0;
  z-index: 10;
  width: 20vw;
  min-width: 450px;
  height: 100%;
  margin-bottom: 36px;
  border-radius: 30px 0 0 30px;
  background: ${({ theme }) => theme.colors.white};
  box-shadow: ${({ theme }) => theme.boxShadows.workflowDynamicSideModal};
  transition: ${({ dataExpanded }) => (dataExpanded ? 'transform 400ms ease-in-out' : 'transform 200ms ease-in-out')};
  transform: ${({ dataExpanded }) => (dataExpanded ? 'translateX(0)' : 'translateX(100%)')};
`;

export const StyledDefaultMenuContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;

  position: relative;
  right: 0;
  top: 0;
  z-index: 1;

  width: 100%;

  background: ${({ theme }) => theme.colors.white};

  header + div {
    flex-grow: 1;
  }
`;

export const StyledDynamicMenuHeaderWrapper = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  left: 0;
  right: 0;
  z-index: 2;
  padding: 20px 22px;
  color: ${({ theme }) => theme.colors.primary};
  background-color: ${({ withColor, theme }) => (withColor ? theme.colors.aliceBlue : 'transparent')};
`;

export const StyledDynamicMenuHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const StyledCloseIconWrapper = styled.span`
  cursor: pointer;
  width: 32px;
  height: 32px;
  padding: 5px;
  margin-left: -5px;
  border-radius: 7px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: ${({ theme }) => `${theme.colors.royalBlueHover}`};
  }

  > svg {
    width: 20px;
    height: 20px;
  }
`;

export const StyledArrowIconWrapper = styled.span`
  cursor: pointer;
  padding: 4px 4px 1px 5px;
  border-radius: 100%;

  &:hover {
    background: ${({ theme }) => `${theme.colors.primary}26`};
  }

  > svg {
    width: 24px;
  }
`;

export const StyledToggleWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  left: 0;
  top: 50%;
  z-index: -1;
  height: 58px;
  border-radius: 0 10px 10px 0;
  background: ${({ theme }) => theme.colors.white};
  font-size: 16px;
  color: ${({ theme }) => theme.colors.primary};
  transform: translate(-28px, -50%) rotate(-180deg);
  transition:
    width 150ms ease-in-out,
    color 150ms ease-in;
  box-shadow: ${({ theme }) => theme.boxShadows.toggleIconWrapper};
  cursor: pointer;

  ${({ isDefaultMenuOpen }) =>
    isDefaultMenuOpen
      ? `
    width: 28px;
    color: ${({ theme }) => theme.colors.royalBlue}; 
  `
      : `
    width: 36px;
  `}

  &:hover {
    color: ${({ theme }) => theme.colors.royalBlue};
  }
`;

export const StyledToggleIconWrapper = styled.div`
  display: flex;
  flex: 1 1 auto;
  justify-content: center;
  align-items: center;
  background: ${({ theme }) => theme.colors.white};

  > svg {
    transform: ${({ isDefaultMenuOpen }) => (isDefaultMenuOpen ? 'rotate(0)' : 'rotate(180deg)')};
    transition: transform
      ${({ isDefaultMenuOpen }) => (isDefaultMenuOpen ? 'transform 200ms ease-in-out' : 'transform 400ms ease-in-out')};
  }
`;

export const StyledSecondMenuWrapper = styled.div`
  overflow: hidden;
  flex: 1 1 auto;
  position: relative;
  left: 0;
  top: 0;
  z-index: 1;
  height: 100%;
  border-radius: 30px 0 0 30px;
  background: ${({ theme }) => theme.colors.white};
`;

export const StyledSecondMenuContainer = styled.div`
  display: flex;
  position: absolute;
  height: 100%;
  padding-right: calc(386px - 345px);
  border-radius: 30px 0 0 30px;
  background: ${({ theme }) => theme.colors.white};
  transform: translateX(calc(-100% + 386px - 345px));
  transition: width 250ms ease-in-out;

  ${({ isSecondMenuOpen }) =>
    isSecondMenuOpen &&
    `
    width: 100%;
  `}
`;

export const StyledMoreVertBtn = styled(Button)`
  border-radius: 5px;
  padding: 2px;
  color: ${({ theme }) => theme.colors.primary};
  width: fit-content;
  min-width: 20px;
  height: 33px;
  width: 20px;
  right: 17px;
  top: 48px;
  position: absolute;

  &:hover {
    background-color: ${({ theme }) => theme.colors.royalBlueHover};
  }
`;
