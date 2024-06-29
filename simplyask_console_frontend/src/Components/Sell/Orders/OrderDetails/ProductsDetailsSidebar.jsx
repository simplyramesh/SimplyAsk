import { useTheme } from '@emotion/react';

import { useGetCurrentUser } from '../../../../hooks/useGetCurrentUser';
import { BASE_DATE_FORMAT, getInFormattedUserTimezone } from '../../../../utils/timeUtil';
import BaseTicketStatus from '../../../shared/REDISIGNED/layouts/BaseTicketStatus/BaseTicketStatus';
import InfoList from '../../../shared/REDISIGNED/layouts/InfoList/InfoList';
import InfoListGroup from '../../../shared/REDISIGNED/layouts/InfoList/InfoListGroup';
import InfoListItem from '../../../shared/REDISIGNED/layouts/InfoList/InfoListItem';
import CustomSidebar from '../../../shared/REDISIGNED/sidebars/CustomSidebar/CustomSidebar';
import {
  StyledDivider, StyledFlex, StyledText,
} from '../../../shared/styles/styled';
import { PRODUCT_INVENTORY_STATUS_COLORS, PRODUCT_INVENTORY_STATUS_MAPPED_LABELS } from '../../constants/constants';
import { PRODUCT_FILTERS } from '../../constants/productInitialValues';
import { getTotalSummary, goAProductPrice } from '../../utils/helpers';
import { GOVERNMENT_OF_ALBERTA } from '../ProductOfferings/ProductOfferings';
import { StyledListItem } from '../ProductOfferings/StyledProductOffers';

const ProductsDetailsSidebar = ({
  isOpen,
  onClose,
  customerProducts,
}) => {
  const { colors, statusColors } = useTheme();

  const { currentUser } = useGetCurrentUser();

  const isGoA = currentUser?.organization?.name === GOVERNMENT_OF_ALBERTA;

  const productPrice = (price) => {
    if (isGoA) {
      const pp = goAProductPrice(price);

      return `$${pp?.price || 0} / ${pp?.unit || 'month'}`;
    }

    return `$${getTotalSummary(price)?.total || 0} / month`;
  };

  return (
    <CustomSidebar
      open={isOpen}
      onClose={onClose}
      headerTemplate={<StyledText weight={500} lh={20}>{customerProducts?.name}</StyledText>}
    >
      {() => isOpen && (
        <StyledFlex p="30px 20px">
          <StyledFlex mb="45px">
            <StyledText weight={600} size={24} lh={36}>{customerProducts?.name}</StyledText>
          </StyledFlex>
          <InfoList>
            <InfoListGroup title="Details" noPaddings>
              <InfoListItem name="Purchase Date">
                {getInFormattedUserTimezone(customerProducts?.[PRODUCT_FILTERS.CREATED_DATE], currentUser?.timezone, BASE_DATE_FORMAT)}
              </InfoListItem>
              <InfoListItem name="Billing Date">
                {getInFormattedUserTimezone(customerProducts?.[PRODUCT_FILTERS.CREATED_DATE], currentUser?.timezone, BASE_DATE_FORMAT)}
              </InfoListItem>
              <InfoListItem name="Price">
                {productPrice(customerProducts?.[PRODUCT_FILTERS.PRODUCT_PRICE])}
              </InfoListItem>
              <InfoListItem name="Status">
                <BaseTicketStatus
                  bgColor={PRODUCT_INVENTORY_STATUS_COLORS(statusColors)[customerProducts?.[PRODUCT_FILTERS.STATUS]]?.bg}
                  color={PRODUCT_INVENTORY_STATUS_COLORS(statusColors)[customerProducts?.[PRODUCT_FILTERS.STATUS]]?.color}
                >
                  {PRODUCT_INVENTORY_STATUS_MAPPED_LABELS(customerProducts?.[PRODUCT_FILTERS.STATUS])}
                </BaseTicketStatus>
              </InfoListItem>
            </InfoListGroup>
          </InfoList>
          <StyledDivider m="40px 0 40px 0" color={colors.regentGray} borderWidth={2} />
          <StyledText size={19} weight={600} lh={23} mb={42}>Product Specifications</StyledText>
          <StyledFlex gap="15px 0">
            <StyledText size={16} weight={600} lh={22}>Includes:</StyledText>
            <StyledFlex gap="40px">
              <StyledFlex as="ul" direction="row" p={0} gap="10px 0" flexWrap="wrap">
                {customerProducts?.productRelationship?.map((item, index) => (
                  <StyledListItem key={index}>
                    <StyledText size={14}>{item.product.name}</StyledText>
                  </StyledListItem>
                ))}
              </StyledFlex>
            </StyledFlex>
          </StyledFlex>
        </StyledFlex>
      )}
    </CustomSidebar>
  );
};

export default ProductsDetailsSidebar;
