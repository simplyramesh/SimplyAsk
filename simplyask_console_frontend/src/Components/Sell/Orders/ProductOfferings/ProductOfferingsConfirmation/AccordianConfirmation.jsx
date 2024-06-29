import { useTheme } from '@emotion/react';

import {
  StyledAccordionDetails, StyledAccordionSummary, StyledDivider, StyledFlex, StyledText,
} from '../../../../shared/styles/styled';
import { StyledCheckoutAccordion } from '../ProductOfferingsCheckout/StyledProductOfferingsCheckout';

const AccordianConfirmation = ({
  title,
  children,
  actionSlot,
}) => {
  const { colors } = useTheme();

  return (
    <StyledCheckoutAccordion expanded>
      <StyledAccordionSummary p="0px" hoverBg={colors.white} borderRadius={15}>
        <StyledFlex direction="row" gap="10px" alignItems="center" flex="1 1 auto" px="30px">
          <StyledFlex flex="1 1 auto" gap="16px 0">
            <StyledText size={19} weight={700} lh={23} color={colors.primary}>{title}</StyledText>
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
export default AccordianConfirmation;
