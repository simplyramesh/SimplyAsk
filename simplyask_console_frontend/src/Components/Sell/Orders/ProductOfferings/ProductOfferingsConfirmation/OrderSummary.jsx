import { useTheme } from '@emotion/react';

import { StyledDivider, StyledFlex, StyledText } from '../../../../shared/styles/styled';
import { getTotalSummary } from '../../../utils/helpers';
import ProductOfferingsCheckoutProductReview from '../ProductOfferingsCheckout/ProductOfferingsCheckoutProductReview/ProductOfferingsCheckoutProductReview';
import OrderSummaryDetailItem from '../ShoppingCart/ShoppingCartOrderSummary/OrderSummaryDetailItem';
import { StyledOrderSummary } from '../ShoppingCart/StyledShoppingCart';

const OrderSummary = ({ orderItems }) => {
  const { colors } = useTheme();
  const totalSummary = getTotalSummary(orderItems);

  return (
    <StyledFlex gap="20px">
      <ProductOfferingsCheckoutProductReview orderItems={orderItems} />
      <StyledOrderSummary width="100%" bgcolor={colors.water} gap="20px">
        <StyledFlex gap="10px" size={16} width="100%">
          <OrderSummaryDetailItem
            label={`Subtotal (${orderItems?.length || 0} Items):`}
            value={`$${totalSummary.total}`}
          />
          <OrderSummaryDetailItem
            label="Savings:"
            value={`${totalSummary.savings > 0 ? '-' : ''}$${totalSummary.savings}`}
            color={colors.statusResolved}
          />
          <OrderSummaryDetailItem
            label="Coupon:"
            value={`${(totalSummary.couponSavings ?? 0) > 0 ? '-' : ''}$${(totalSummary.couponSavings ?? 0)}`}
            color={colors.statusResolved}
          />
          <OrderSummaryDetailItem
            label="Shipping and Handling:"
            value="FREE"
          />
          <OrderSummaryDetailItem
            label="Estimated Taxes:"
            value={`$${totalSummary.estimatedTaxes}` || 'TBD'}
          />
        </StyledFlex>
        <StyledFlex gap="20px" width="100%">
          <StyledDivider borderWidth={1.5} color={colors.oceanBlue} />
        </StyledFlex>
        <StyledFlex direction="row" justifyContent="space-between" width="100%">
          <StyledFlex width={263} alignItems="start">
            <StyledText size={19} weight={700}>
              Total:
            </StyledText>
          </StyledFlex>
          <StyledFlex alignItems="end">
            <StyledText weight={700}>
              {`$${totalSummary.estimatedTotal}`}
            </StyledText>
          </StyledFlex>
        </StyledFlex>
        <StyledFlex gap="10px">
          <StyledText weight={400} size={15}>
            {'All prices are in '}
            <StyledText display="inline" size={15} weight={600}>Canadian Dollars (CAD)</StyledText>
          </StyledText>
        </StyledFlex>
      </StyledOrderSummary>
    </StyledFlex>
  );
};

export default OrderSummary;
