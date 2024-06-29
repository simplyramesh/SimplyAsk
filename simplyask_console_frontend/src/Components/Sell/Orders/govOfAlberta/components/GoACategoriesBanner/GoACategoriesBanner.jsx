import { SatelliteAltOutlined, StayCurrentPortraitRounded, AdminPanelSettingsOutlined } from '@mui/icons-material';

import { StyledFlex, StyledText } from '../../../../../shared/styles/styled';
import { GOA_CATEGORY_TYPES } from '../../../../constants/productOptions';
import BYOCommunicatorIcon from '../../../../icons/BYOCommunicatorIcon';
import { StyledProductCategoryIconWrapper } from '../../../ProductOfferings/StyledProductOffers';

const iconMappings = {
  [GOA_CATEGORY_TYPES.PLAN_AND_DEVICE]: { icon: <SatelliteAltOutlined fontSize="inherit" />, color: 'grassGreen' },
  [GOA_CATEGORY_TYPES.PLAN]: { icon: <BYOCommunicatorIcon fontSize="inherit" />, color: 'lavenderIndigo' },
  [GOA_CATEGORY_TYPES.APP]: { icon: <StayCurrentPortraitRounded fontSize="inherit" />, color: 'azul' },
  [GOA_CATEGORY_TYPES.ADMIN]: { icon: <AdminPanelSettingsOutlined fontSize="inherit" />, color: 'secondary' },
};

const categoryIconMap = (tab) => {
  const foundKey = Object.keys(iconMappings).find((key) => tab?.categoryName === key);

  return foundKey ? iconMappings[foundKey] : { icon: null, color: 'transparent' };
};

const GoACategoriesBanner = ({ tabs, onTabChange }) => {
  const renderProductCategory = (category, index) => {
    const { icon, color } = categoryIconMap(category);

    return (
      <StyledFlex key={category?.title || index} gap="12px 0" alignItems="center" justifyContent="center" onClick={() => onTabChange(category?.title)} width="171px">
        <StyledProductCategoryIconWrapper color={color}>
          {icon}
        </StyledProductCategoryIconWrapper>
        <StyledText size={15} weight={700} lh={23} textAlign="center">{category?.title}</StyledText>
      </StyledFlex>
    );
  };

  return (
    <StyledFlex p="80px 36px" alignItems="center" justifyContent="center" gap="30px">
      <StyledFlex alignSelf="stretch" />
      <StyledFlex direction="row" alignItems="flex-start" justifyContent="center" gap="30px">
        {tabs?.reduce((acc, tab, index) => {
          if (!tab?.title) return acc;

          return [...acc, renderProductCategory(tab, index)];
        }, [])}
      </StyledFlex>
    </StyledFlex>
  );
};

export default GoACategoriesBanner;
