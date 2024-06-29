import CircleCheckedFilled from '@mui/icons-material/CheckCircle';
import CircleIcon from '@mui/icons-material/Circle';
import Checkbox from '@mui/material/Checkbox';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import Scrollbars from 'react-custom-scrollbars-2';
import { Button } from 'simplexiar_react_components';

import { pagePermissionFields } from '../../../../../utils/NavLinksPermissions';
import Spinner from '../../../../shared/Spinner/Spinner';
import Switch from '../../../../SwitchWithText/Switch';
import ConfigEditorPagesList from './ConfigEditorPagesList/ConfigEditorPagesList';
import GeneralPagesList from './GeneralPagesList/GeneralPagesList';
import classes from './PagePermissionsModalView.module.css';

// TODO: clarify loading and readOnly props, they are not included in the parent component.
const PagePermissionsModalView = ({
  role,
  roleIndex,
  pages,
  loading,
  readOnly,
  show,
  onEditPage,

}) => {
  const [allPages, setAllPages] = useState(false);
  const [firstRender, setFirstRender] = useState(true);
  const [allReadOnly, setAllReadOnly] = useState(false);
  const [initialResponse, setInitialResponse] = useState();
  const [filterResponse, setFilterResponse] = useState();
  const [name, setName] = useState(role);
  const [loadingModal, setLoadingModal] = useState(true);

  // format user name
  const changeCase = (name) => {
    setName(
      name
        .toLowerCase()
        .split('_')
        .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
        .join(' '),
    );
  };

  useEffect(() => {
    changeCase(role);
    setLoadingModal(true);
    setInitialResponse(pages);
  }, [pages, show]);

  useEffect(() => {
    if (initialResponse) {
      setFilterResponse(initialResponse);
    }

    return () => {
      setAllPages(false);
      setAllReadOnly(false);
    };
  }, [initialResponse]);

  useEffect(() => {
    if (show && filterResponse) {
      setLoadingModal(false);
    }
  }, [filterResponse]);

  useEffect(() => {
    if (!loadingModal) {
      if (allPages && !allReadOnly) {
        setFilterResponse(
          filterResponse.map((item) => {
            if (item.permissionStatus === pagePermissionFields.NO_ACCESS) {
              return { ...item, permissionStatus: pagePermissionFields.FULL_ACCESS };
            }
            return item;
          }),
        );
      } else if (!allPages && allReadOnly) {
        setFilterResponse(
          filterResponse.map((item) => {
            if (item.permissionStatus !== pagePermissionFields.NO_ACCESS && item.editRestricted) {
              return { ...item, permissionStatus: pagePermissionFields.READ_ONLY };
            }
            return item;
          }),
        );
      } else if (allPages && allReadOnly) {
        setFilterResponse(
          filterResponse.map((item) => {
            if (item.title === pagePermissionFields.SETTINGS && role !== pagePermissionFields.ADMIN) {
              return { ...item, permissionStatus: pagePermissionFields.NO_ACCESS };
            }
            if (item.permissionStatus !== pagePermissionFields.NO_ACCESS && item.editRestricted) {
              return { ...item, permissionStatus: pagePermissionFields.READ_ONLY };
            } if (item.permissionStatus !== pagePermissionFields.NO_ACCESS && !item.editRestricted) {
              return { ...item, permissionStatus: pagePermissionFields.FULL_ACCESS };
            }
            return item;
          }),
        );
      }
    }
  }, [allPages, allReadOnly, loadingModal]);

  useEffect(() => {
    if (!loadingModal && filterResponse && firstRender) {
      const readOnlyCount = filterResponse.reduce(
        (n, item) => n + (item.editRestricted && item.permissionStatus === pagePermissionFields.READ_ONLY),
        0,
      );

      const verifyAllReadOnly = filterResponse.reduce(
        (n, item) => (item.editRestricted && item.permissionStatus !== pagePermissionFields.NO_ACCESS ? 1 + n : n),
        0,
      );

      const verifyAllShowALL = filterResponse.reduce(
        (n, item) => (item.permissionStatus !== pagePermissionFields.NO_ACCESS ? 1 + n : n),
        0,
      );

      if (verifyAllReadOnly === readOnlyCount) {
        verifyAllReadOnly === 0 ? setAllReadOnly(false) : setAllReadOnly(true);
      }

      if (verifyAllShowALL === filterResponse.length) {
        verifyAllShowALL === 0 ? setAllPages(false) : setAllPages(true);
      } else if (verifyAllShowALL === filterResponse.length - 1) {
        const allFiltersActive = filterResponse.filter((item) => {
          if (
            item.title === pagePermissionFields.SETTINGS
            && item.permissionStatus === pagePermissionFields.NO_ACCESS
          ) {
            return true;
          }
        }).length;

        allFiltersActive === 1 ? setAllPages(true) : setAllPages(false);
      }

      setFirstRender(false);
    }
  }, [loadingModal, filterResponse]);

  const handleAllPagesToggle = () => {
    if (!allPages) {
      setFilterResponse(
        filterResponse.map((item) => {
          if (item.permissionStatus === pagePermissionFields.NO_ACCESS) {
            return { ...item, permissionStatus: pagePermissionFields.FULL_ACCESS };
          }
          return item;
        }),
      );
    } else {
      setFilterResponse(initialResponse);
    }
    setAllPages(!allPages);
  };

  const handleAllReadOnlyToggle = () => {
    if (!allReadOnly) {
      setFilterResponse(
        filterResponse.map((item) => {
          if (item.permissionStatus !== pagePermissionFields.NO_ACCESS && item.editRestricted) {
            return { ...item, permissionStatus: pagePermissionFields.READ_ONLY };
          }
          return item;
        }),
      );
    } else {
      setFilterResponse(initialResponse);
    }
    setAllReadOnly(!allReadOnly);
  };

  const handleGeneralPagesToggle = (updatedResponse) => {
    setFilterResponse(
      filterResponse.map((item) => {
        if (item.id === updatedResponse.id) {
          return updatedResponse;
        }
        return item;
      }),
    );
  };

  const handleConfigPagesToggle = (updatedResponse) => {
    setFilterResponse(
      filterResponse.map((item) => {
        if (item.id === updatedResponse.id) {
          return updatedResponse;
        }
        return item;
      }),
    );
  };

  if (!show || loading || loadingModal) return <Spinner parent />;

  return (
    <div className={classes.root}>
      {/* Heading */}
      <h3>Manage Pages</h3>
      <p>
        {name}
        {' '}
        Users
      </p>

      {/* toggle on/off for all pages */}
      <div className={classes.allPages}>
        <label>All Pages</label>
        <div>
          <p className={classes.showAllLabel}>Show All</p>
          <Switch
            checked={allPages}
            onChange={() => handleAllPagesToggle()}
            className={classes.allPagesSwitch}
            thumbClassName={classes.allPagesSwitchThumb}
            activeLabel="Show"
            inactiveLabel="Hide"
          />

          <p className={classes.readOnlyLabel}>Read-only</p>
          <Checkbox
            checked={allReadOnly}
            onChange={() => handleAllReadOnlyToggle()}
            id="allPagesReadOnly"
            checkedIcon={<CircleCheckedFilled className={classes.checkedIcon} />}
            icon={<CircleIcon className={classes.uncheckedIcon} />}
          />
        </div>
      </div>

      <hr className={classes.lineBreak} />

      <Scrollbars className={`${classes.pagesListScroll}`}>
        {/* general pages section */}
        <div
          className={`${classes.generalPages}  ${allPages && classes.disabled}  ${
            allReadOnly && classes.disabled
          }`}
        >
          <label>General Pages</label>
          {filterResponse
            .filter((pair) => pair.title !== 'Support')
            .filter((item) => !item.editRestricted)
            .map((currPage, index) => (
              <GeneralPagesList
                key={index}
                show={show}
                currPage={currPage}
                role={role}
                onChange={handleGeneralPagesToggle}
                setInitialResponse={setInitialResponse}
                reRender={filterResponse}
              />
            ))}
        </div>

        {/* configuration & editor pages section */}
        <div
          className={`${classes.generalPages}  ${allPages && classes.disabled} ${
            allReadOnly && classes.disabled
          }`}
        >
          <label>Edit Restricted Pages</label>
          {filterResponse
            .filter((item) => item.editRestricted)
            .map((filteredPage, index) => (
              <ConfigEditorPagesList
                key={index}
                show={show}
                currPage={filteredPage}
                onChange={handleConfigPagesToggle}
                setInitialResponse={setInitialResponse}
                reRender={filterResponse}
              />
            ))}
        </div>

        <Button
          className={classes.saveButton}
          color="primary"
          onClick={() => onEditPage(filterResponse, roleIndex)}
          hasLoader={loading}
          isVisible={!readOnly}
        >
          Save
        </Button>
      </Scrollbars>
    </div>
  );
};

export default PagePermissionsModalView;

PagePermissionsModalView.propTypes = {
  onEditPage: PropTypes.func,
  pages: PropTypes.arrayOf(PropTypes.shape({
    editRestricted: PropTypes.bool,
    id: PropTypes.string,
    title: PropTypes.string,
    permissionStatus: PropTypes.string,
  })),
  role: PropTypes.string,
  roleIndex: PropTypes.number,
  show: PropTypes.bool,
  loading: PropTypes.bool,
  readOnly: PropTypes.bool,
};
