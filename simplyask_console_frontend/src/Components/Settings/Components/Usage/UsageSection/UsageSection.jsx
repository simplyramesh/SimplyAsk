import PropTypes from 'prop-types';

import { StyledFlex, StyledText } from '../../../../shared/styles/styled';
import { StyledUsageSectionContainer } from '../StyledUsage';

const UsageSection = ({ title, subtitle, children }) => {
  return (
    <>
      <StyledFlex mb={title ? '27px' : 0}>
        <StyledText as="h2" size={24} weight={600} lh={32}>{title}</StyledText>
        {subtitle && <StyledText as="h3" size={16} weight={400} lh={24}>{subtitle}</StyledText>}
      </StyledFlex>
      <StyledFlex pb="35px" mr={!subtitle ? 0 : '-17px'}>
        <StyledUsageSectionContainer pl={!subtitle ? 0 : '17px'}>
          {children}
        </StyledUsageSectionContainer>
      </StyledFlex>
    </>
  );
};

export default UsageSection;

UsageSection.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  children: PropTypes.node,
};
