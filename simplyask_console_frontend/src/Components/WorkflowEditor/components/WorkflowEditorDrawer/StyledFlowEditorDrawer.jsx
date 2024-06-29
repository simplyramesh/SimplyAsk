import styled from '@emotion/styled';
import patternImg from '../../../../Assets/icons/pattern.svg';

export const StyledWorkflowEditorDrawer = styled('div', {
    shouldForwardProp: (prop) => !['pattern'].includes(prop),
})`
    position: relative;
    height: 100%;
    box-shadow: ${({ theme }) => theme.boxShadows.workflowEditorDrawer};
    background-image: ${({ pattern }) => pattern ? `url("${patternImg}")` : 'none'};

    > div > div {
        will-change: transform;
    }
`;

export const StyledWorkflowEditorDrawerOverlay = styled('main', {
  shouldForwardProp: (prop) => !['isReadOnly'].includes(prop),
})`
  min-height: 100%;
  margin: 0;
  padding: ${({ isReadOnly }) => (isReadOnly ? '5vw' : '100vh 100vw')};
  cursor: all-scroll;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const StyledWorkflowEditorDrawerComponent = styled.section`
  min-height: 100%;
  min-width: 100%;
`;
