import styled from '@emotion/styled';
import { SidedrawerModal } from 'simplexiar_react_components';
import NavTabs from '../../../../shared/NavTabs/NavTabs';
import { StyledFlex } from '../../../../shared/styles/styled';

export const StyledFlowDynamicSideModalContainer = styled('aside', {
  shouldForwardProp: (prop) => !['dataExpanded'].includes(prop),
})`
  position: absolute;
  right: 0;
  z-index: 10;
  height: 100%;
  border-radius: 30px 0 0 30px;
  box-shadow: ${({ theme }) => theme.boxShadows.workflowDynamicSideModal};
  transition: transform 400ms ease-in-out;
  transition: ${({ dataExpanded }) => (dataExpanded ? 'transform 400ms ease-in-out' : 'transform 200ms ease-in-out')};
  transform: ${({ dataExpanded }) => (dataExpanded ? 'translateX(0)' : 'translateX(100%)')};
`;

export const StyledTabContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: calc(100% - 65px);
  overflow-y: auto;
  position: relative;
  width: 100%;
  background-color: ${({ theme }) => theme.colors.white};

  &::-webkit-scrollbar {
    width: 16px;
  }

  &:hover::-webkit-scrollbar-thumb {
    border: ${({ theme }) => `4px solid ${theme.colors.tableScrollBg}`};
    border-radius: 10px;
    background: ${({ theme }) => theme.colors.silver};
  }

  &:hover::-webkit-scrollbar-track {
    margin-bottom: 44px;
    background: ${({ theme }) => theme.colors.tableScrollBg};
    border-radius: 2px;
  }

  &:hover::-webkit-scrollbar-track-piece {
    margin: 4px 0;
    background: ${({ theme }) => theme.colors.tableScrollBg};
  }
`;

export const StyledNavTabsRoot = styled(NavTabs)`
  height: 65px;
  width: 100%;
  background: ${({ theme }) => theme.colors.aliceBlue};
  position: sticky;
  top: 0;
  z-index: 20;
  padding: 0;

  .tabs {
    height: 100% !important;
    width: 100% !important;

    .MuiTabs-flexContainer {
      height: 100% !important;
      gap: 0;
    }

    .MuiTab-root {
      flex: 1;
      font-size: 15px;
    }

    .Mui-selected {
      color: ${({ theme }) => theme.colors.royalBlue} !important;
    }

    .MuiTabs-indicator {
      background-color: ${({ theme }) => theme.colors.royalBlue} !important;
    }
  }
`;

export const StyledStepNode = styled(StyledFlex)`
  position: relative;
  gap: 12px;
  flex-direction: row;
  align-items: center;
  cursor: pointer;
  height: 40px;
  border-radius: 10px;
  z-index: 0;
  &:after {
    content: '';
    position: absolute;
    left: -8px;
    top: 0;
    width: calc(100% + 8px);
    height: 100%;
    border-radius: 10px;
    z-index: -1;
    transition: background-color 0.3s ease;
  }

  &:hover:after {
    background-color: ${({ theme }) => theme.colors.lightGray2};
  }
`;

export const StyledSideDrawerModal = styled(SidedrawerModal)`
  border-radius: 30px 0 0 30px;
  min-width: 450px;
  position: relative;
  height: 100%;
  width: 20vw;
  padding: 0;
`;
