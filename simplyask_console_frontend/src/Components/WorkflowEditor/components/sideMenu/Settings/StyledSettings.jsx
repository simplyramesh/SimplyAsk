import styled from '@emotion/styled';

import { StyledButton } from '../../../../shared/REDISIGNED/controls/Button/StyledButton';

export const StyledStaticDynamicButton = styled(StyledButton, {
  shouldForwardProp: (prop) => !['isLeft', 'isRight'].includes(prop),
})(({
  isLeft, isRight, primary, secondary, theme,
}) => ({
  flex: '1 1 auto',
  ...(isLeft && {
    borderRadius: '10px 0 0 10px',
    ...(secondary && {
      color: theme.colors.secondary,
      backgroundColor: `${theme.colors.secondary}1F`,
    }),
    ...(primary && {
      borderRight: 0,
      '&:hover': {
        border: 0,
        borderLeft: '2px solid',
      },
    }),
  }),
  ...(isRight && {
    borderRadius: '0 10px 10px 0',
    ...(secondary && {
      color: theme.colors.secondary,
      backgroundColor: `${theme.colors.secondary}1F`,
    }),
    ...(primary && {
      borderLeft: 0,
      '&:hover': {
        border: 0,
      },
    }),
  }),
}));
