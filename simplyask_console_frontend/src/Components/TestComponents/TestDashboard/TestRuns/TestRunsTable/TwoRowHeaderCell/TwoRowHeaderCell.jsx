import PropTypes from 'prop-types';

import { StyledFlex, StyledText } from '../../../../../shared/styles/styled';

const TwoRowHeaderCell = ({ header }) => {
  return (
    <>
      <StyledFlex alignItems="center" justifyContent="center">
        <StyledText weight={600}>{header.column.columnDef.header}</StyledText>
      </StyledFlex>
    </>
  );
};

export default TwoRowHeaderCell;

TwoRowHeaderCell.propTypes = {
  header: PropTypes.shape({
    headerGroup: PropTypes.shape({
      depth: PropTypes.number,
    }),
    column: PropTypes.shape({
      columnDef: PropTypes.shape({
        header: PropTypes.string,
      }),
    }),
  }),
};
