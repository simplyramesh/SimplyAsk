import styled from '@emotion/styled';
import { Card } from 'simplexiar_react_components';

export const StyledMyActivitySection = styled(Card)`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

export const StyledSwitchHolder = styled.span`
  display: flex;
  align-items: center;
  gap: 10px;
`;

export const StyledSwitchLabel = styled.label`
  font-size: 16px;
  line-height: 20px;
  font-weight: 500;
`;

export const StyledActivityPart = styled.div`
  & > ul {
    padding: 0 20px !important;
  }
`;

export const StyledActivityPartTitle = styled.div`
  padding: 20px;
  margin-bottom: 30px;
  background-color: ${({ theme }) => theme.colors.shortcutItemHoverBg};
`;
