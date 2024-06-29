import styled from '@emotion/styled';
import { StyledCard } from '../../../shared/styles/styled';

const topLightBlueGradientBg = new URL('../../../../Assets/images/topRightCircleLogin.svg', import.meta.url).href;

const bottomDarkBlueGradientBg = new URL('../../../../Assets/images/bottomLeftCircleLogin.svg', import.meta.url).href;

export const StyledAccountCreationSuccessCard = styled(StyledCard)`
  @media (max-width: 1440px) {
    width: 800px;
  }

  @media (max-height: 944px) {
    height: 700px;
  }
`;

export const StyledAccountCreationSuccessBackground = styled.div`
  width: 100%;
  height: 100vh;
  background-image: url(${bottomDarkBlueGradientBg}), url(${topLightBlueGradientBg});
  background-size: contain, contain;
  background-position: left, right; 
  background-repeat: no-repeat, no-repeat; 
  position: fixed, fixed;
`;