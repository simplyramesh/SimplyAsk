import PropTypes from 'prop-types';

import { StyledFlex, StyledText } from '../../../../../shared/styles/styled';

const EnvironmentStatusGroupHeader = ({ header }) => {
  return (
    <>
      <StyledFlex alignItems="center" justifyContent="center">
        <StyledText weight={600}>{header.column.columnDef.header}</StyledText>
      </StyledFlex>
    </>
  );
};

export default EnvironmentStatusGroupHeader;

EnvironmentStatusGroupHeader.propTypes = {
  header: PropTypes.shape({
    column: PropTypes.shape({
      columnDef: PropTypes.shape({
        header: PropTypes.string,
      }),
    }),
  }),
};
