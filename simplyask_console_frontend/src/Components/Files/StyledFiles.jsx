import isPropValid from '@emotion/is-prop-valid';
import styled from '@emotion/styled';

export const StyledFilesLayout = styled('div', {
  shouldForwardProp: (prop) => isPropValid(prop) && !['paddingBottom'].includes(prop),
})`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(110px, 160px));
  gap: 2rem;
  padding-bottom: ${({ paddingBottom }) => paddingBottom || 0};
`;

export const StyledRoundedGreyContainer = styled('div')`
  border-radius: 3px;
  background-color: ${({ theme }) => theme.colors.lightBlueShade};
  padding-top: 1px;
  padding-bottom: 1px;
  margin-left: 2px;
  text-align: center;
`;
