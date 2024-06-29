import PropTypes from 'prop-types';
import { memo } from 'react';
import { StyledFlex, StyledText } from '../../../../../shared/styles/styled';

const TicketTasksName = ({ cell, row, table }) => {
  const handleNameClick = () => table.options.meta.handleNameClick(row);
  const { displayName, id } = cell.getValue() || {};

  return (
    <StyledFlex onClick={handleNameClick} cursor="pointer">
      <StyledText weight={600} size={15} lh={21} color="inherit" maxLines={2}>
        {displayName}
      </StyledText>
      <StyledText size={13} lh={18} color="inherit">
        #{id}
      </StyledText>
    </StyledFlex>
  );
};

export default memo(TicketTasksName);

TicketTasksName.propTypes = {
  cell: PropTypes.shape({
    getValue: PropTypes.func,
  }),
  row: PropTypes.shape({
    original: PropTypes.object,
  }),
  table: PropTypes.shape({
    options: PropTypes.shape({
      meta: PropTypes.shape({
        handleNameClick: PropTypes.func,
      }),
    }),
  }),
};
