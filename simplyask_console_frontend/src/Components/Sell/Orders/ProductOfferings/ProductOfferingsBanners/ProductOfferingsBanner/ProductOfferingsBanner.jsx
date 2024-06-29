import { useTheme } from '@mui/material/styles';

import { useGetCurrentUser } from '../../../../../../hooks/useGetCurrentUser';
import { StyledFlex } from '../../../../../shared/styles/styled';
import { COMPANIES } from '../../../../constants/constants';
import JumbotronGradientIcon from '../../../../icons/JumbotronGradientIcon';
import { StyledProductOfferingsBanner } from '../../StyledProductOffers';

import ProductOfferingsBannerContent from './ProductOfferingsBannerContent/ProductOfferingsBannerContent';

const ProductOfferingsBanner = () => {
  const { companyColors } = useTheme();
  const { currentUser } = useGetCurrentUser();

  const companyName = currentUser?.organizationName;
  const companyColor = Object.values(COMPANIES).reduce((acc, value) => {
    if (value.name === companyName) {
      acc = companyColors[value.colorKey];
    }
    return acc;
  }, companyColors[COMPANIES.SYMPHONA.colorKey]);

  return (
    <StyledProductOfferingsBanner>
      <StyledFlex direction="row" alignItems="center" justifyContent="space-between">
        <ProductOfferingsBannerContent companyName={companyName} companyColor={companyColor} />
        <StyledFlex flex="auto" alignItems="flex-end">
          <JumbotronGradientIcon
            width="750px"
            height="250px"
            topGradient={companyColor.topGradient}
            bottomGradient={companyColor.bottomGradient}
          />
        </StyledFlex>
      </StyledFlex>
    </StyledProductOfferingsBanner>
  );
};

export default ProductOfferingsBanner;
