import { useTheme } from '@emotion/react';

import TrashBinIcon from '../../../../shared/REDISIGNED/icons/svgIcons/TrashBinIcon';
import { StyledFlex, StyledIconButton, StyledText } from '../../../../shared/styles/styled';
import { extractGoAProductBodyData, formatNumberToCurrency } from '../../../utils/helpers';
import ProductOffersCard from '../../ProductOfferings/ProductOffersCard/ProductOffersCard';
import { convertTitle, getIconFromTitle } from '../utils/imageSelector';

const GoACartItem = ({
  orderItem,
  onRemoveItem,
  withBorder,
  isAddToCartBtnVisible,
  showRemove,
  isSummary = false,
}) => {
  const { colors } = useTheme();
  const titleIconEnum = convertTitle(orderItem?.productOffering?.name);

  const imageIcon = getIconFromTitle(titleIconEnum);
  const bgColor = titleIconEnum === 'synchMobile' ? colors.mirage : 'transparent';

  const priceArr = orderItem?.itemPrice || orderItem?.productPrice || [];

  const priceText = extractGoAProductBodyData(orderItem?.itemPrice || []);

  const orderItemPrice = priceArr.reduce((acc, item) => {
    if (item.priceType !== 'recurring') {
      if (!isSummary) return acc;

      if (item.priceType === 'onetime' && !priceArr.some((price) => price.priceType === 'recurring')) {
        return {
          ...acc,
          price: formatNumberToCurrency(item.price.dutyFreeAmount.value),
          unit: null,
          priceWithTax: item?.price?.taxIncludedAmount?.value || item?.price?.dutyFreeAmount?.value || 0,
          currency: item.unitOfMeasure,
        };
      }
    }

    return {
      ...acc,
      price: formatNumberToCurrency(item.price.dutyFreeAmount.value),
      unit: 'month',
      priceWithTax: item?.price?.taxIncludedAmount?.value || item?.price?.dutyFreeAmount?.value || 0,
      currency: item.unitOfMeasure,
    };
  }, { price: 0, unit: 'month' });

  const renderCardImage = () => {
    if (!imageIcon) return null;

    return (
      <StyledFlex
        as="span"
        alignItems="center"
        justifyContent="center"
        fontSize="130px"
        maxHeight="130px"
        p="28px 0"
      >
        {imageIcon}
      </StyledFlex>
    );
  };
  return (
    <ProductOffersCard
      withBorder={withBorder}
      isAddToCartBtnVisible={isAddToCartBtnVisible}
      maxWidth="inherit"
    >
      <StyledFlex position="relative" direction="row" alignItems="center" gap="0 15px" alignSelf="stretch">
        {imageIcon
          ? (
            <StyledFlex bgcolor={bgColor} borderRadius="10px">
              {renderCardImage()}
            </StyledFlex>
          )
          : null}
        <StyledFlex
          gap="20px"
          alignItems="flex-start"
          flex="1 1 auto"
        >
          <StyledFlex alignItems="flex-start" gap="16px">
            <StyledFlex alignItems="flex-start" gap="8px">
              <StyledText as="h4" weight={700} lh={20}>{orderItem?.productOffering?.name}</StyledText>
              <StyledText as="h5" size={14} weight={500} lh={17}>{orderItem?.productOffering?.description}</StyledText>
            </StyledFlex>
            <StyledFlex alignItems="flex-start" gap="8px">
              {priceText?.map((price, index) => (
                <StyledText key={index} as="p" size={14} weight={400} lh={17}>
                  {`${price?.pre}: `}
                  <StyledText as="span" display="inline" size={14} weight={500} lh={17}>{price?.bold}</StyledText>
                </StyledText>
              ))}
            </StyledFlex>
          </StyledFlex>
        </StyledFlex>
        <StyledFlex
          justifyContent="center"
          alignItems="flex-end"
          gap="10px"
          flex="1 0 0"
          alignSelf="stretch"
        >
          <StyledFlex
            height="55px"
            alignItems="flex-end"
            gap="5px"
            flex="1 0 0"
          >
            <StyledText size={19} lh={29} wrap="nowrap">{`$${orderItemPrice?.price || 0} ${orderItemPrice?.unit ? `/ ${orderItemPrice?.unit}` : ''}`}</StyledText>
          </StyledFlex>
          {showRemove && (
            <StyledFlex
              justifyContent="center"
              alignItems="flex-end"
            >
              <StyledIconButton
                bgColor="transparent"
                hoverBgColor={colors.geyser}
                size="34px"
                iconSize="22px"
                onClick={onRemoveItem}
              >
                <TrashBinIcon />
              </StyledIconButton>
            </StyledFlex>
          )}
        </StyledFlex>
      </StyledFlex>
    </ProductOffersCard>
  );
};

export default GoACartItem;
