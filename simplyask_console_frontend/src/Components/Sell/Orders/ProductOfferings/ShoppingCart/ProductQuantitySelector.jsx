import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { useState } from 'react';

import { usePopoverToggle } from '../../../../../hooks/usePopoverToggle';
import { ContextMenu, ContextMenuItem } from '../../../../Managers/shared/components/ContextMenus/StyledContextMenus';
import { StyledFlex, StyledText } from '../../../../shared/styles/styled';
import { QUANTITIES } from '../../../constants/constants';
import { StyledProductsQuantityDropdown } from '../../../StyledSellManagerContent';

const ProductQuantitySelector = ({ orderItemId, onQuantitySelect, quantity = 1 }) => {
  const [selectedQuantity, setSelectedQuantity] = useState(quantity);

  const {
    id: quantityId,
    open: isQuantitySelectorOpen,
    anchorEl,
    handleClick: handleOpenQuantitySelector,
    handleClose: handleCloseQuantitySelector,
  } = usePopoverToggle(orderItemId);

  const handleQuantitySelect = (amount) => {
    handleCloseQuantitySelector();
    setSelectedQuantity(amount);
    onQuantitySelect?.(amount);
  };

  return (
    <>
      <StyledFlex direction="row" gap="10px" alignItems="center" justifyContent="center">
        <StyledText size={14} weight={600} lh={24} wrap="nowrap">Quantity:</StyledText>
        <StyledProductsQuantityDropdown
          variant="text"
          endIcon={<ArrowDropDownIcon />}
          onClick={handleOpenQuantitySelector}
        >
          {` ${selectedQuantity}`}
        </StyledProductsQuantityDropdown>
      </StyledFlex>
      <ContextMenu
        id={quantityId}
        open={isQuantitySelectorOpen}
        anchorEl={anchorEl}
        onClose={handleCloseQuantitySelector}
        maxWidth="66px"
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        {QUANTITIES.map((amount) => (
          <ContextMenuItem
            key={amount}
            onClick={() => handleQuantitySelect(amount)}
          >
            <StyledText textAlign="center">{amount}</StyledText>
          </ContextMenuItem>
        ))}
      </ContextMenu>
    </>
  );
};

export default ProductQuantitySelector;
