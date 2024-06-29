import { useTheme } from '@mui/material/styles';
import Scrollbars from 'react-custom-scrollbars-2';

import { useGetCurrentUser } from '../../../../../hooks/useGetCurrentUser';
import CenterModalFixed from '../../../../shared/REDISIGNED/modals/CenterModalFixed/CenterModalFixed';
import {
  StyledDivider, StyledFlex, StyledText,
} from '../../../../shared/styles/styled';
import { getExpiryDate } from '../../../utils/helpers';
import { ProductOffersCardPricePerUnit, ProductOffersCardTextBody } from '../ProductOffersCard/ProductOffersCardText';
import { StyledListItem } from '../StyledProductOffers';

const OfferDetailsModal = ({ open, closeFunction, product }) => {
  const { currentUser } = useGetCurrentUser();
  const { colors } = useTheme();
  return (
    <CenterModalFixed
      open={open}
      onClose={closeFunction}
      width="800px"
      enableScrollbar={false}
    >
      <StyledFlex p="20px 30px 30px 30px">
        <StyledText lh={24} weight={700} size={20}>{product?.title}</StyledText>
      </StyledFlex>
      <Scrollbars autoHeight autoHeightMin={100} autoHeightMax="80vh">
        <StyledFlex p="0 30px 30px 30px" gap="20px" width="-webkit-fill-available">
          <StyledFlex flex="1 1 auto" gap="20px">
            <StyledFlex>
              <ProductOffersCardPricePerUnit price={product?.pricePerUnit?.price} unit={product?.pricePerUnit?.unit || 'month'} />
              <ProductOffersCardTextBody bold="Offer Expires:" post={getExpiryDate(product?.expiryDate, currentUser?.timezone)} />
            </StyledFlex>
            <StyledFlex>
              <ProductOffersCardTextBody pre={product?.description} wrap="wrap" />
            </StyledFlex>
            <ProductOffersCardTextBody pre="All prices are in" bold="Canadian Dollars ($CAD)" />
            <StyledDivider borderWidth={1.5} color={colors.geyser} flexItem />
            <StyledText size={16} weight={600} lh="140%">Features:</StyledText>
            <StyledFlex gap="10px 0" as="ul" p={0}>
              {product?.body.map((item, index) => (
                <StyledListItem key={index}>
                  <ProductOffersCardTextBody
                    key={index}
                    pre={item?.pre || ''}
                    bold={item?.bold || ''}
                    post={item?.post || ''}
                  />
                </StyledListItem>
              ))}
            </StyledFlex>

            <StyledText size={16} weight={600} lh="140%">Includes:</StyledText>
            <StyledFlex gap="40px">
              <StyledFlex as="ul" direction="row" p={0} gap="10px 0" flexWrap="wrap">
                {product?.product?.bundledProductOffering?.map((item, index) => (
                  <StyledListItem key={index}>
                    <StyledText size={14}>{item.name}</StyledText>
                  </StyledListItem>
                ))}
              </StyledFlex>
            </StyledFlex>
          </StyledFlex>
        </StyledFlex>
      </Scrollbars>
    </CenterModalFixed>
  );
};
export default OfferDetailsModal;
