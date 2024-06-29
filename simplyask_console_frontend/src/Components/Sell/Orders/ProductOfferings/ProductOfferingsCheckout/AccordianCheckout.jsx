import { useTheme } from '@emotion/react';

import { useGetCurrentUser } from '../../../../../hooks/useGetCurrentUser';
import { useLocalStorage } from '../../../../../hooks/useLocalStorage';
import {
  StyledAccordionDetails, StyledAccordionSummary, StyledDivider, StyledFlex, StyledText,
} from '../../../../shared/styles/styled';
import { getIsGoaProductConfigurationsEnabled } from '../../../utils/helpers';
import { GOVERNMENT_OF_ALBERTA } from '../ProductOfferings';

import { StyledCheckoutAccordion } from './StyledProductOfferingsCheckout';

const AccordionCheckout = ({
  step,
  title,
  actionSlot,
  children,
  expanded,
}) => {
  const { colors } = useTheme();
  const { currentUser } = useGetCurrentUser();
  const [localStorage] = useLocalStorage('cart');

  const isGoACustomer = currentUser?.organization?.name === GOVERNMENT_OF_ALBERTA;
  const isProductConfigEnabled = getIsGoaProductConfigurationsEnabled(isGoACustomer, localStorage?.categories);

  return (
    <StyledCheckoutAccordion expanded={expanded}>
      <StyledAccordionSummary p="0px" hoverBg={colors.white} borderRadius={15}>
        <StyledFlex direction="row" gap="10px" flex="1 1 auto" px="30px">
          <StyledFlex flex="1 1 auto" gap="16px 0">
            <StyledText size={16} weight={500} lh={20}>{`Step ${step} of ${isProductConfigEnabled ? 4 : 3}`}</StyledText>
            <StyledText size={19} weight={700} lh={23} color={colors.secondary}>{title}</StyledText>
          </StyledFlex>
          {actionSlot}
        </StyledFlex>
      </StyledAccordionSummary>
      <StyledAccordionDetails m="28px 0 0 0">
        <StyledFlex gap="30px 0">
          <StyledDivider borderWidth={1.5} color={colors.geyser} flexItem />
          <StyledFlex px="30px">
            {children}
          </StyledFlex>
        </StyledFlex>
      </StyledAccordionDetails>
    </StyledCheckoutAccordion>
  );
};
export default AccordionCheckout;
