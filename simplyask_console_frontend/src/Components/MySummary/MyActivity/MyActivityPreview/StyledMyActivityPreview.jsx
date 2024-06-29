import styled from '@emotion/styled';
import { Card } from 'simplexiar_react_components';

import { media } from '../../../shared/styles/media';

export const StyledMyActivityPreview = styled(Card)`
  margin: 0;
  padding-left: 0;
  padding-right: 0;
  width: 100%;
  max-width: 639px;

  ${media.lg} {
    max-width: none;
  }

  & > * {
    padding-left: 2rem;
    padding-right: 2rem;
  }
`;

export const StyledMyActivityContent = styled.div`
  min-height: 80px;
  padding-top: 30px;
  padding-bottom: 30px;
  border-top: 1px solid ${({ theme }) => theme.colors.cardGridItemBorder};
`;

export const StyledMyActivityFooter = styled.div`
  padding-top: 30px;
  border-top: 1px solid ${({ theme }) => theme.colors.cardGridItemBorder};
`;
