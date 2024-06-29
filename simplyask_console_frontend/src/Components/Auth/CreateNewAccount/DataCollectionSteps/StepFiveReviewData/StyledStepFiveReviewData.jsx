import styled from '@emotion/styled';
import { StyledFlex } from '../../../../shared/styles/styled';

export const StyledRegistrationEditModalCard = styled(StyledFlex)`
  display: flex;
  padding: 30px 30px;
  box-shadow: ${({ theme }) => theme.boxShadows.headerFooterSection};
  justify-content: ${({ justifyContent }) => justifyContent || 'space-between'};
  width: 100%;
  border-radius: 15px;
  gap: 30px;
`;

export const StyledUserPromoCard = styled(StyledFlex)`
  border-radius: 10px;
  justify-content: space-between;
  padding: 15px 20px;
  flex-direction: row;
  border: 2px solid ${({ theme }) => theme.colors.grassGreen};
  width: 100%;
  display: flex;
`;

