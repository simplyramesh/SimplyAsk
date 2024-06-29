import styled from '@emotion/styled';

export const StyledEditableCellIcon = styled.div`
  display: none;
  flex-direction: column;
  justify-content: center;
  position: absolute;
  right: 0;
  top: 0;
  height: 100%;
  padding: 0 12px;
  flex: 0 0 auto;
`;
export const StyledEditableCell = styled('div', {
  shouldForwardProp: (prop) => prop !== 'width',
})`
  position: relative;
  display: flex;
  align-items: center;
  width: ${({ width }) => width || '100%'};
  border-radius: 10px;
  min-height: 45px;
  padding: 8px 48px 8px 8px;

  &:hover {
    cursor: pointer;
    background-color: ${({ theme }) => theme.colors.cardGridItemBorder};

    ${StyledEditableCellIcon} {
      display: flex;
    }
  }
`;

export const StyledEditableCellControl = styled.div`
  display: flex;
  align-items: center;
  justify-content: ${({ justify }) => justify || 'flex-start'};
  justify-content: ${({ textAlign }) => textAlign || 'left'};
  flex: 1 1 auto;
`;
