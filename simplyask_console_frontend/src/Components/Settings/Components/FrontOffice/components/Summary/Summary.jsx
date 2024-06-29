import { ExpandMoreRounded } from '@mui/icons-material';

import { StyledAccordionSummary, StyledFlex, StyledText } from '../../../../../shared/styles/styled';

const Summary = ({
  Icon,
  heading,
  description,
  headingSize = 24,
  rootPadding = '31px 14px',
  iconSize,
  iconAndTextGap = '0 34px',
  iconParentFontSize = '50px',
  hoverBg,
  borderRadius,
  expandIconWidth = '43px',
  descriptionMaxWidth = 'auto',
  iconContainerStyles = {}
}) => (
  <StyledAccordionSummary
    p={rootPadding}
    iconWidth={expandIconWidth}
    expandIcon={<ExpandMoreRounded />}
    hoverBg={hoverBg}
    borderRadius={borderRadius}
  >
    <StyledFlex direction="row" gap={iconAndTextGap}>
      <StyledFlex
        direction="row"
        alignItems="center"
        justifyContent="center"
        fontSize={iconParentFontSize}
        {...iconContainerStyles}
      >
        {Icon ? <Icon fontSize="inherit" {...iconSize && { width: iconSize, height: iconSize }} /> : null}
      </StyledFlex>
      <StyledFlex gap={1}>
        <StyledText size={headingSize} lh={29} weight={600}>{heading}</StyledText>
        <StyledText size={16} lh={24} weight={400} maxWidth={descriptionMaxWidth}>{description}</StyledText>
      </StyledFlex>
    </StyledFlex>
  </StyledAccordionSummary>
);

export default Summary;
