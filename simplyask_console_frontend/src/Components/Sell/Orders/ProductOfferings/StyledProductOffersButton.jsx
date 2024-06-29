import styled from '@emotion/styled';

import { StyledButton } from '../../../shared/REDISIGNED/controls/Button/StyledButton';

export const WaterStyledButton = styled(StyledButton, {
  shouldForwardProp: (prop) => prop !== 'water',
})((props) => ({
  backgroundColor: props.theme.colors.water,
  borderColor: props.theme.colors.black,
  color: props.theme.colors.black,

  '&:hover': {
    backgroundColor: props.theme.colors.primary,
    borderColor: props.theme.colors.primary,
    color: props.theme.colors.white,
    boxShadow: 'none',
  },
}));
