import styled from '@emotion/styled';
import { fadeIn } from '../StyledAuth';
export const StyledForgotPasswordContainer = styled.div`
  height: 100vh;
  width: 100vw;
  display: grid;
  place-items: start;
  align-content: center;
  justify-content: center;
  font-family: 'Montserrat';
  background-color: ${({ theme }) => theme.colors.white};
`;

export const StyledForgotPasswordCard = styled.div`
  padding: 40px;
  background: ${({ theme }) => theme.colors.white};
  z-index: 2;
  border-radius: 20px;
  width: 550px;
  height: 461px;
  box-shadow: ${({ theme }) => theme.boxShadows.forgotPasswordCardShadow};
  animation: ${fadeIn} ease-in 1;
  animation-fill-mode: forwards;
  animation-duration: 0.5s;
`;

export const StyledTopRightLightBlueGradientImage = styled.img`
  height: 60%;
  position: fixed;
  right: -3px;
  top: 0;
`;

export const StyledBottomLeftDarkBlueGradientImage = styled.img`
  height: 60%;
  position: fixed;
  bottom: 0;
  left: -3px;
`;
