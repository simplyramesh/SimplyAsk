import { useTheme } from '@emotion/react';
import { CloseRounded } from '@mui/icons-material';
import React from 'react';

import { useLocalStorage } from '../../../../../../hooks/useLocalStorage';
import { StyledButton } from '../../../../../shared/REDISIGNED/controls/Button/StyledButton';
import { StyledDivider, StyledFlex, StyledText } from '../../../../../shared/styles/styled';

const GoAProductOfferingToast = ({
  name,
  category,
  price,
  otherCosts,
  subtotal,
  numOfCartItems,
  onViewCart,
  closeToast,
  onUndo,
}) => {
  const { colors, boxShadows } = useTheme();

  const [localStorage] = useLocalStorage('cart', null);

  return (
    <StyledFlex
      p="25px"
      gap="15px"
      width="413px"
      borderRadius="15px"
      flex="1 1 auto"
      bgcolor={colors.white}
      boxShadow={boxShadows.table}
    >
      <StyledFlex direction="row" alignItems="center" justifyContent="space-between">
        <StyledText as="p" size={19} weight={700} lh={23}>Added to Cart</StyledText>
        <StyledFlex as="span" fontSize="36px" cursor="pointer" color={colors.primary} onClick={closeToast}>
          <CloseRounded fontSize="inherit" />
        </StyledFlex>
      </StyledFlex>
      <StyledFlex direction="row" alignItems="center" gap="0 25px">
        <StyledFlex alignItems="flex-start" flex="1 0 0" gap="5px 0">
          <StyledText as="p" size={16} weight={700} lh={20}>{name}</StyledText>
          <StyledText as="p" size={14} weight={400} lh={17} capitalize>{category}</StyledText>
        </StyledFlex>
        <StyledFlex alignItems="flex-end" justifyContent="center" gap="8px">
          <StyledText as="p" size={16} weight={500} lh={24}>{`$${price.price} / ${price.unit}`}</StyledText>
          <StyledFlex alignItems="flex-end">
            {otherCosts?.map((cost, index) => (
              <StyledText key={index} as="span" display="inline" size={14} weight={500} lh={17}>{cost?.bold}</StyledText>
            ))}
          </StyledFlex>
        </StyledFlex>
      </StyledFlex>
      <StyledDivider color={colors.cardGridItemBorder} borderWidth={2} />
      <StyledText as="p" weight={500} lh={20} textAlign="right">
        {`Cart Subtotal (${numOfCartItems} items):`}
        <StyledText display="inline" weight={700} lh={20}>{` $${subtotal}`}</StyledText>
      </StyledText>
      <StyledButton
        primary
        variant="contained"
        onClick={() => {
          onViewCart(localStorage?.req);
          closeToast();
        }}
      >
        View Cart
      </StyledButton>
      {onUndo
        ? (
          <StyledFlex alignItems="flex-start">
            <StyledButton
              primary
              variant="text"
              onClick={() => {
                onUndo?.();
                closeToast();
              }}
            >
              Undo
            </StyledButton>
          </StyledFlex>
        )
        : null}
    </StyledFlex>
  );
};

export default GoAProductOfferingToast;
