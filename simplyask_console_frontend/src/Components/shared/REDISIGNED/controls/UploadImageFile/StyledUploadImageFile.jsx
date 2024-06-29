import styled from '@emotion/styled';

import { StyledFlex, StyledTextField } from '../../../styles/styled';

export const StyledUploadImageInput = styled(StyledTextField)`
  padding: 0;
  cursor: pointer;
  height: 100%;
  position: relative;
  transition:
    background-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,
    border-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;

  &:hover {
    cursor: pointer;
    background-color: ${({ theme }) => theme.colors.bgColorOptionTwo};
  }

  & .MuiOutlinedInput-root {
    display: flex;
    align-items: center;
    padding: 0;
  }

  & .MuiOutlinedInput-input {
    opacity: 0;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    &:hover {
      cursor: pointer;
    }
  }

  & .MuiOutlinedInput-notchedOutline {
    display: none;
  }

  & .MuiInputAdornment-root {
    pointer-events: none;
    height: 100%;
    max-height: 100%;
    gap: 15px;

    & .notranslate {
      display: none;
    }

    & .MuiButton-startIcon {
      width: 12px;
      height: 15px;
    }
  }
`;

export const StyledPreviewWrapper = styled(StyledFlex)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 59px;
  border: ${({ theme }) => `1px solid ${theme.colors.timberwolfGray}`};
  border-radius: 10px;
  background-color: ${({ theme }) => theme.colors.white};
  padding: 2px;
`;
