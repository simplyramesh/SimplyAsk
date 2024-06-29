import { useTheme } from '@emotion/react';
import { KeyboardArrowRightRounded, KeyboardArrowLeftRounded } from '@mui/icons-material';
import { useState } from 'react';
import Scrollbars from 'react-custom-scrollbars-2';
import { Panel, PanelGroup } from 'react-resizable-panels';
import { useParams } from 'react-router-dom';

import CopyIcon from '../../../../Assets/icons/copy.svg?component';
import useCopyToClipboard from '../../../../hooks/useCopyToClipboard';
import { useGetCurrentUser } from '../../../../hooks/useGetCurrentUser';
import { BASE_DATE_FORMAT, getInFormattedUserTimezone } from '../../../../utils/timeUtil';
import DownloadIcon from '../../../shared/REDISIGNED/icons/svgIcons/DownloadIcon';
import { StyledTooltip } from '../../../shared/REDISIGNED/tooltip/StyledTooltip';
import {
  StyledDivider,
  StyledExpandButton,
  StyledFlex,
  StyledResizeHandle,
  StyledText,
  StyledPanelSlider,
} from '../../../shared/styles/styled';
import { ORDER_DETAILS_RECEIPT_IDS } from '../../constants/constants';
import { PRODUCT_FILTERS } from '../../constants/productInitialValues';
import useGetProductCustomer from '../../hooks/useGetProductCustomer';
import { useGetMultipleProductInventory } from '../../hooks/useGetProductInventory';
import useGetProductOrder from '../../hooks/useGetProductOrder';
import { getOrderConfig } from '../../utils/helpers';
import { generateMultipleElPdf } from '../../utils/orderReceiptPdf';
import GoACartItem from '../govOfAlberta/components/GoACartItem';
import GoAShoppingCartOrderSummary from '../govOfAlberta/components/GoAShoppingCartOrderSummary';
import { GOVERNMENT_OF_ALBERTA } from '../ProductOfferings/ProductOfferings';
import ProductOfferingsCheckoutOrderConfigurations from '../ProductOfferings/ProductOfferingsCheckout/ProductOfferingsCheckoutOrderConfig/ProductOfferingsCheckoutOrderConfigurations';
import ProductOffersCard from '../ProductOfferings/ProductOffersCard/ProductOffersCard';
import {
  ProductOffersCardPricePerUnit,
  ProductOffersCardTextBody,
  ProductOffersCardTitle,
} from '../ProductOfferings/ProductOffersCard/ProductOffersCardText';
import ShoppingCartOrderSummary from '../ProductOfferings/ShoppingCart/ShoppingCartOrderSummary/ShoppingCartOrderSummary';

import OrderDetailsRightPanel from './OrderDetailsRightPanel';

