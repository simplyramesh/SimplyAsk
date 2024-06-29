import PropTypes from 'prop-types';

import {
  StyledAccordionDetails, StyledDivider, StyledFlex, StyledText,
} from '../../../../../shared/styles/styled';

const AccessBreakdownDetails = ({ fullData, viewOnlyData, customData }) => {
  const fullAccessRatio = !fullData?.count || !fullData?.total ? 0 : (`${fullData?.count} / ${fullData?.total}`);

  const viewOnlyAccessRatio = !viewOnlyData?.count || !viewOnlyData?.total ? 0 : (`${viewOnlyData?.count} / ${viewOnlyData?.total}`);

  const customAccessRatio = !customData?.count || !customData?.total ? 0 : (`${customData?.count} / ${customData?.total}`);

  return (
    <StyledAccordionDetails mb="38px">
      <StyledFlex direction="row" alignItems="center" justifyContent="space-between" mb="8px">
        <StyledText size={16} weight={600}>Permissions with Full Access</StyledText>
        <StyledText size={16} weight={400}>{fullAccessRatio}</StyledText>
      </StyledFlex>
      <StyledDivider />
      <StyledFlex direction="row" alignItems="center" justifyContent="space-between" mb="8px" mt="8px">
        <StyledText size={16} weight={600}>Permissions with View Only Access</StyledText>
        <StyledText size={16} weight={400}>{viewOnlyAccessRatio}</StyledText>
      </StyledFlex>
      <StyledDivider />
      <StyledFlex direction="row" alignItems="center" justifyContent="space-between" mb="8px" mt="8px">
        <StyledText size={16} weight={600}>Permissions with Custom Access</StyledText>
        <StyledText size={16} weight={400}>{customAccessRatio}</StyledText>
      </StyledFlex>
      <StyledDivider />
    </StyledAccordionDetails>
  );
};

export default AccessBreakdownDetails;

AccessBreakdownDetails.propTypes = {
  fullData: PropTypes.shape({
    count: PropTypes.number,
    total: PropTypes.number,
  }),
  viewOnlyData: PropTypes.shape({
    count: PropTypes.number,
    total: PropTypes.number,
  }),
  customData: PropTypes.shape({
    count: PropTypes.number,
    total: PropTypes.number,
  }),
};
