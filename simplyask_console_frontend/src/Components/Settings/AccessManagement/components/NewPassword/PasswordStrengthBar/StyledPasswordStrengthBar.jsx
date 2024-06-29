import isPropValid from '@emotion/is-prop-valid';
import styled from '@emotion/styled';

const strengthColors = (theme) => ({
  0: theme.colors.passwordStrengthUndefined,
  1: theme.colors.validationError,
  2: theme.colors.statusAssigned,
  3: theme.colors.statusUnassigned,
  4: theme.colors.statusResolved,
});

export const StyledPasswordStrengthBar = styled('button', {
  shouldForwardProp: (prop) => isPropValid(prop) && prop !== 'strength',
})`
  appearance: none;
  user-select: none;
  pointer-events: none;
  display: flex;
  flex: 1 1 auto;
  align-items: center;
  justify-content: center;
  height: 5px;
  border: none;
  border-radius: 84px;
  outline: none;
  background-color: ${({ strength, theme }) => (strength ? strengthColors(theme)[strength] : strengthColors(theme)[0])};
`;
