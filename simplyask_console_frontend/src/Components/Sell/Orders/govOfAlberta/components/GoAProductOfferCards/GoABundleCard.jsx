import { useTheme } from '@emotion/react';

import { StyledFlex, StyledText } from '../../../../../shared/styles/styled';
import ProductOffersCard from '../../../ProductOfferings/ProductOffersCard/ProductOffersCard';
import { GoAProductOffersCardPricePerUnit, ProductOffersCardTextBody } from '../../../ProductOfferings/ProductOffersCard/ProductOffersCardText';
import { convertTitle, getIconFromTitle } from '../../utils/imageSelector';

const GoABundleCard = ({
  title, price, unit, body = [], description, onAddToCart, onLearnMore, isBundle,
}) => {
  const { colors } = useTheme();
  const titleIconEnum = convertTitle(title);

  const imageIcon = getIconFromTitle(titleIconEnum);
  const bgColor = titleIconEnum === 'synchMobile' ? colors.mirage : 'transparent';

  const renderCardImage = () => {
    if (!imageIcon) return null;

    return (
      <StyledFlex
        as="span"
        alignItems="center"
        justifyContent="center"
        fontSize="194px"
        p="28px 0"
      >
        {imageIcon}
      </StyledFlex>
    );
  };

  return (
    <ProductOffersCard
      onAddToCart={onAddToCart}
      onLearnMore={onLearnMore}
      minWidth="363px"
    >
      {imageIcon
        ? (
          <StyledFlex bgcolor={bgColor} mx="-20px" mt="-20px" borderRadius="15px 15px 0 0">
            {renderCardImage()}
          </StyledFlex>
        )
        : null}
      <StyledText as="h3" size={20} weight={700} lh={24}>{title}</StyledText>
      <StyledFlex flex="1 1 auto">
        <GoAProductOffersCardPricePerUnit price={price} unit={unit} isBundle={isBundle} />
      </StyledFlex>
      <StyledFlex flex="1 1 auto">
        <ProductOffersCardTextBody pre={description} wrap="wrap" />
      </StyledFlex>
      <StyledFlex gap="10px 0">
        {body.map((item, index) => <ProductOffersCardTextBody key={index} pre={item?.pre || ''} bold={item?.bold || ''} post={item?.post || ''} />)}
      </StyledFlex>
    </ProductOffersCard>
  );
};

export default GoABundleCard;
