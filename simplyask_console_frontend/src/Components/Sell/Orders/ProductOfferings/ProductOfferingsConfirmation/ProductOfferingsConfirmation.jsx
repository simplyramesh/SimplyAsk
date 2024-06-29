import React from 'react';
import { useNavigate } from 'react-router-dom';

import UndrawHappyBirthday from '../../../../../Assets/icons/undrawHappyBirthday.svg?component';
import routes from '../../../../../config/routes';
import { useGetCurrentUser } from '../../../../../hooks/useGetCurrentUser';
import { useLocalStorage } from '../../../../../hooks/useLocalStorage';
import { LOCAL_STORAGE_KEYS } from '../../../../../utils/constants';
import { StyledButton } from '../../../../shared/REDISIGNED/controls/Button/StyledButton';
import DownloadIcon from '../../../../shared/REDISIGNED/icons/svgIcons/DownloadIcon';
import OpenIcon from '../../../../shared/REDISIGNED/icons/svgIcons/OpenIcon';
import { StyledFlex, StyledText } from '../../../../shared/styles/styled';
import { ORDER_DETAILS_RECEIPT_IDS } from '../../../constants/constants';
import {
  constructFullName,
  getOrderConfig,
  getProductConfiguration,
  getIsGoaProductConfigurationsEnabled,
} from '../../../utils/helpers';
import { generateMultipleElPdf } from '../../../utils/orderReceiptPdf';
import GoAShoppingCartOrderSummary from '../../govOfAlberta/components/GoAShoppingCartOrderSummary';
import { GOVERNMENT_OF_ALBERTA } from '../ProductOfferings';
import ProductOfferingsConfirmationBanner from '../ProductOfferingsBanners/ProductOfferingConfirmationBanner/ProductOfferingCartBanner';
import OrderCheckoutCustomerDetails from '../ProductOfferingsCheckout/ProductOfferingsCheckoutCustomer/OrderCheckoutCustomerDetails/OrderCheckoutCustomerDetails';
import ProductOfferingsCheckoutOrderConfigurations from '../ProductOfferingsCheckout/ProductOfferingsCheckoutOrderConfig/ProductOfferingsCheckoutOrderConfigurations';
import ProductOfferingsCheckoutProductConfigurations from '../ProductOfferingsCheckout/ProductOfferingsCheckoutProductConfig/ProductOfferingsCheckoutProductConfigurations';
import { WaterStyledButton } from '../StyledProductOffersButton';

import AccordianConfirmation from './AccordianConfirmation';
import OrderSummary from './OrderSummary';
import { StyledConfirmationAccordion } from './StyledProductOfferingsConfirmation';

const ProductOfferingsConfirmation = () => {
  const navigate = useNavigate();

  const { currentUser } = useGetCurrentUser();
  const isGoACustomer = currentUser?.organization?.name === GOVERNMENT_OF_ALBERTA;

  const [localStorage, setLocalStorage] = useLocalStorage(LOCAL_STORAGE_KEYS.CART, null);

  const isProductConfigEnabled = getIsGoaProductConfigurationsEnabled(
    isGoACustomer,
    localStorage?.placedOrderCategories
  );

  const productOrder = localStorage?.placeOrder?.productOrder;
  const relatedParty = productOrder?.productOrderItem?.[0]?.product?.relatedParty?.[0];
  const places = productOrder?.productOrderItem?.[0]?.product?.place;

  const selectedProduct = getProductConfiguration(localStorage);

  const handleDownload = () => {
    generateMultipleElPdf(
      [{ id: ORDER_DETAILS_RECEIPT_IDS.MAIN, width: '100%' }],
      currentUser?.timezone,
      'Order Receipt'
    );
  };

  const happyBirthdayBanner = (name, email, order) => (
    <StyledConfirmationAccordion>
      <StyledFlex p="25px 25px 25px 25px">
        <StyledFlex direction="row" alignItems="center" justifyContent="center">
          <StyledFlex>
            <UndrawHappyBirthday />
          </StyledFlex>
          <StyledFlex position="absolute" right="25px" top="30px" data-html2canvas-ignore="true">
            <WaterStyledButton variant="contained" water startIcon={<DownloadIcon />} onClick={handleDownload}>
              Download Receipt
            </WaterStyledButton>
          </StyledFlex>
        </StyledFlex>
        <StyledFlex margin="20px auto 0 auto" alignItems="center">
          <StyledText size={24} weight={700}>
            Thank You For Your Order!
          </StyledText>
          <StyledText textAlign="center" mt={15} size={16} weight={400}>
            Your order for
            <strong>{name}</strong> was successfully placed. We sent the order details to the customer at
            <br />
            <strong>{email}.</strong>
          </StyledText>
        </StyledFlex>
        <StyledFlex
          margin="20px auto 0 auto"
          direction="row"
          justifyContent="space-between"
          gap="10px"
          alignItems="center"
        >
          <StyledText size={16} weight={600}>
            Order Number:{' '}
          </StyledText>
          <StyledText size={16}>{order}</StyledText>
        </StyledFlex>
        <StyledFlex
          margin="20px auto 0 auto"
          direction="row"
          gap="10px"
          alignItems="center"
          data-html2canvas-ignore="true"
        >
          <StyledButton primary variant="contained">
            Manage Your Order
          </StyledButton>
          <StyledButton
            primary
            variant="contained"
            onClick={() => {
              setLocalStorage(null);
              navigate(routes.PRODUCT_OFFERINGS, { replace: true });
            }}
          >
            Start a New Order
          </StyledButton>
        </StyledFlex>
      </StyledFlex>
    </StyledConfirmationAccordion>
  );

  return (
    <>
      <ProductOfferingsConfirmationBanner />
      <StyledFlex id={ORDER_DETAILS_RECEIPT_IDS.MAIN} p="36px 150px 36px 150px" gap="30px">
        {happyBirthdayBanner(
          constructFullName(relatedParty),
          `${relatedParty?.email}`,
          `#${localStorage?.placeOrder?.productOrderId || ''}`
        )}
        <AccordianConfirmation title="Order Summary">
          {isGoACustomer ? (
            <GoAShoppingCartOrderSummary
              orderItems={productOrder?.productOrderItem}
              hideProceedToCheckout
              hidePromoCodeInput
              width="100%"
              showItems
            />
          ) : (
            <OrderSummary orderItems={productOrder?.productOrderItem} />
          )}
        </AccordianConfirmation>
        <AccordianConfirmation
          title="Customer"
          actionSlot={
            relatedParty && (
              <StyledButton
                variant="contained"
                tertiary
                startIcon={<OpenIcon />}
                onClick={() => window.open(`${routes.CUSTOMER_MANAGER}/${relatedParty?.id}`, '_blank')}
                data-html2canvas-ignore="true"
              >
                View Profile
              </StyledButton>
            )
          }
        >
          <OrderCheckoutCustomerDetails isSaved customer={relatedParty} place={places} />
        </AccordianConfirmation>
        {isProductConfigEnabled && (
          <AccordianConfirmation title="Product Configurations">
            <ProductOfferingsCheckoutProductConfigurations
              isConfigEditable={false}
              productDetails={localStorage?.productDetails}
              selectedProduct={selectedProduct}
            />
          </AccordianConfirmation>
        )}
        <AccordianConfirmation title="Order Configurations">
          <ProductOfferingsCheckoutOrderConfigurations
            isConfigEditable={false}
            orderConfig={getOrderConfig(productOrder)}
          />
        </AccordianConfirmation>
      </StyledFlex>
    </>
  );
};
export default ProductOfferingsConfirmation;
