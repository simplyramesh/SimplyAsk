import styled from '@emotion/styled';

import { StyledButton } from '../../../../../../shared/REDISIGNED/controls/Button/StyledButton';

export const StyledStepItemSidebar = styled.div`
  display: flex;
  flex-direction: column;
  width: 500px;
  height: 100%;
  box-shadow: ${({ theme }) => theme.boxShadows.box};
  background: ${({ theme }) => theme.colors.white};
  z-index: 199;
  position: relative;
  flex-shrink: 0;
`;

export const StyledGenerateVariantsButton = styled(StyledButton)(({ theme }) => ({
  backgroundColor: theme.colors.secondary,
  borderColor: theme.colors.secondary,
  color: theme.colors.white,
  lineHeight: '24px',

  '& .MuiSvgIcon-root': {
    '&[data-testid="ArrowForwardIosRoundedIcon"]': {
      transform: 'rotate(90deg)',
    },
  },

  '&:hover': {
    backgroundColor: theme.colors.darkOrangeShadeSecond,
    borderColor: theme.colors.darkOrangeShadeSecond,
    color: theme.colors.white,
    boxShadow: 'none',
  },

  ':disabled': {
    opacity: '0.5',
    backgroundColor: `${theme.colors.secondary}`,
    borderColor: `${theme.colors.secondary}`,
    color: `${theme.colors.white}`,
  },
}));
