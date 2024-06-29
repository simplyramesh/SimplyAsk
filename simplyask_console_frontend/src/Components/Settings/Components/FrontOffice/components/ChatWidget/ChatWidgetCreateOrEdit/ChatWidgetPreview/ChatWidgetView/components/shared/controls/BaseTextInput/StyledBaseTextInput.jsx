import styled from '@emotion/styled';

export const StyledBaseTextInput = styled('input', {
  shouldForwardProp: (prop) =>
    !['height', 'borderColor', 'textAlign', 'invalid', 'fontSize', 'borderRadius', 'padding'].includes(prop),
})`
  appearance: none;
  resize: none;
  display: flex;
  flex: 1 1 auto;
  align-items: center;
  width: 100%;
  height: ${({ height }) => height || '42px'};
  padding: ${({ padding }) => padding || '10px 16px 10px 14px'};
  border: ${({ theme, borderColor }) =>
    borderColor ? `1px solid ${borderColor}` : `1px solid ${theme.colors.borderNoError}`};
  border-radius: ${({ borderRadius }) => borderRadius || '10px'};
  outline: none;
  background-color: ${({ theme }) => theme.colors.white};
  font-size: ${({ fontSize }) => fontSize || '16px'};
  font-weight: 400;
  font-style: normal;
  color: ${({ theme }) => theme.colors.primary};
  text-align: ${({ textAlign }) => textAlign || 'left'};

  &::placeholder {
    color: ${({ theme }) => theme.colors.optional};
  }

  &:focus {
    border: ${({ theme, borderColor }) =>
      borderColor ? `1px solid ${borderColor}` : `1px solid ${theme.colors.primary}`};
  }

  ${({ theme, invalid }) => invalid && `border: 1px solid ${theme.colors.validationError} !important;`}
`;
