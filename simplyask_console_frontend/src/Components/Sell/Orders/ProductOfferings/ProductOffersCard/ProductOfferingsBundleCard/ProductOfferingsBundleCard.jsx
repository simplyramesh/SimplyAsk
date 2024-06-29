import { Fragment } from 'react';

import { useGetCurrentUser } from '../../../../../../hooks/useGetCurrentUser';
import { StyledFlex, StyledStatus } from '../../../../../shared/styles/styled';
import { getExpiryDate } from '../../../../utils/helpers';
import ProductOffersCard from '../ProductOffersCard';
import { ProductOffersCardPricePerUnit, ProductOffersCardTextBody, ProductOffersCardTitle } from '../ProductOffersCardText';

const ProductOfferingsBundleCard = ({
  title, description, price, unit, strikeThrough, expiryDate, savings, onAddToCart, bundledOffers = [],
}) => {
  const { currentUser } = useGetCurrentUser();

  return (
    <ProductOffersCard onAddToCart={onAddToCart}>
      <ProductOffersCardTitle title={title} />
      <StyledFlex gap="12px 0">
        <ProductOffersCardPricePerUnit price={price} unit={unit} strikeThrough={strikeThrough} color="secondary" />
        <StyledStatus color="savingsGreen">{`SAVE $${savings.price} / ${savings.unit}`}</StyledStatus>
        <ProductOffersCardTextBody bold="Offer Expires:" post={getExpiryDate(expiryDate, currentUser?.timezone)} />
      </StyledFlex>
      {bundledOffers.map((offer) => (
        <Fragment key={offer.title}>
          <ProductOffersCardTitle
            isSubtitle
            title={offer.title}
            icon={offer.icon}
            pricePerUnit={{
              price: offer?.pricePerUnit?.price,
              unit: offer?.pricePerUnit?.unit || 'month',
            }}
          />
          <StyledFlex>
            <ProductOffersCardTextBody pre={description} wrap="wrap" />
          </StyledFlex>
          <StyledFlex gap="10px 0">
            {offer?.body.map((item, index) => <ProductOffersCardTextBody key={index} pre={item?.pre || ''} bold={item?.bold || ''} post={item?.post || ''} />)}
          </StyledFlex>
        </Fragment>
      ))}
    </ProductOffersCard>
  );
};

export default ProductOfferingsBundleCard;
