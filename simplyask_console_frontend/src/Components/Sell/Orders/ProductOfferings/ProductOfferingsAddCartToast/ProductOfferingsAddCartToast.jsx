import { CloseRounded } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';

import { useLocalStorage } from '../../../../../hooks/useLocalStorage';
import { StyledButton } from '../../../../shared/REDISIGNED/controls/Button/StyledButton';
import { StyledDivider, StyledFlex, StyledText } from '../../../../shared/styles/styled';

const ProductOfferingsAddCartToast = ({
  name,
  category,
  price,
  subtotal,
  numOfCartItems,
  onViewCart,
  closeToast,
}) => {
  const { colors, boxShadows } = useTheme();

  const [localStorage] = useLocalStorage('cart', null);

  return (
    <StyledFlex
      p="25px"
      gap="15px"
      width="413px"
      borderRadius="15px"
      flex="1 1 auto"
      bgcolor={colors.white}
      boxShadow={boxShadows.table}
    >
      <StyledFlex direction="row" alignItems="center" justifyContent="space-between">
        <StyledText as="p" size={19} weight={700} lh={23}>Added to Cart</StyledText>
        <StyledFlex as="span" fontSize="36px" cursor="pointer" color={colors.primary} onClick={closeToast}>
          <CloseRounded fontSize="inherit" />
        </StyledFlex>
      </StyledFlex>
      <StyledFlex direction="row" alignItems="center" gap="0 25px">
        <StyledFlex alignItems="flex-start" flex="1 0 0" gap="5px 0">
          <StyledText as="p" size={16} weight={700} lh={20}>{name}</StyledText>
          <StyledText as="p" size={14} weight={400} lh={17} capitalize>{category}</StyledText>
        </StyledFlex>
        <StyledFlex alignItems="center" justifyContent="center">
          <StyledText as="p" size={16} weight={500} lh={24}>{`$${price.value} / ${price.unit}`}</StyledText>
        </StyledFlex>
      </StyledFlex>
      <StyledDivider color={colors.cardGridItemBorder} borderWidth={2} />
      <StyledText as="p" weight={500} lh={20} textAlign="right">
        {`Cart Subtotal (${numOfCartItems} items)`}
        :
        <StyledText display="inline" weight={700} lh={20}>{` $${subtotal}`}</StyledText>
      </StyledText>
      <StyledButton
        primary
        variant="contained"
        onClick={() => {
          onViewCart(localStorage?.req);
          closeToast();
        }}
      >
        View Cart
      </StyledButton>
    </StyledFlex>
  );
};

export default ProductOfferingsAddCartToast;
