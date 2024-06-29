import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PropTypes from 'prop-types';

import {
  StyledAccordionSummary, StyledFlex, StyledText,
} from '../../../../../shared/styles/styled';
import { StyledPermissionSummaryAccordion } from '../StyledPermissionSummary';

const PermissionSummaryAccordion = ({ title = '', children }) => {
  return (
    <StyledFlex>
      <StyledPermissionSummaryAccordion>
        <StyledAccordionSummary expandIcon={<ExpandMoreIcon />}>
          <StyledText size={16} weight={600}>{`${title} Breakdown`}</StyledText>
        </StyledAccordionSummary>
        {children}
      </StyledPermissionSummaryAccordion>
    </StyledFlex>
  );
};

export default PermissionSummaryAccordion;

PermissionSummaryAccordion.propTypes = {
  title: PropTypes.oneOf(['Access', 'Assignment']),
  children: PropTypes.node,
};
