import styled from '@emotion/styled';

export const StyledActionsView = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

export const StyledActionsDiagram = styled.div`
  position: relative;
  height: 250px;
  box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
`;

export const StyledActionsExecution = styled.div`
  height: 62%;
  display: flex;
  flex-grow: 1;
`;

export const ActionsExecutionSectionContent = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  height: calc(100% - 42px);
`;

export const ActionsExecutionSectionItem = styled.div`
  padding: 23px 10px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.dividerColor};

  &:last-of-type {
    border-bottom: none;
  }
`;
