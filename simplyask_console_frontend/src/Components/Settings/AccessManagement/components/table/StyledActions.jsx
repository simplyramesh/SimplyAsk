import styled from '@emotion/styled';

export const StyledActions = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
`;

export const StyledActionsIconWrapper = styled.span`
  width: 34px;
  height: 34px;
  cursor: pointer;
  display: flex;
  border-radius: 50%;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.colors.tertiary};
  transition:
    background-color 250ms ease-in-out,
    color 250ms ease-in-out;
  flex-shrink: 0;

  &:hover {
    background: ${({ theme }) => theme.colors.tertiaryHover};
  }

  & + & {
    margin-left: 20px;
  }

  ${({ disabled }) =>
    disabled &&
    `
    opacity: 0.5;
    pointer-events: none;
    
    & > * {
      pointer-events: none;
    }
  `}
`;
