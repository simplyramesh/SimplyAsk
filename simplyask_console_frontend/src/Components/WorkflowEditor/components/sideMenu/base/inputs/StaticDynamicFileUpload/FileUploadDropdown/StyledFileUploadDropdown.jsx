import styled from '@emotion/styled';
import { StyledLoadingButton } from '../../../../../../../shared/REDISIGNED/controls/Button/StyledButton';

export const StyledFileUploadTypeButton = styled(StyledLoadingButton)(({ theme }) => ({
  '& .MuiSvgIcon-root': {
    '&[data-testid="ArrowForwardIosRoundedIcon"]': {
      transform: 'rotate(90deg)',
    },
  },
}));

export const StyledUploadFromLocalSystemLabel = styled.label`
  color: ${({ theme }) => theme.colors.primary};
  line-height: 20px;
  font-weight: 400;
  cursor: pointer;
`;
