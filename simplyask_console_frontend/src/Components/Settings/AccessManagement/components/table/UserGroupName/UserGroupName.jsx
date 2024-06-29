import PropTypes from 'prop-types';
import React from 'react';

import { StyledUserGroupName } from './StyledUserGroupName';

const UserGroupName = ({ cell, table }) => {
  const { getValue, row } = cell;
  const { original } = row;

  const { meta } = table.options;

  return (
    <StyledUserGroupName
      onClick={() => meta?.onUserGroupNameClick(original.id)}
      weight={600}
      size={16}
    >
      {getValue()}
    </StyledUserGroupName>
  );
};

export default UserGroupName;

UserGroupName.propTypes = {
  cell: PropTypes.shape({
    getValue: PropTypes.func,
    row: PropTypes.shape({
      original: PropTypes.shape({
        id: PropTypes.string,
        pfp: PropTypes.string,
        firstName: PropTypes.string,
        lastName: PropTypes.string,
      }),
    }),
  }),
  table: PropTypes.shape({
    options: PropTypes.shape({
      meta: PropTypes.shape({
        onUserGroupNameClick: PropTypes.func,
      }),
    }),
  }),
};
