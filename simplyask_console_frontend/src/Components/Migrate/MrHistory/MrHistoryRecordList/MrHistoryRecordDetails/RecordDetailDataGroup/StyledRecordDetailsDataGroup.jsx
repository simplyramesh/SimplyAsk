import styled from '@emotion/styled';
import { IconButton } from '@mui/material';

import { StyledFlex } from '../../../../../shared/styles/styled';

export const StyledIconButton = styled(IconButton)`
  padding: 0;
  color: ${({ theme }) => theme.colors.black};
  & svg {
    font-size: 18px;
  }
`;

export const StyledCopyIconWrapper = styled(StyledFlex)`
  flex-direction: row;
  gap: 0 20px;
  position: absolute;
  top: 0px;
  right: 0px;
  background-color: ${({ theme }) => theme.colors.ironGray};
  width: 61px;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  border-radius: 0 10px 0 10px;
  cursor: pointer;

  &:hover {
    border: 0.5px solid ${({ theme }) => theme.colors.primary};
  }
`;
