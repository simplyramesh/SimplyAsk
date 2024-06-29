import { useTheme } from '@mui/system';

import TrashBinIcon from '../../../shared/REDISIGNED/icons/svgIcons/TrashBinIcon';

import ProductOffersCard from './ProductOffersCard/ProductOffersCard';
import {
  ProductOffersCardPricePerUnit,
  ProductOffersCardTextBody,
  ProductOffersCardTitle,
} from './ProductOffersCard/ProductOffersCardText';
import ProductQuantitySelector from './ShoppingCart/ProductQuantitySelector';
import { StyledFlex, StyledIconButton } from '../../../shared/styles/styled';

const CartItem = ({
  orderItem,
  onRemoveItem,
  withBorder,
  isAddToCartBtnVisible,
  onQuantitySelect,
  showRemove,
  showQuantity,
}) => {
  const { colors } = useTheme();

  return (
    <ProductOffersCard withBorder={withBorder} isAddToCartBtnVisible={isAddToCartBtnVisible} maxWidth="inherit">
      <StyledFlex flexDirection="row">
        <StyledFlex flex="1 1 auto" gap="35px 0">
          <StyledFlex gap="10px 0">
            <ProductOffersCardTitle title={orderItem?.product?.name} />
            <ProductOffersCardTitle title={orderItem?.product?.description} isSubtitle />
          </StyledFlex>

          <StyledFlex gap="10px 0">
            {orderItem?.productOrderItem?.flatMap((item, index) => (
              <ProductOffersCardTextBody key={index} pre={item?.product.name || ''} />
            ))}
          </StyledFlex>
        </StyledFlex>
        <StyledFlex>
          <ProductOffersCardPricePerUnit
            flexGrow={1}
            price={orderItem?.itemPrice?.[0]?.price?.dutyFreeAmount?.value || 0}
            unit={orderItem?.itemPrice?.[0]?.price?.dutyFreeAmount?.unit || 'month'}
          />
          <StyledFlex direction="row" alignItems="center" justifyContent="flex-end" gap="0 13px">
            {showQuantity && (
              <ProductQuantitySelector
                quantity={orderItem?.quantity}
                orderItemId={orderItem?.id}
                onQuantitySelect={(value) => onQuantitySelect?.(value, orderItem?.id)}
              />
            )}
            {showRemove && (
              <StyledIconButton
                bgColor="transparent"
                hoverBgColor={colors.geyser}
                size="34px"
                iconSize="22px"
                onClick={onRemoveItem}
              >
                <TrashBinIcon />
              </StyledIconButton>
            )}
          </StyledFlex>
        </StyledFlex>
      </StyledFlex>
    </ProductOffersCard>
  );
};
export default CartItem;
