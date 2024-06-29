import PropTypes from 'prop-types';

import { StyledFlex, StyledText } from '../../../../../shared/styles/styled';

const DoughnutChartCenterText = ({ textData }) => {
  return (
    <StyledFlex
      position="absolute"
      top="50%"
      left="50%"
      transform="translate(-50%, -50%)"
      width="50px"
    >
      {textData.map((txtItem) => (
        <StyledText
          key={txtItem.value}
          size={txtItem.fontSize}
          weight={txtItem.fontWeight}
          lh={txtItem.lineHeight}
          textAlign="center"
        >
          {`${txtItem.value}`}
        </StyledText>
      ))}
    </StyledFlex>
  );
};

export default DoughnutChartCenterText;

DoughnutChartCenterText.defaultProps = {
  textData: [
    {
      value: '0',
      fontSize: 12,
      fontWeight: 400,
      lineHeight: 19.5,
    },
  ],
};

DoughnutChartCenterText.propTypes = {
  textData: PropTypes.arrayOf(PropTypes.shape({
    value: PropTypes.string,
    fontSize: PropTypes.number,
    fontWeight: PropTypes.number,
    lineHeight: PropTypes.number,
  })),
};
