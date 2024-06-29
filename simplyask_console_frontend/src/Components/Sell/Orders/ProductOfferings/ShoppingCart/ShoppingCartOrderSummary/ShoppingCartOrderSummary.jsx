import { useTheme } from '@emotion/react';
import { useFormik } from 'formik';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import routes from '../../../../../../config/routes';
import { StyledButton } from '../../../../../shared/REDISIGNED/controls/Button/StyledButton';
import AccessManagementIcons from '../../../../../shared/REDISIGNED/icons/CustomTableIcons';
import { StyledDivider, StyledFlex, StyledText } from '../../../../../shared/styles/styled';
import { getTotalSummary } from '../../../../utils/helpers';
import {
  StyledPromoCodeInput, StyledSavingsApplied, StyledOrderSummary, StyledCheckoutButton,
} from '../StyledShoppingCart';

import OrderSummaryDetailItem from './OrderSummaryDetailItem';

const ShoppingCartOrderSummary = ({
  orderItems = [], hideProceedToCheckout, width, hidePromoCodeInput,
}) => {
  const { colors } = useTheme();
  const navigate = useNavigate();

  const [promotionApplied, setPromotionApplied] = useState(null); // Will be changed to UseQuery in future

  const {
    values, errors, handleChange, touched, handleBlur,
  } = useFormik({
    initialTouched: false,
    initialValues: {
      inputPromoCode: '',
    },
  });

  const totalSummary = getTotalSummary(orderItems);

  const removePromoCode = () => setPromotionApplied(null);

  const renderPromotionDetails = () => (
    <OrderSummaryDetailItem
      label="Coupon(SAVE10):"
      value="$9.00"
      color={colors.statusResolved}
    />
  );

  const renderSuccessfulPromoCodeDetails = () => (
    <StyledSavingsApplied direction="row" justifyContent="space-between" width="100%" gap="10px">
      <StyledFlex direction="column" width={width || 234}>
        <StyledText color={colors.grassGreen} weight={600} size={16}>
          {`${values.inputPromoCode || 'SAVINGS10'} Applied`}
        </StyledText>
        <StyledText size={14}>-$9.00 (10% OFF)</StyledText>
      </StyledFlex>
      <StyledFlex weight={600} size={16} pr={1} pt={1.5}>
        <StyledButton variant="text" onClick={removePromoCode}>Remove</StyledButton>
      </StyledFlex>
    </StyledSavingsApplied>
  );

  const renderPromoCodeInput = () => (
    <StyledFlex gap="20px">
      <StyledDivider borderWidth={2} color={colors.oceanBlue} />

      <StyledFlex direction="row" justifyContent="space-between" width="100%" gap="12px">
        <StyledPromoCodeInput
          id="inputPromoCode"
          name="inputPromoCode"
          placeholder="Enter Coupon/Promo Code..."
          value={values.inputPromoCode}
          onChange={handleChange}
          invalid={errors.inputPromoCode && touched.inputPromoCode}
          onBlur={handleBlur}
          onDoubleClick={removePromoCode}
        />
        <StyledButton
          primary
          variant="contained"
          onClick={() => {
            const appliedPromoCode = values.inputPromoCode === 'SAVE10' ? {} : null;

            setPromotionApplied(appliedPromoCode);
          }}
        >
          Apply
        </StyledButton>
      </StyledFlex>
      {((errors.inputPromoCode && touched.inputPromoCode)) && (
        <StyledFlex direction="row" mt={-2}>
          <AccessManagementIcons margin="-25px 0px 0px 0px" icon="ERROR" width={18} color={colors.validationError} />
          <StyledText size={12} weight={600} color={colors.statusOverdue} mb={10}>
            This code does not exist. Check your spelling and try again
          </StyledText>
        </StyledFlex>
      )}
      {promotionApplied && renderSuccessfulPromoCodeDetails()}
      <StyledDivider borderWidth={2} color={colors.oceanBlue} />
    </StyledFlex>
  );

  return (
    <StyledOrderSummary bgcolor={colors.water} gap="20px" width={width}>
      <StyledText size={19} weight={700}>Order Summary</StyledText>
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
        {promotionApplied && renderPromotionDetails()}
        <OrderSummaryDetailItem
          label="Shipping and Handling:"
          value="FREE"
        />
        <OrderSummaryDetailItem
          label="Estimated Taxes:"
          value={`$${totalSummary.estimatedTaxes}` || 'TBD'}
        />
      </StyledFlex>
      {!hidePromoCodeInput && renderPromoCodeInput()}

      <StyledFlex direction="row" justifyContent="space-between" width="100%">
        <StyledFlex width={263} alignItems="start">
          <StyledText weight={700}>
            Estimated Total:
          </StyledText>
        </StyledFlex>
        <StyledFlex alignItems="end">
          <StyledText weight={700}>
            {`$${totalSummary.estimatedTotal}`}
          </StyledText>
        </StyledFlex>
      </StyledFlex>
      {!hideProceedToCheckout && (
        <StyledFlex width="100%">
          <StyledCheckoutButton
            secondary
            disabled={orderItems?.length === 0}
            variant="contained"
            onClick={() => navigate(`${routes.PRODUCT_OFFERINGS_CHECKOUT}`)}
          >
            Proceed to Checkout
          </StyledCheckoutButton>
        </StyledFlex>
      )}
      <StyledFlex gap="10px">
        <StyledText weight={400} size={15}>
          {'All prices are in '}
          <StyledText display="inline" size={15} weight={600}>Canadian Dollars (CAD)</StyledText>
        </StyledText>
        {!hideProceedToCheckout && (
          <StyledText weight={400} size={15}>
            Shipping & taxes calculated during checkout.
          </StyledText>
        )}
      </StyledFlex>
    </StyledOrderSummary>
  );
};

export default ShoppingCartOrderSummary;
