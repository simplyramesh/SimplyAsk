import styled from '@emotion/styled';

export const StyledBaseTextArea = styled('textarea', {
  shouldForwardProp: (prop) => !['height'].includes(prop),
})`
  appearance: none;
  resize: none;
  display: flex;
  flex: 1 1 auto;
  align-items: center;
  width: 100%;
  padding: 10px 16px 10px 14px;
  border-radius: 10px;
  outline: none;
  background-color: #ffffff;
  font-size: 16px;
  font-weight: 400;
  font-style: normal;
  color: #2d3a47;
  border: 1px solid ${({ theme }) => theme.colors.borderNoError};
  height: ${({ height }) => height || 'auto'};
  &:focus {
    border: 1px solid ${({ theme }) => theme.colors.charcoal};
  }

  ${({ theme, invalid }) => invalid && `border: 1px solid ${theme.colors.validationError};`}
`;
