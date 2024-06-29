import { useTheme } from '@mui/material/styles';

import { StyledButton } from '../../../../../shared/REDISIGNED/controls/Button/StyledButton';
import { StyledFlex, StyledText } from '../../../../../shared/styles/styled';

const ProductOffersLandingSection = ({ title, children, onViewAll }) => {
  const { colors } = useTheme();

  return (
    <StyledFlex p="36px" bgcolor={colors.water} justifyContent="center" alignItems="center" mb="60px">
      <StyledFlex alignItems="center" gap="20px 0" width="100%">
        <StyledFlex direction="row" alignItems="center" gap="0 10px" width="100%" justifyContent="space-between">
          <StyledFlex flex="1 0 0">
            <StyledText size={24} lh={36} weight={700}>{title}</StyledText>
          </StyledFlex>
          <StyledButton primary variant="contained" onClick={onViewAll}>View All</StyledButton>
        </StyledFlex>

        <StyledFlex direction="row" flexWrap="wrap" gap="30px" justifyContent="center">
          {children}
        </StyledFlex>
      </StyledFlex>
    </StyledFlex>
  );
};

export default ProductOffersLandingSection;
