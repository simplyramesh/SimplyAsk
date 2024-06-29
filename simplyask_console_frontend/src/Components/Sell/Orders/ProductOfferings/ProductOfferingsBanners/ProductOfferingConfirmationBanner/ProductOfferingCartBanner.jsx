import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

import routes from '../../../../../../config/routes';
import SidebarIcons from '../../../../../AppLayout/SidebarIcons/SidebarIcons';
import ExitIcon from '../../../../../shared/REDISIGNED/icons/svgIcons/ExitIcon';
import { StyledFlex, StyledText } from '../../../../../shared/styles/styled';
import { StyledCartButton } from '../../StyledProductOffers';

const ProductOfferingsConfirmationBanner = () => {
  const navigate = useNavigate();
  const { colors } = useTheme();

  return (
    <StyledFlex
      p="36px"
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      bgcolor={colors.white}
      flex="auto"
      minWidth="1030px"
      maxHeight="75px"
      borderBottom={`1.5px solid ${colors.geyser}`}
    >
      <StyledFlex flex="1 0 auto" alignItems="start">
        <StyledCartButton
          variant="text"
          startIcon={<SidebarIcons color={colors.secondary} icon="SIMPLY_ASK" width="38px" />}
          onClick={() => navigate(routes.PRODUCT_OFFERINGS)}
        >
          <StyledText as="p" size={24} weight={400} color={colors.primary}>
            Simply
            <StyledText display="inline" size={24} weight={800} color={colors.primary}>Ask</StyledText>
          </StyledText>
        </StyledCartButton>
      </StyledFlex>

      <StyledFlex flex="1 0 auto" alignItems="flex-end">
        <StyledCartButton
          variant="text"
          startIcon={<ExitIcon />}
          onClick={() => navigate(
            { pathname: routes.ORDER_MANAGER },
            { replace: true },
          )}
        >
          Exit and Go to Orders
        </StyledCartButton>
      </StyledFlex>
    </StyledFlex>
  );
};

export default ProductOfferingsConfirmationBanner;
