import styled from '@emotion/styled';
import { StyledFlex } from '../../shared/styles/styled';
import { media } from '../../shared/styles/media';

const topLightBlueGradientBg = new URL('../../../Assets/images/topLightBlueGradiantBg.svg', import.meta.url).href;

const bottomDarkBlueGradientBg = new URL('../../../Assets/images/bottomDarkBlueGradiantBg.svg', import.meta.url).href;

export const StyledBlueGradientBackground = styled.div`
  width: 100%;
  height: 100%;
  background-image: url(${topLightBlueGradientBg}), url(${bottomDarkBlueGradientBg});
  background-size: cover, cover;
  background-position: left, right;
  background-repeat: no-repeat, no-repeat;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const StyledRegistrationHeaderFooter = styled(StyledFlex)`
  display: flex;
  flex-direction: row;
  padding: 15px 75px;
  box-shadow: ${({ theme }) => theme.boxShadows.headerFooterSection};
  justify-content: ${({ justifyContent }) => justifyContent || 'space-between'};
  position: sticky;
  width: 100%;
  height: 68px;
  align-items: center;

  ${media.sm} {
    padding: 15px 36px;
  }
`;

export const StyledRegistrationFormsContainer = styled(StyledFlex)`
  display: flex;
  gap: ${({ gap }) => gap || '35px'};
  height: 100%;
  padding: ${({ isModalView }) => (isModalView ? '40px' : '50px 75px')};
  flex: 1;

  ${media.sm} {
    padding: ${({ isModalView }) => (isModalView ? '40px' : '50px 36px')};
  }
`;
