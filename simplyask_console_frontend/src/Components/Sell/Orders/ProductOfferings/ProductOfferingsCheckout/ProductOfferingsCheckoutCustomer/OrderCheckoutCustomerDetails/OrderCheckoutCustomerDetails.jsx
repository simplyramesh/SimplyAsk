import { useGetCurrentUser } from '../../../../../../../hooks/useGetCurrentUser';
import { StyledButton } from '../../../../../../shared/REDISIGNED/controls/Button/StyledButton';
import OpenIcon from '../../../../../../shared/REDISIGNED/icons/svgIcons/OpenIcon';
import { StyledDivider, StyledFlex, StyledText } from '../../../../../../shared/styles/styled';
import { PRODUCT_FILTERS } from '../../../../../constants/productInitialValues';
import { formatPhoneNumber, getCustomerAddress } from '../../../../../utils/helpers';
import { GOVERNMENT_OF_ALBERTA } from '../../../ProductOfferings';
import ProductOffersCard from '../../../ProductOffersCard/ProductOffersCard';

const OrderCheckoutCustomerDetails = ({
  isSaved = false,
  customer,
  place,
  onViewProfile,
  onRemove,
  onEditDetails,
  onEditAddresses,
}) => {
  const { currentUser } = useGetCurrentUser();

  const isGoA = currentUser?.organization?.name === GOVERNMENT_OF_ALBERTA;

  const defaultAddresses = place?.length
    ? [
      { role: 'Service Address', ...getCustomerAddress(place, PRODUCT_FILTERS.SERVICE_ADDRESS_ROLE) },
      { role: 'Billing Address', ...getCustomerAddress(place, PRODUCT_FILTERS.BILLING_ADDRESS_ROLE) },
      { role: 'Shipping Address', ...getCustomerAddress(place, PRODUCT_FILTERS.SHIPPING_ADDRESS_ROLE) },
    ]
    : [];

  const goAAddresses = place?.length
    ? [
      { role: 'Address', ...getCustomerAddress(place, PRODUCT_FILTERS.SHIPPING_ADDRESS_ROLE) },
    ]
    : [];

  const addresses = isGoA ? goAAddresses : defaultAddresses;

  const renderText = (title, subtitle, isBold) => {
    const tag = title ? 'h3' : 'p';
    const size = title ? 19 : 16;
    const weight = isBold ? 600 : 400;
    const lh = title ? 29 : 24;

    return (
      <StyledFlex flex="1 1 auto">
        <StyledText as={tag} size={size} weight={weight} lh={lh}>
          {title || subtitle}
        </StyledText>
      </StyledFlex>
    );
  };

  const renderAddressDetails = () => (
    <StyledFlex direction="row" gap="50px">
      {addresses.map((item, index) => (
        <StyledFlex key={index} gap="8px" width="33%">
          {renderText(null, item?.role, true)}
          <StyledFlex>
            {renderText(null, item?.[PRODUCT_FILTERS.STREET_NAME])}
            {renderText(null, `${item?.[PRODUCT_FILTERS.CITY]} ${item?.[PRODUCT_FILTERS.PROVINCE] || ''}`)}
            {renderText(null, `${item?.[PRODUCT_FILTERS.COUNTRY] || ''} ${item?.[PRODUCT_FILTERS.POSTAL_CODE]}`)}
          </StyledFlex>
        </StyledFlex>
      ))}
    </StyledFlex>
  );

  const renderSelectedCustomer = () => (
    <StyledFlex gap="15px">
      <StyledFlex direction="row" gap="50px" alignItems="baseline">
        <StyledFlex gap="8px" width="33%">
          {renderText(null, 'Name', true)}
          {renderText(null, customer?.name || `${customer?.firstName} ${customer?.lastName}`)}
          {renderText(null, `#${customer?.id || ''}`)}
        </StyledFlex>
        <StyledFlex gap="8px" width="33%">
          {renderText(null, 'Email', true)}
          {renderText(null, customer?.email)}
        </StyledFlex>
        <StyledFlex gap="8px" width="33%">
          {renderText(null, 'Phone Number', true)}
          {renderText(null, formatPhoneNumber(customer?.phone))}
        </StyledFlex>
      </StyledFlex>
      <StyledDivider m="15px 0 15px 0" />
      {renderAddressDetails()}
    </StyledFlex>
  );

  const renderDetails = () => (
    <StyledFlex gap="15px">
      <StyledFlex direction="row" justifyContent="space-between">
        <StyledFlex>
          {renderText(customer?.name || `${customer?.firstName} ${customer?.lastName}`, null, true)}
          {renderText(null, `Customer ID: #${customer?.id || ''}`)}
        </StyledFlex>
        <StyledFlex direction="row" gap="15px" alignItems="center">
          {!isSaved && (
            <>
              <StyledButton
                variant="contained"
                tertiary
                onClick={onViewProfile}
                startIcon={<OpenIcon />}
              >
                View Profile
              </StyledButton>
              <StyledButton
                variant="contained"
                tertiary
                onClick={onRemove}
              >
                Remove
              </StyledButton>
            </>
          )}
        </StyledFlex>
      </StyledFlex>
      <StyledDivider m="15px 0 15px 0" />
      <StyledFlex direction="row" mb="15px">
        {renderText('Personal Details', null, true)}
        {onEditDetails && <StyledButton variant="text" onClick={onEditDetails}>Edit</StyledButton>}
      </StyledFlex>
      <StyledFlex direction="row" gap="50px">
        <StyledFlex gap="8px" width="33%">
          {renderText(null, 'Email', true)}
          {renderText(null, customer?.email)}
        </StyledFlex>
        <StyledFlex gap="8px" width="33%">
          {renderText(null, 'Phone Number', true)}
          {renderText(null, formatPhoneNumber(customer?.phone))}
        </StyledFlex>
        <StyledFlex width="33%" />
      </StyledFlex>
      <StyledDivider m="15px 0 15px 0" />
      <StyledFlex direction="row" mb="15px">
        {renderText('Addresses', null, true)}
        {onEditAddresses && <StyledButton variant="text" onClick={onEditAddresses}>Edit</StyledButton>}
      </StyledFlex>
      {renderAddressDetails()}
    </StyledFlex>
  );

  return (
    isSaved
      ? renderSelectedCustomer()
      : (
        <ProductOffersCard maxWidth="inherit" withBorder isAddToCartBtnVisible={false}>
          {renderDetails()}
        </ProductOffersCard>
      )
  );
};

export default OrderCheckoutCustomerDetails;
