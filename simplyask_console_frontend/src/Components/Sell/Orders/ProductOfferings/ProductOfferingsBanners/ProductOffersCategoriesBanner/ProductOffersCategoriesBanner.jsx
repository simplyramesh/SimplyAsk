import { WifiRounded } from '@mui/icons-material';

import { StyledFlex, StyledText } from '../../../../../shared/styles/styled';
import { PLANS } from '../../../../constants/constants';
import GiftIcon from '../../../../icons/GiftIcon';
import TVIcon from '../../../../icons/TVIcon';
import { StyledProductCategoryIconWrapper } from '../../StyledProductOffers';

const CATEGORY_ICONS = {
  [PLANS.INTERNET]: <WifiRounded fontSize="inherit" />,
  [PLANS.TV]: <TVIcon fontSize="inherit" />,
  [PLANS.BUNDLES]: <GiftIcon fontSize="inherit" />,
};

const ProductOffersCategoriesBanner = ({ onTabChange }) => {
  const renderProductCategory = (category, color) => (
    <StyledFlex gap="12px 0" onClick={() => onTabChange(category)}>
      <StyledProductCategoryIconWrapper color={color}>{CATEGORY_ICONS[category]}</StyledProductCategoryIconWrapper>
      <StyledText size={15} weight={600} lh={23} textAlign="center">
        {category}
      </StyledText>
    </StyledFlex>
  );

  return (
    <StyledFlex p="80px 36px" alignItems="center" justifyContent="center" gap="30px">
      <StyledText weight={700} size={24} lh={36}>
        Shop Featured Categories
      </StyledText>
      <StyledFlex direction="row" alignItems="flex-start" justifyContent="center" gap="30px">
        {renderProductCategory(PLANS.INTERNET, 'vikingBlue')}
        {renderProductCategory(PLANS.TV, 'secondary')}
        {renderProductCategory(PLANS.BUNDLES, 'darkHotPink')}
      </StyledFlex>
    </StyledFlex>
  );
};

export default ProductOffersCategoriesBanner;
