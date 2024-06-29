import styled from '@emotion/styled';
import { Dialog } from '@mui/material';

export const StyledFixedModal = styled(Dialog, {
  shouldForwardProp: (prop) => !['bgColor', 'zindex', 'maxWidth', 'height', 'width'].includes(prop),
})`
  z-index: ${({ zindex }) => zindex || 5001};

  & .MuiDialog-paper {
    border-radius: 25px;
    background-color: ${({ bgColor }) => bgColor || 'inherit'};
    box-shadow: ${({ theme }) => theme.boxShadows.box};
    max-width: ${({ maxWidth }) => maxWidth || '100%'};
    height: ${({ height }) => height || 'auto'};
    width: ${({ width }) => width || '100%'};
    overflow: hidden;
  }
`;

export const StyledFixedModalHead = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;
  padding: 10px 30px;
  min-height: 56px;
  border-radius: 25px 25px 0 0;
  background-color: ${({ theme, bgColor }) => bgColor || theme.colors.lighterColor};
  font-size: 20px;
  font-weight: 600;
`;

export const StyledFixedModalBody = styled('div', {
  shouldForwardProp: (prop) => !['bodyHeight', 'bodyPadding', 'enableScrollbar'].includes(prop),
})`
  display: flex;
  flex-direction: column;
  padding: ${({ bodyPadding }) => bodyPadding || '0 10px 0 0'};
  height: ${({ bodyHeight }) => bodyHeight || 'auto'};
  overflow: ${({ enableScrollbar }) => (enableScrollbar ? 'unset' : 'hidden')};
`;

export const StyledFixedModalFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  height: ${({ height }) => height || '78px'};
  padding: 0 28px;
  box-shadow: ${({ theme, footerShadow }) => (footerShadow ? theme.boxShadows.box : 'none')};
`;
