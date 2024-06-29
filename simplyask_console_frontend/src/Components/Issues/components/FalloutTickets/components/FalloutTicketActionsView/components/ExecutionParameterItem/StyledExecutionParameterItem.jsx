import styled from '@emotion/styled';

export const StyledExecutionParameterItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
`;

export const StyledExecutionParameterTitleHolder = styled.div`
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  max-width: 350px;
`;

export const StyledExecutionParameterValueHolder = styled.div`
  display: flex;
  flex-direction: column;
`;

export const StyledExecutionParameterValue = styled('span', {
  shouldForwardProp: (prop) => prop !== 'isEditable',
})`
  padding: 8px;
  display: block;
  font-size: 16px;
  line-height: 24px;
  cursor: ${({ isEditable }) => (isEditable ? 'pointer' : 'text')};
  border-radius: 10px;
  text-align: right;

  &:hover {
    background-color: ${({ theme, isEditable }) => (isEditable ? theme.colors.tableEditableCellBg : 'transparent')};
  }
`;
