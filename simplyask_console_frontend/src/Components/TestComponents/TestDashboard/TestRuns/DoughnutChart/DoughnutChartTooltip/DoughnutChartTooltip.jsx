import { useTheme } from '@mui/material/styles';
import PropTypes from 'prop-types';

import { StyledFlex, StyledText } from '../../../../../shared/styles/styled';

const DoughnutChartTooltip = ({ data, position, isVisible }) => {
  const { colors } = useTheme();

  return (
    <StyledFlex
      as="p"
      direction="row"
      position="absolute"
      {...position}
      gap="4px"
      alignItems="center"
      justifyContent="center"
      backgroundColor={colors.primary}
      color={colors.white}
      borderRadius="10px"
      p="6px 12px"
      pointerEvents="none"
      visibility={isVisible ? 'visible' : 'hidden'}
      opacity={isVisible ? 1 : 0}
      transition="visibility 0.35s, opacity 0.35s ease-in-out"
      whiteSpace="nowrap"
    >
      {data.map((item, index) => <StyledText key={index} as="span" color={colors.white}>{item}</StyledText>)}
    </StyledFlex>
  );
};

export default DoughnutChartTooltip;

DoughnutChartTooltip.propTypes = {
  data: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.node])),
  position: PropTypes.shape({
    x: PropTypes.number,
    y: PropTypes.number,
  }),
  isVisible: PropTypes.bool,
};
