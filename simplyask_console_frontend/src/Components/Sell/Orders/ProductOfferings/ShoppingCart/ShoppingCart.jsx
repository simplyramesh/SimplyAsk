import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import routes from '../../../../../config/routes';
import { StyledButton } from '../../../../shared/REDISIGNED/controls/Button/StyledButton';
import TrashBinIcon from '../../../../shared/REDISIGNED/icons/svgIcons/TrashBinIcon';
import ConfirmationModal from '../../../../shared/REDISIGNED/modals/ConfirmationModal/ConfirmationModal';
import { StyledFlex, StyledText } from '../../../../shared/styles/styled';
import EmptyCartSvg from '../../../icons/EmptyCartSvg';
import CartItem from '../CartItem';
import OrderingLayout from '../OrderingLayout';

import ShoppingCartOrderSummary from './ShoppingCartOrderSummary/ShoppingCartOrderSummary';

const ShoppingCart = ({ orderItems = [], onRemoveItem, onRemoveAll }) => {
  const navigate = useNavigate();

  const [removeItemsModal, setRemoveItemsModal] = useState(null);

  const renderShoppingCartOrderSummary = (order) => (
    <StyledFlex backgroundColor="transparent">
      <ShoppingCartOrderSummary orderItems={order} />
    </StyledFlex>
  );

  const renderCardDetails = (cartItems) => (
    <>
      <StyledFlex flex="1 0 0" p="36px 30px 20px 0">
        <StyledText size={24} weight={700} lh={36}>
          My Cart
        </StyledText>
      </StyledFlex>

      <StyledFlex gap="20px 0">
        <StyledFlex direction="row" alignItems="center" justifyContent="space-between">
          <StyledText weight={600} lh={24}>{`All Items (${cartItems?.length || 0})`}</StyledText>
          <StyledButton
            variant="text"
            startIcon={<TrashBinIcon />}
            onClick={() => setRemoveItemsModal(cartItems?.length)}
          >
            <StyledText weight={600} lh={24} color="inherit">
              Remove All Items
            </StyledText>
          </StyledButton>
        </StyledFlex>
        {cartItems.map((orderItem, itemIndex) => (
          <CartItem
            isAddToCartBtnVisible={false}
            key={itemIndex}
            orderItem={orderItem}
            showRemove
            onRemoveItem={() => {
              onRemoveItem?.(orderItem.id, orderItem.productOffering.id);
            }}
          />
        ))}
      </StyledFlex>
    </>
  );
  const renderEmptyCart = () => (
    <StyledFlex alignItems="center" justifyContent="center" mt="20%" width="100%">
      <StyledFlex as="span" fontSize="155px">
        <EmptyCartSvg fontSize="inherit" />
      </StyledFlex>
      <StyledText size={16} weight={700}>
        Your Shopping Cart is Empty
      </StyledText>
      <StyledFlex mt={3.5}>
        <StyledButton variant="contained" secondary onClick={() => navigate(routes.PRODUCT_OFFERINGS)}>
          Shop Now
        </StyledButton>
      </StyledFlex>
    </StyledFlex>
  );

  return (
    <>
      <OrderingLayout
        leftSlot={orderItems?.length === 0 ? renderEmptyCart() : renderCardDetails(orderItems)}
        rightSlot={renderShoppingCartOrderSummary(orderItems)}
      />
      <ConfirmationModal
        isOpen={!!removeItemsModal}
        onCloseModal={() => setRemoveItemsModal(null)}
        onSuccessClick={() => {
          setRemoveItemsModal(null);
          onRemoveAll?.();
        }}
        alertType="WARNING"
        title="Are You Sure?"
        text={`You are about to remove all ${removeItemsModal} items from your cart. Are you sure you want to proceed?`}
      />
    </>
  );
};
export default ShoppingCart;
