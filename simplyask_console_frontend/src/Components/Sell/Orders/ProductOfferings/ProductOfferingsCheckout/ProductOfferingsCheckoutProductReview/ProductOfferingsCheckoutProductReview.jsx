import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

import routes from '../../../../../../config/routes';
import { useGetCurrentUser } from '../../../../../../hooks/useGetCurrentUser';
import { useLocalStorage } from '../../../../../../hooks/useLocalStorage';
import { StyledFlex, StyledText } from '../../../../../shared/styles/styled';
import GoACartItem from '../../../govOfAlberta/components/GoACartItem';
import CartItem from '../../CartItem';
import { GOVERNMENT_OF_ALBERTA } from '../../ProductOfferings';

const ProductOfferingsCheckoutProductReview = ({
  title, orderItems, onRemoveItem, onQuantitySelect,
}) => {
  const navigate = useNavigate();
  const { statusColors: { savingsGreen } } = useTheme();

  const [localStorage, setLocalStorage] = useLocalStorage('cart', null);

  const { currentUser } = useGetCurrentUser();

  const isGoA = currentUser?.organization?.name === GOVERNMENT_OF_ALBERTA;

  return (
    <StyledFlex gap="20px">
      {title && (
        <StyledText size={16} weight={500}>
          {title}
        </StyledText>
      )}
      {orderItems?.estimatedDelivery && (
        <StyledText size={19} weight={600} color={savingsGreen.color}>
          {`Estimated Delivery: ${orderItems?.estimatedDelivery}`}
        </StyledText>
      )}
      {orderItems?.map((orderItem, itemIndex) => (isGoA
        ? (
          <GoACartItem
            withBorder
            orderItem={orderItem}
            isAddToCartBtnVisible={false}
            key={itemIndex}
            showRemove={localStorage?.products?.data?.some((product) => product.id === orderItem.productOffering.id)}
            onRemoveItem={() => {
              setLocalStorage(null);
              navigate(routes.PRODUCT_OFFERINGS);
            }}
          />
        )
        : (
          <CartItem
            withBorder
            orderItem={orderItem}
            isAddToCartBtnVisible={false}
            key={itemIndex}
            showRemove={onRemoveItem || false}
            onRemoveItem={() => onRemoveItem(orderItem.id, orderItem.productOffering.id)}
            onQuantitySelect={onQuantitySelect}
          />
        )))}
    </StyledFlex>

  );
};
export default ProductOfferingsCheckoutProductReview;
