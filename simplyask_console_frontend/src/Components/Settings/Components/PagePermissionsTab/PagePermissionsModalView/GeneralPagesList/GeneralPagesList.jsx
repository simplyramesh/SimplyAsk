import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';

import { pagePermissionFields } from '../../../../../../utils/NavLinksPermissions';
import Switch from '../../../../../SwitchWithText/Switch';
import classes from './GeneralPagesList.module.css';

// TODO: setInitialResponse is included PagePermissionsModalView component but not in this component.
const GeneralPagesList = ({
  currPage, onChange, role, show, reRender,
}) => {
  const [checked, setChecked] = useState(true);
  const [loadingPermissions, setLoadingPermissions] = useState(true);
  const [changed, setChanged] = useState(false);
  const [disableAdminSettingToggle, setDisableAdminSettingToggle] = useState(false);
  const [initialResponse, setInitialResponse] = useState(currPage);

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
      } else {
        setChecked(true);
      }

      if (role) {
        if (role === pagePermissionFields.ADMIN && initialResponse.title === pagePermissionFields.SETTINGS) {
          setDisableAdminSettingToggle(true);
        } else {
          setDisableAdminSettingToggle(false);
        }
      }
    }
  }, [loadingPermissions, initialResponse]);

  const handleGeneralPagesToggle = () => {
    if (role === pagePermissionFields.ADMIN && initialResponse.title === pagePermissionFields.SETTINGS) return;

    if (checked) {
      setInitialResponse({
        ...initialResponse,
        permissionStatus: pagePermissionFields.NO_ACCESS,
      });
      setChanged(true);
      setChecked(false);
    } else {
      setInitialResponse({
        ...initialResponse,
        permissionStatus: pagePermissionFields.FULL_ACCESS,
      });
      setChanged(true);
      setChecked(true);
    }
  };

  return (
    <div className={classes.listGap}>
      <div className={classes.row}>
        <Switch
          checked={checked}
          disabled={disableAdminSettingToggle}
          onChange={handleGeneralPagesToggle}
          activeLabel="Show"
          inactiveLabel="Hide"
          className={classes.switch}
        />
      </div>
      <div className={classes.pageName}>
        <p>{initialResponse.title}</p>
      </div>
    </div>
  );
};

export default GeneralPagesList;

GeneralPagesList.propTypes = {
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
  role: PropTypes.string,
  // TODO: uncomment setInitialResponse when included as a prop in this component.
  // setInitialResponse: PropTypes.func,
  show: PropTypes.bool,
};
