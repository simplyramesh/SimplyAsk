import Summary from '../../../../../Settings/Components/FrontOffice/components/Summary/Summary';
import { StyledAccordion, StyledAccordionDetails } from '../../../../../shared/styles/styled';

const ProductOfferingPlanFilterItem = ({
  heading, expanded, onExpand, children,
}) => (
  <StyledAccordion expanded={expanded} onChange={onExpand}>
    <Summary
      heading={heading}
      headingSize={16}
      rootPadding="0"
      expandIconWidth="24px"
      iconAndTextGap="0 20px"
    />
    <StyledAccordionDetails p="0 20px">
      {children}
    </StyledAccordionDetails>
  </StyledAccordion>
);

export default ProductOfferingPlanFilterItem;
