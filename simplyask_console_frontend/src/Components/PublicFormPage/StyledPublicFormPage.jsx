import isPropValid from '@emotion/is-prop-valid';
import styled from '@emotion/styled';

import SymphonaLogoSvg from '../../Assets/images/SymphonLogo.svg?component';
import { StyledButton } from '../shared/REDISIGNED/controls/Button/StyledButton';
import { StyledFixedModal, StyledFixedModalHead } from '../shared/REDISIGNED/modals/CenterModalFixed/StyledCenterModal';

export const StyledPublicFormPage = styled('div', {
  shouldForwardProp: (prop) => !['pageColour'].includes(prop),
})`
  flex-grow: 1;
  position: relative;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 70px 0;
  background-color: ${({ theme, pageColour }) => pageColour || theme.colors.white};
`;

export const StyledPublicBG = styled('div', {
  shouldForwardProp: (prop) => !['url', 'headerColourHex'].includes(prop),
})`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 50vh;
  background: ${({ url, headerColourHex }) => `no-repeat top center url(${url}), ${headerColourHex}`};
  background-size: cover;
  overflow: hidden;
  clip-path: polygon(0 0, 100% 0, 100% calc(100% - 150px), 0% 100%);
`;

export const StyledPublicForm = styled('div', {
  shouldForwardProp: (prop) => isPropValid(prop) && !['accentColourHex, isDarkTheme'].includes(prop),
})`
  display: flex;
  flex-direction: column;
  flex-grow: 0;
  width: 100%;
  max-width: 746px;
  padding: 36px 30px;
  box-shadow: ${({ theme }) => theme.boxShadows.box};
  background-color: ${({ theme, isDarkTheme }) => (!isDarkTheme ? theme.colors.white : theme.colors.oil)};
  color: ${({ theme, isDarkTheme }) => (!isDarkTheme ? theme.colors.primary : theme.colors.white)};
  border-radius: 25px;
  border-top: 10px solid ${({ accentColourHex }) => accentColourHex};
  z-index: 1;
`;

export const StyledFormButton = styled(StyledButton, {
  shouldForwardProp: (prop) => !['buttonColourHex', 'buttonTextColourHex'].includes(prop),
})`
  background-color: ${({ buttonColourHex }) => buttonColourHex};
  border-color: ${({ buttonColourHex }) => buttonColourHex};
  color: ${({ buttonTextColourHex }) => buttonTextColourHex};
`;

export const PoweredByLogo = styled(SymphonaLogoSvg)`
  height: 22px;
  width: auto;
`;

export const StyledPasswordModal = styled(StyledFixedModal)`
  & .MuiBackdrop-root.MuiModal-backdrop {
    background-color: transparent;
    backdrop-filter: blur(10px);
  }

  & .MuiDialog-paper {
    box-shadow: ${({ theme }) => theme.boxShadows.centerModalFixed};
  }
`;

export const StyledPasswordModalHead = styled(StyledFixedModalHead)`
  line-height: 29px;
  padding: 0px 20px;
  background-color: ${({ theme }) => theme.colors.bgColorOptionTwo};
`;

export const StyledFormLogo = styled('img')`
  max-height: 40px;
  height: auto;
  width: auto;
  max-width: 190px;
  object-fit: contain;
  object-position: left;
`;
