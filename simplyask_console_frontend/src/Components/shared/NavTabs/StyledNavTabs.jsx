import styled from '@emotion/styled';

import { media } from '../styles/media';

export const StyledNavTabs = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  box-shadow: ${({ theme }) => theme.boxShadows.box};
  padding: 0 36px;
  background: ${({ theme }) => theme.colors.white};
  z-index: 2;

  ${({ size }) =>
    size === 'md' &&
    `
    box-shadow: none;
    padding: 0;
    
    & > * {
      min-height: 30px !important;
    }
  `}

  .tabs {
    button {

      ${({ size }) =>
        size === 'md' &&
        `
        min-height: 25px !important;
      `}
    }
  }

  &.sell {
    box-shadow: none;
    border-bottom: 1px solid ${({ theme }) => theme.colors.dividerColor};
    font-weight: 700;

    & .MuiTabs-indicator {
      display: none;
    }

    & .tabs {
      button {
        & span {
          text-shadow: 'none' !important;
        }
      }
      & .Mui-selected {
        color: ${({ theme }) => theme.colors.secondary} !important;
      }

      & .MuiButtonBase-root {
        font-weight: 700;
        font-size: 16px !important;
        min-width: 0 !important;
        min-height: 55px !important;

        ${({ size }) =>
          size === 'md' &&
          `
        min-height: 25px !important;
      `}

        & > span {
          font-weight: normal !important;
          text-shadow: none !important;
        }
      }

      button + button {
        margin-left: 32px !important;
      }
    }

    ${media.sm} {
      button + button {
        margin-left: 15px !important;
      }
    }
  }
`;
