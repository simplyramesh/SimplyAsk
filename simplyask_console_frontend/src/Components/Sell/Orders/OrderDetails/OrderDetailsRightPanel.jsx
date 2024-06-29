import { useTheme } from '@emotion/react';
import { useNavigate } from 'react-router-dom';

import routes from '../../../../config/routes';
import { useGetCurrentUser } from '../../../../hooks/useGetCurrentUser';
import { BASE_DATE_FORMAT, BASE_TIME_FORMAT, getInFormattedUserTimezone } from '../../../../utils/timeUtil';
import { StyledButton } from '../../../shared/REDISIGNED/controls/Button/StyledButton';
import OpenIcon from '../../../shared/REDISIGNED/icons/svgIcons/OpenIcon';
import BaseTicketStatus from '../../../shared/REDISIGNED/layouts/BaseTicketStatus/BaseTicketStatus';
import InfoListGroup from '../../../shared/REDISIGNED/layouts/InfoList/InfoListGroup';
import InfoListItem from '../../../shared/REDISIGNED/layouts/InfoList/InfoListItem';
import {
  StyledDivider, StyledFlex, StyledText,
} from '../../../shared/styles/styled';
import { ORDER_DETAILS_RECEIPT_IDS, PRODUCT_ORDER_STATUS_COLORS } from '../../constants/constants';
import { PRODUCT_FILTERS } from '../../constants/productInitialValues';
import { getCustomerAddress } from '../../utils/helpers';
import GoACustomerProfileOrgDetails from '../govOfAlberta/components/GoACustomer/GoACustomerProfileOrgDetails';
import { GOVERNMENT_OF_ALBERTA } from '../ProductOfferings/ProductOfferings';

const OrderDetailsRightPanel = ({ orderInfo, customerInfo }) => {
  const navigate = useNavigate();
  const { statusColors } = useTheme();

  const { currentUser } = useGetCurrentUser();

  const isGoACustomer = currentUser?.organization?.name === GOVERNMENT_OF_ALBERTA;

  const statusColor = PRODUCT_ORDER_STATUS_COLORS(statusColors)[orderInfo?.state];

  const infoListNameStyles = { wrap: 'nowrap' };

  const renderAddressDetails = (item) => (
    <StyledFlex alignItems="flex-end">
      <StyledText as="p" size={16} weight={400} lh={24}>
        {item?.streetName || ''}
      </StyledText>
      <StyledText as="p" size={16} weight={400} lh={24}>
        {`${item?.[PRODUCT_FILTERS.CITY] ? `${item?.[PRODUCT_FILTERS.CITY]},` : ''} ${item?.[PRODUCT_FILTERS.PROVINCE] || ''} `}
      </StyledText>
      <StyledText as="p" size={16} weight={400} lh={24}>
        {`${item?.[PRODUCT_FILTERS.COUNTRY] ? `${item?.[PRODUCT_FILTERS.COUNTRY]}, ` : ''}${item?.[PRODUCT_FILTERS.POSTAL_CODE] || ''}`}
      </StyledText>
    </StyledFlex>
  );

  return (
    <StyledFlex id={ORDER_DETAILS_RECEIPT_IDS.SIDE} gap="15px" pr="30px">
      <StyledFlex>
        <InfoListGroup title="Order Details" noPaddings>
          <InfoListItem name="Order Status" alignItems="center" nameStyles={infoListNameStyles}>
            <BaseTicketStatus
              bgColor={statusColor?.bg}
              color={statusColor?.color}
            >
              {orderInfo?.state}
            </BaseTicketStatus>
          </InfoListItem>
          <InfoListItem name="Order Date" alignItems="center" nameStyles={infoListNameStyles}>
            <StyledFlex>
              <StyledText
                as="p"
                weight={500}
                lh={20}
                textAlign="right"
              >
                {getInFormattedUserTimezone(orderInfo?.[PRODUCT_FILTERS.ORDER_START_DATE], currentUser?.timezone, BASE_DATE_FORMAT) || '-'}
              </StyledText>
              <StyledText
                as="p"
                weight={500}
                lh={20}
                textAlign="right"
              >
                {getInFormattedUserTimezone(orderInfo?.[PRODUCT_FILTERS.ORDER_START_DATE], currentUser?.timezone, BASE_TIME_FORMAT) || '-'}
              </StyledText>
            </StyledFlex>
          </InfoListItem>
          <InfoListItem name="Order Fulfillment" alignItems="center" nameStyles={infoListNameStyles}>
            <StyledButton
              variant="text"
              startIcon={<OpenIcon />}
              onClick={() => navigate({
                pathname: routes.PROCESS_HISTORY,
                search: orderInfo?.procInstanceId ? `procInstanceId=${orderInfo?.procInstanceId}` : '',
              })}
            >
              <StyledText weight={600} lh={20} color="inherit" wrap="nowrap">View in the Process History</StyledText>
            </StyledButton>
          </InfoListItem>
        </InfoListGroup>
        <StyledDivider m="30px 0" />
        <InfoListGroup title="Customer Details" noPaddings>

          <InfoListItem name="Customer ID" nameStyles={infoListNameStyles}>{`#${customerInfo?.[PRODUCT_FILTERS.ID]}`}</InfoListItem>
          {!isGoACustomer
            ? <InfoListItem name="BAN" nameStyles={infoListNameStyles}>{customerInfo?.ban || ''}</InfoListItem>
            : null}
          <InfoListItem name="Email" nameStyles={infoListNameStyles}>{customerInfo?.[PRODUCT_FILTERS.EMAIL] || ''}</InfoListItem>
          <InfoListItem name="Phone Number" nameStyles={infoListNameStyles}>
            {customerInfo?.[PRODUCT_FILTERS.PHONE_NUMBER]
              ? customerInfo?.[PRODUCT_FILTERS.PHONE_NUMBER]?.replace(/(\+\d)(\d{3})(\d{3})(\d{4})/, '$1 ($2) $3-$4')
              : ''}
          </InfoListItem>
          <InfoListItem name={isGoACustomer ? 'Address' : 'Shipping Address'} nameStyles={infoListNameStyles}>
            {renderAddressDetails(getCustomerAddress(customerInfo?.place, PRODUCT_FILTERS.SHIPPING_ADDRESS_ROLE))}
          </InfoListItem>
          {!isGoACustomer
            ? (
              <>
                <InfoListItem name="Service Address" nameStyles={infoListNameStyles}>
                  {renderAddressDetails(getCustomerAddress(customerInfo?.place, PRODUCT_FILTERS.SERVICE_ADDRESS_ROLE))}
                </InfoListItem>
                <InfoListItem name="Billing Address" nameStyles={infoListNameStyles}>
                  {renderAddressDetails(getCustomerAddress(customerInfo?.place, PRODUCT_FILTERS.BILLING_ADDRESS_ROLE))}
                </InfoListItem>
              </>
            )
            : null}
        </InfoListGroup>
        {isGoACustomer
          ? <GoACustomerProfileOrgDetails customers={customerInfo} />
          : null}
      </StyledFlex>
    </StyledFlex>
  );
};

export default OrderDetailsRightPanel;