const OrderDetails = () => {
  const { orderId } = useParams();
  const { colors, boxShadows, statusColors } = useTheme();

  const { currentUser } = useGetCurrentUser();

  const { copyToClipboard } = useCopyToClipboard();

  const [isPanelOpen, setIsPanelOpen] = useState(true);
  const [copyMessage, setCopyMessage] = useState('Copy URL of Order');

  const isGoA = currentUser?.organization?.name === GOVERNMENT_OF_ALBERTA;

  const { orders } = useGetProductOrder({
    id: orderId,
    options: {
      enabled: !!orderId,
      select: (data) => {
        const topOffers = data?.productOrderItem?.filter((order) => order?.topOffer);

        return {
          data,
          orderItems: topOffers,
          customerInfo: topOffers?.[0]?.product?.relatedParty?.[0],
        };
      },
    },
  });

  const { customers } = useGetProductCustomer({
    filterParams: {
      [PRODUCT_FILTERS.ID]: [orders?.customerInfo?.id],
    },
    options: {
      enabled: !!orders?.customerInfo?.id,
      select: (data) => {
        const orderCustomer = data?.[0];

        return {
          ...orderCustomer,
          name: orderCustomer?.name ? orderCustomer?.name : `${orderCustomer?.firstName} ${orderCustomer?.lastName}`,
        };
      },
    },
  });

  const { inventories } = useGetMultipleProductInventory({
    ids: orders?.orderItems?.map((item) => item?.productId),
  });

  const handleDownload = () => {
    generateMultipleElPdf(
      [
        { id: ORDER_DETAILS_RECEIPT_IDS.MAIN, width: '70%' },
        {
          id: ORDER_DETAILS_RECEIPT_IDS.SIDE,
          width: '30%',
          x: '75%',
          y: '5%',
        },
      ],
      currentUser?.timezone,
      'Order Receipt'
    );
  };

  return (
    <PanelGroup autoSaveId="order-details-view" direction="horizontal">
      <Panel defaultSize={65}>
        <StyledFlex backgroundColor={colors.white} height="100%" boxShadow={boxShadows.box}>
          <Scrollbars>
            <StyledFlex id={ORDER_DETAILS_RECEIPT_IDS.MAIN}>
              <StyledFlex p="30px" gap="16px">
                <StyledText weight="600" size="24" lh="29">
                  {`Sales Order# ${orderId}`}
                </StyledText>
              </StyledFlex>
              <StyledDivider orientation="horizontal" height="2px" />
              <StyledFlex p="30px">
                <StyledFlex mb={7}>
                  {isGoA ? (
                    <GoAShoppingCartOrderSummary
                      orderItems={orders?.orderItems}
                      hideProceedToCheckout
                      width="100%"
                      hidePromoCodeInput
                    />
                  ) : (
                    <ShoppingCartOrderSummary
                      orderItems={orders?.orderItems}
                      hideProceedToCheckout
                      width="100%"
                      hidePromoCodeInput
                    />
                  )}
                </StyledFlex>
                <StyledFlex mb={7}>
                  <StyledText mb={16} weight={600} lh={20}>
                    Products
                  </StyledText>
                  <StyledFlex gap="20px">
                    <StyledText size={19} weight={600} lh={29} color={statusColors.savingsGreen.color}>
                      {`Estimated Delivery: ${getInFormattedUserTimezone(orders?.data?.[PRODUCT_FILTERS.ESTIMATED_DELIVERY_DATE], currentUser?.timezone, BASE_DATE_FORMAT)}`}
                    </StyledText>
                    {inventories?.map((item, index) =>
                      isGoA ? (
                        <GoACartItem
                          key={index}
                          orderItem={item}
                          withBorder
                          isAddToCartBtnVisible={false}
                          showRemove={false}
                          isBundle={inventories?.length > 1}
                          isSummary
                        />
                      ) : (
                        <ProductOffersCard key={index} withBorder isAddToCartBtnVisible={false} maxWidth="inherit">
                          <StyledFlex flexDirection="row">
                            <StyledFlex flex="1 1 auto" gap="35px 0">
                              <StyledFlex gap="10px 0">
                                <ProductOffersCardTitle title={item?.name} />
                                <ProductOffersCardTextBody key={index} pre={item?.description || ''} />
                              </StyledFlex>
                            </StyledFlex>
                            <StyledFlex>
                              <ProductOffersCardPricePerUnit
                                flexGrow={1}
                                price={item?.productPrice?.[0]?.price?.dutyFreeAmount?.value || 0}
                                unit="month"
                              />
                            </StyledFlex>
                          </StyledFlex>
                        </ProductOffersCard>
                      )
                    )}
                  </StyledFlex>
                </StyledFlex>
                <StyledFlex>
                  <StyledText mb={16} weight={600} lh={20}>
                    Order Configurations
                  </StyledText>
                  <ProductOfferingsCheckoutOrderConfigurations
                    isConfigEditable={false}
                    orderConfig={getOrderConfig(orders?.data)}
                  />
                </StyledFlex>
              </StyledFlex>
            </StyledFlex>
          </Scrollbars>
        </StyledFlex>
      </Panel>
      <StyledResizeHandle data-html2canvas-ignore="true">
        <StyledExpandButton top="75%" right="0" onClick={() => setIsPanelOpen((prev) => !prev)}>
          {isPanelOpen ? <KeyboardArrowRightRounded /> : <KeyboardArrowLeftRounded />}
        </StyledExpandButton>
      </StyledResizeHandle>
      <StyledPanelSlider defaultSize={35} minSize={35} maxSize={40} isOpen={isPanelOpen}>
        <StyledFlex
          boxShadow={boxShadows.box}
          height="100%"
          position="relative"
          backgroundColor={colors.white}
          p="30px 0 30px 30px"
        >
          <StyledFlex p="0 30px 10px 10px" direction="row" gap="10px" justifyContent="flex-end" alignItems="flex-start">
            <StyledTooltip
              title={copyMessage}
              arrow={copyMessage !== 'Copied!'}
              placement="top"
              p="10px 15px"
              maxWidth="auto"
            >
              <StyledFlex
                as="span"
                width="38px"
                height="38px"
                padding="8px 8px 8px 10px"
                cursor="pointer"
                borderRadius="7px"
                backgroundColor={colors.graySilver}
                onClick={() => {
                  copyToClipboard(`${window.location.href}`);
                  setCopyMessage('Copied!');
                }}
                onMouseLeave={() => setCopyMessage('Copy URL of Order')}
              >
                <CopyIcon />
              </StyledFlex>
            </StyledTooltip>
            <StyledTooltip title="Download Receipt" arrow placement="top" p="10px 15px" maxWidth="auto">
              <StyledFlex
                as="span"
                width="38px"
                height="38px"
                padding="8px 8px 8px 8px"
                cursor="pointer"
                borderRadius="7px"
                backgroundColor={colors.graySilver}
                onClick={handleDownload}
              >
                <DownloadIcon />
              </StyledFlex>
            </StyledTooltip>
          </StyledFlex>
          <Scrollbars id="order-details-view-panel">
            <OrderDetailsRightPanel customerInfo={customers} orderInfo={orders?.data} />
          </Scrollbars>
        </StyledFlex>
      </StyledPanelSlider>
    </PanelGroup>
  );
};

export default OrderDetails;
