import CircleCheckedFilled from '@mui/icons-material/CheckCircle';
import CircleIcon from '@mui/icons-material/Circle';
import Checkbox from '@mui/material/Checkbox';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';

import { pagePermissionFields } from '../../../../../../utils/NavLinksPermissions';
import Switch from '../../../../../SwitchWithText/Switch';
import classes from './ConfigEditorPagesList.module.css';

// TODO: setInitialResponse is included PagePermissionsModalView component but not in this component.
const ConfigEditorPagesList = ({
  currPage, show, reRender, onChange,
}) => {
  const [checked, setChecked] = useState(true);
  const [changed, setChanged] = useState(false);
  const [readOnly, setReadOnly] = useState(false);
  const [initialResponse, setInitialResponse] = useState(currPage);
  const [loadingPermissions, setLoadingPermissions] = useState(true);

  useEffect(() => {
    setInitialResponse(currPage);
    setLoadingPermissions(false);
  }, [show, reRender]);

  useEffect(() => {
    if (changed && initialResponse) {
      onChange(initialResponse);
      setChanged(false);
    }
  }, [initialResponse, changed]);

  useEffect(() => {
    if (!loadingPermissions && initialResponse) {
      if (initialResponse.permissionStatus === pagePermissionFields.NO_ACCESS) {
        setChecked(false);
        setReadOnly(false);
      } else if (initialResponse.permissionStatus === pagePermissionFields.READ_ONLY) {
        setChecked(true);
        setReadOnly(true);
      } else {
        setChecked(true);
        setReadOnly(false);
      }
    }
  }, [loadingPermissions, initialResponse]);

  const handleConfigPageToggle = () => {
    if (checked) {
      setInitialResponse({
        ...initialResponse,
        permissionStatus: pagePermissionFields.NO_ACCESS,
      });
      setChanged(true);
      setChecked(false);
      setReadOnly(false);
    } else {
      setInitialResponse({
        ...initialResponse,
        permissionStatus: pagePermissionFields.FULL_ACCESS,
      });
      setChanged(true);
      setChecked(true);
    }
  };

  const handleReadOnly = () => {
    if (initialResponse.permissionStatus === pagePermissionFields.READ_ONLY) {
      setInitialResponse({
        ...initialResponse,
        permissionStatus: pagePermissionFields.FULL_ACCESS,
      });
      setChanged(true);
      setReadOnly(false);
    } else {
      setInitialResponse({
        ...initialResponse,
        permissionStatus: pagePermissionFields.READ_ONLY,
      });
      setChanged(true);
      setReadOnly(true);
    }
  };

  return (
    <div className={classes.row}>
      <div className={classes.controls}>
        <Switch
          checked={checked}
          onChange={handleConfigPageToggle}
          activeLabel="Show"
          inactiveLabel="Hide"
          className={classes.switch}
        />
        <div className={`${classes.checkbox} ${!checked && classes.disabled}`}>
          <p className={classes.label}>Read-only</p>
          <Checkbox
            id="allPagesReadOnly"
            checked={readOnly}
            checkedIcon={<CircleCheckedFilled className={classes.checkedIcon} />}
            icon={<CircleIcon className={classes.uncheckedIcon} />}
            onClick={handleReadOnly}
          />
        </div>
      </div>
      <div className={classes.pageName}>
        <p>{initialResponse.title}</p>
      </div>
    </div>
  );
};

export default ConfigEditorPagesList;

ConfigEditorPagesList.propTypes = {
  currPage: PropTypes.shape({
    editRestricted: PropTypes.bool,
    id: PropTypes.string,
    permissionStatus: PropTypes.string,
    title: PropTypes.string,
  }),
  onChange: PropTypes.func,
  reRender: PropTypes.arrayOf(PropTypes.shape({
    editRestricted: PropTypes.bool,
    id: PropTypes.string,
    permissionStatus: PropTypes.string,
    title: PropTypes.string,
  })),
  // TODO: uncomment setInitialResponse when included as a prop in this component.
  // setInitialResponse: PropTypes.func,
  show: PropTypes.bool,
};
