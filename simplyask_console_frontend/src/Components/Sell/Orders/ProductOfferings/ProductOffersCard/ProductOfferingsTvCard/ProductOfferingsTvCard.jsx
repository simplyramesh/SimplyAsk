import { useGetCurrentUser } from '../../../../../../hooks/useGetCurrentUser';
import { StyledFlex } from '../../../../../shared/styles/styled';
import { getExpiryDate } from '../../../../utils/helpers';
import ProductOffersCard from '../ProductOffersCard';
import { ProductOffersCardPricePerUnit, ProductOffersCardTextBody, ProductOffersCardTitle } from '../ProductOffersCardText';

const ProductOfferingsTvCard = ({
  title, price, unit, expiryDate, body = [], description, onLearnMore, onAddToCart,
}) => {
  const { currentUser } = useGetCurrentUser();

  return (
    <ProductOffersCard
      onAddToCart={onAddToCart}
      onLearnMore={onLearnMore}
      minWidth="363px"
    >
      <ProductOffersCardTitle title={title} />
      <StyledFlex>
        <ProductOffersCardPricePerUnit price={price} unit={unit} />
        <ProductOffersCardTextBody bold="Offer Expires:" post={getExpiryDate(expiryDate, currentUser?.timezone)} />
      </StyledFlex>
      <StyledFlex>
        <ProductOffersCardTextBody pre={description} wrap="wrap" />
      </StyledFlex>
      <StyledFlex gap="10px 0">
        {body.map((item, index) => <ProductOffersCardTextBody key={index} pre={item?.pre || ''} bold={item?.bold || ''} post={item?.post || ''} />)}
      </StyledFlex>
    </ProductOffersCard>
  );
};

export default ProductOfferingsTvCard;
