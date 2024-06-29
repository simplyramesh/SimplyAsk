import { useTheme } from '@mui/material/styles';
import PropTypes from 'prop-types';

import { StyledDivider, StyledFlex, StyledText } from '../../../../../shared/styles/styled';

const ServiceTicketFilterTitleDivider = ({
  children, title, titleGap = '20px', gap, childGap = '20px', marginBottom = '26px',
}) => {
  const { colors } = useTheme();

  return (
    <StyledFlex gap={titleGap} marginBottom={marginBottom}>
      <StyledText weight={500}>{title}</StyledText>
      <StyledFlex direction="row" gap={gap}>
        <StyledFlex direction="row">
          <StyledDivider
            borderWidth={1.5}
            color={colors.inputBorder}
            orientation="vertical"
            flexItem
          />
        </StyledFlex>
        <StyledFlex flex="1 1 auto" justifyContent="center" gap={childGap}>
          {children}
        </StyledFlex>
      </StyledFlex>
    </StyledFlex>
  );
};

export default ServiceTicketFilterTitleDivider;

ServiceTicketFilterTitleDivider.propTypes = {
  children: PropTypes.node,
  title: PropTypes.string,
  titleGap: PropTypes.string,
  gap: PropTypes.string,
  childGap: PropTypes.string,
  marginBottom: PropTypes.string,
};
