import styled from '@emotion/styled';
import { Badge } from '@mui/material';
import Stack from '@mui/material/Stack';

import {
  StyledGeneralTabButton,
  StyledGeneralTabSide,
  StyledGeneralTabSideHeader,
} from '../GeneralTab/StyledGeneralTab';

export const StyledProfileTabSide = styled(StyledGeneralTabSide)``;

export const StyledProfileTabSideHeader = styled(StyledGeneralTabSideHeader)`
  flex-direction: column;
  align-items: flex-start;
  gap: 14px;
  background-color: transparent;
  padding: 36px 30px 0px 36px;
  margin-bottom: 42px;
`;

export const StyledProfileTabButton = styled(StyledGeneralTabButton)`
  gap: 2px;
  padding: 8px 12px;
  width: 150px;
`;

export const StyledProfileAvatarBadge = styled(Badge)``;

export const StyledProfileTabActionMenu = styled(Stack)`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 10px 2px;
  background: ${({ theme }) => theme.colors.background};
  box-shadow: ${({ theme }) => theme.boxShadows.box};
  border-radius: 10px;
`;
