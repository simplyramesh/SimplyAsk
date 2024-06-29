import styled from '@emotion/styled';
import { Button } from '@mui/material';

export const StyledFormLogo = styled.img`
    max-height: 30px;
    max-width: 140px;
`;

export const StyledFormBgLogo = styled.img`
    height: 60px;
    width: 60px;
    object-fit: cover;
    border-radius: 10px;
`;

export const StyledThemeLightBtn = styled(Button)`
  padding: 0;
  transition: all 100ms ease-in;
  border: solid;
  border-color: ${({ bordercolor }) => bordercolor || 'transparent'};
  border-width: ${({ borderwidth }) => borderwidth || '2px'};
  border-radius: 13px;
  width: 95px;
  height: 95px;
  display: flex;
  justify-content: center;
  align-items: center;

  &:hover {
    opacity: ${({ opacity }) => opacity || '1'};
  }
`;

export const StyledThemeDarkBtn = styled(StyledThemeLightBtn)`
  background-color: ${({ theme }) => theme.colors.publicFormThemeLightBg};

 &:hover {
    opacity: 1;
    background-color: ${({ hovercolor }) => hovercolor};
  }
`;

export const StyledLinkBtn = styled(Button)`
  padding: 0;
  transition: all 200ms ease-in;
  color: ${({ theme }) => theme.colors.linkColor};
  border-radius: 13px;
  font-size: 16px;
  font-weight: 600;
  min-width: 0;
  width: fit-content;
  text-transform: none;
  &:hover {
    text-decoration: underline;
  }
`;

export const StyledDummyInput = styled.input``;
