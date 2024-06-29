import PropTypes from 'prop-types';
import { useEffect } from 'react';

import AccessManagementIcons from '../../../../../shared/REDISIGNED/icons/CustomTableIcons';
import { StyledActions, StyledActionsIconWrapper } from '../StyledActions';

const ManagePermissionsActions = ({ cell, row, table }) => {
  const { original } = row;
  const { meta } = table.options;

  // NOTE: currently only way to check if group is a super admin is to check if there is a original.pagePermission
  useEffect(() => {
    if (!original?.pagePermission) table.setColumnVisibility({ actions: false });
  }, [original?.pagePermission, table]);

  const fullPermissionIds = meta.getPermissionIds();
  const cellPermissionId = `${cell.getValue()}`;

  const isDirectPermission = fullPermissionIds.permissionIds.some((id) => `${id}` === cellPermissionId);

  return (
    isDirectPermission && original?.isEditable && (
      <StyledActions>
        <StyledActionsIconWrapper onClick={() => meta.onDelete(original)}>
          <AccessManagementIcons icon="BIN" width={24} />
        </StyledActionsIconWrapper>
      </StyledActions>
    )
  );
};

export default ManagePermissionsActions;

ManagePermissionsActions.propTypes = {
  cell: PropTypes.shape({
    getValue: PropTypes.func,
  }),
  row: PropTypes.shape({
    original: PropTypes.object,
  }),
  table: PropTypes.shape({
    setColumnVisibility: PropTypes.func,
    setColumnSizing: PropTypes.func,
    options: PropTypes.shape({
      meta: PropTypes.shape({
        getPermissionIds: PropTypes.func,
        onDelete: PropTypes.func,
      }),
    }),
  }),
};
