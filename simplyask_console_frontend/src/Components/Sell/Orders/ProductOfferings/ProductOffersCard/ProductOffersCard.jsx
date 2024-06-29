import { useTheme } from '@mui/material/styles';

import { StyledButton } from '../../../../shared/REDISIGNED/controls/Button/StyledButton';
import { StyledDivider, StyledFlex } from '../../../../shared/styles/styled';
import { StyledCardMedia } from '../StyledProductOffers';

const ProductOffersCard = ({
  children,
  maxWidth,
  minWidth,
  image,
  imageAlt,
  onAddToCart,
  onLearnMore,
  onProductDetails,
  isAddToCartBtnVisible = true,
  withBorder,
}) => {
  const { colors, boxShadows, borders } = useTheme();

  const boxShadow = withBorder ? 'none' : boxShadows.productCard;
  const border = withBorder ? borders.chip.default : 'none';

  const renderCardImage = () => {
    if (!image) return null;
    // NOTE: More implementation in future tasks -> carousel
    return <StyledCardMedia image={image} alt={imageAlt || ''} />;
  };

  return (
    <StyledFlex
      maxWidth={maxWidth || '363px'}
      bgcolor={colors.white}
      boxShadow={boxShadow}
      border={border}
      borderRadius="15px"
      alignItems="flex-start"
      gap="20px"
      flexShrink="0"
      {...(minWidth && { minWidth })}
    >
      {renderCardImage()}
      <StyledFlex p="20px" gap="20px" height="100%" width="-webkit-fill-available">
        <StyledFlex flex="1 1 auto" gap="20px">
          {children}
        </StyledFlex>
        {!!onLearnMore && (
          <StyledFlex alignItems="flex-start">
            <StyledButton variant="text" onClick={onLearnMore}>Learn More</StyledButton>
          </StyledFlex>
        )}
        {isAddToCartBtnVisible && (
          <>
            <StyledDivider borderWidth={1.5} color={colors.geyser} flexItem />
            <StyledButton variant="contained" secondary onClick={onAddToCart} disabled={!onAddToCart}>Add To Cart</StyledButton>
            {!!onProductDetails && <StyledButton variant="outlined" primary onClick={onProductDetails}>View Product Details</StyledButton>}
          </>
        )}
      </StyledFlex>
    </StyledFlex>
  );
};

export default ProductOffersCard;
