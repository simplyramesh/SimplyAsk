import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';

import { pagePermissionFields } from '../../../../../utils/NavLinksPermissions';
import classes from './PagePermissionsList.module.css';

// TODO: editRestricted included in PagePermissionsCard component but not in this component
const PagePermissionsList = ({
  title, status, restrictUseEffect, showAllPages, editAllPages,
}) => {
  const [writeOnly, setWriteOnly] = useState(true);
  const [readOnly, setReadOnly] = useState(true);

  useEffect(() => {
    if (!restrictUseEffect) {
      if (status === pagePermissionFields.NO_ACCESS) {
        setWriteOnly(false);
        setReadOnly(false);
      } else if (status === pagePermissionFields.READ_ONLY) {
        setWriteOnly(false);
      } else {
        setWriteOnly(true);
        setReadOnly(false);
      }
    }
  }, [status, restrictUseEffect]);

  useEffect(() => {
    if (restrictUseEffect) {
      if (editAllPages && showAllPages) {
        setWriteOnly(false);
        setReadOnly(true);
      } else if (!editAllPages && showAllPages) {
        setWriteOnly(true);
        setReadOnly(false);
      }
    }
  }, [editAllPages, showAllPages, restrictUseEffect]);

  return (
    status !== pagePermissionFields.NO_ACCESS && (
      <div className={classes.root}>
        <div className={classes.pageInfo}>
          <div className={classes.pageName}>{title}</div>
          <div className={classes.icons}>
            {writeOnly && <CreateOutlinedIcon className={classes.visibilityIcon} />}
            {readOnly && <VisibilityOutlinedIcon className={classes.visibilityIcon} />}
          </div>
        </div>
      </div>
    )
  );
};

export default PagePermissionsList;

PagePermissionsList.propTypes = {
  editAllPages: PropTypes.bool,
  // TODO: editRestricted included in PagePermissionsCard component but not in this component
  // editRestricted: PropTypes.bool,
  restrictUseEffect: PropTypes.bool,
  showAllPages: PropTypes.bool,
  status: PropTypes.string,
  title: PropTypes.string,
};
