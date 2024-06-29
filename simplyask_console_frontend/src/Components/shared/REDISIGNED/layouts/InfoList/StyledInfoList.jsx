import styled from '@emotion/styled';

import { StyledFlex } from '../../../styles/styled';

export const StyledInfoList = styled(StyledFlex)`
  width: 100%;
`;

export const StyledInfoListGroup = styled.div`
  width: 100%;

  ${({ noPaddings }) =>
    !noPaddings &&
    `
    &:not(:last-child) {
      padding-bottom: 30px;
      margin-bottom: 40px;
    }
    
    &  & {
      padding: 30px 0 0 0 !important;
      border-bottom: none !important;
      margin-bottom: 0 !important;
    }
  `};
`;

export const StyledInfoListTitle = styled.div`
  padding: 0 14px;
  margin-bottom: 18px;
`;

export const StyledInfoListItems = styled.div`
  display: flex;
  flex-direction: column;
`;

export const StyledInfoListItem = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 16px;
  padding: 14px;
  min-height: 50px;

  align-items: ${({ alignItems }) => alignItems || 'flex-start'};

  &:not(:last-child) {
    border-bottom: 1px solid ${({ theme }) => theme.colors.dividerColor};
  }
`;

export const StyledInfoListItemKey = styled.div`
  max-width: 40%;
  text-align: left;
  flex: 1 1;
  word-break: break-all;
`;

export const StyledInfoListItemValue = styled.div`
  flex: 1 1;
  word-break: ${({ wordBreak }) => (wordBreak || 'break-all')} ;
  display: flex;
  justify-content: flex-end;
  position: ${({ isLoading }) => (isLoading ? 'relative' : 'unset')};
`;
