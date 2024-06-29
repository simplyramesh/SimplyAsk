import PropTypes from 'prop-types';

import { StyledText } from '../../../../styles/styled';

const RowCell = ({ as, cell, align = {} }) => {
  const { getValue } = cell;

  return (
    <StyledText as={as || 'p'} size={15} weight={400} {...align}>{getValue()}</StyledText>
  );
};

export default RowCell;

RowCell.propTypes = {
  cell: PropTypes.object,
  align: PropTypes.object,
};
