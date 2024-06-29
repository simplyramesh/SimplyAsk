import styled from '@emotion/styled';

export const StyledPanelNavTabs = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  background: transparent;
  z-index: 2;

  & > div {
    padding: 0 28px;
  }

  &::before {
    content: '';
    width: 100%;
    position: absolute;
    background: ${({ theme }) => theme.colors.cardGridItemBorder};
    height: 1px;
    bottom: 8px;
  }

  .tabs {
    button {
      font-size: 16px !important;
      min-width: 0 !important;
      min-height: 40px !important;
      display: flex;
      flex-direction: row-reverse;
      gap: 6px;

      & > span {
        font-weight: normal !important;
        text-shadow: 1px 0 0 black !important;
      }
    }

    button + button {
      margin-left: 32px !important;
    }

    span {
      bottom: 6px;
      border-radius: 8px;
    }
  }
`;
