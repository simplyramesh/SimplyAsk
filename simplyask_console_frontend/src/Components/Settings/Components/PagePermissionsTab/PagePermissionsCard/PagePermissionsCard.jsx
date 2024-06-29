import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import Scrollbars from 'react-custom-scrollbars-2';
import { Button, Card } from 'simplexiar_react_components';

import EditIcon from '../../../../../Assets/icons/EditIcon.svg?component';
import { pagePermissionFields } from '../../../../../utils/NavLinksPermissions';
import Spinner from '../../../../shared/Spinner/Spinner';
import PagePermissionsList from '../PagePermissionsList/PagePermissionsList';
import classes from './PagePermissionsCard.module.css';

// TODO: i prop is index in PagePermissionsTab component
// TODO: isLoading is not included as a prop in PagePermissionsTab component
const PagePermissionsCard = ({ i, role, pages, isLoading, onClick }) => {
  const [name, setName] = useState(role);
  const [showAllPages, setShowAllPages] = useState(false);
  const [editAllPages, setEditAllPages] = useState(false);

  // format user name
  const changeCase = (name) => {
    setName(
      name
        .toLowerCase()
        .split('_')
        .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
        .join(' ')
    );
  };

  useEffect(() => {
    changeCase(role);
  });

  useEffect(() => {
    if (!isLoading && pages) {
      const readOnlyCount = pages.reduce(
        (n, item) => n + (item.editRestricted && item.permissionStatus === pagePermissionFields.READ_ONLY),
        0
      );

      const verifyAllReadOnly = pages.reduce(
        (n, item) => (item.editRestricted && item.permissionStatus !== pagePermissionFields.NO_ACCESS ? 1 + n : n),
        0
      );

      const verifyAllShowALL = pages.reduce(
        (n, item) => (item.permissionStatus !== pagePermissionFields.NO_ACCESS ? 1 + n : n),
        0
      );

      if (verifyAllReadOnly === readOnlyCount) {
        verifyAllReadOnly === 0 ? setEditAllPages(false) : setEditAllPages(true);
      } else {
        setEditAllPages(false);
      }

      if (verifyAllShowALL === pages.length) {
        verifyAllShowALL === 0 ? setShowAllPages(false) : setShowAllPages(true);
      } else if (verifyAllShowALL === pages.length - 1) {
        const allFiltersActive = pages.filter((item) => {
          if (
            item.title === pagePermissionFields.SETTINGS &&
            item.permissionStatus === pagePermissionFields.NO_ACCESS
          ) {
            return true;
          }
        }).length;

        allFiltersActive === 1 ? setShowAllPages(true) : setShowAllPages(false);
      } else {
        setShowAllPages(false);
      }
    }
  }, [isLoading, pages]);

  const renderThumb = ({ style, ...props }) => {
    const thumbStyle = {
      borderRadius: 6,
      backgroundColor: 'rgba(0, 0, 0, 0.2)',
    };
    return <div style={{ ...style, ...thumbStyle }} {...props} />;
  };

  const CustomScrollbars = (props) => (
    <Scrollbars renderThumbHorizontal={renderThumb} renderThumbVertical={renderThumb} {...props} />
  );

  if (isLoading) {
    return (
      <Card className={classes.root}>
        <Spinner parent />
      </Card>
    );
  }

  return (
    <Card className={classes.root} key={i}>
      <div className={classes.name}>
        <h3>{name}</h3>
      </div>
      <CustomScrollbars autoHide autoHideTimeout={500} autoHideDuration={200} className={classes.contentHeight}>
        <div className={classes.pageList}>
          {!showAllPages &&
            pages
              .filter((pair) => pair.title !== 'Support')
              .map(({ title, permissionStatus, editRestricted }, index) => {
                return (
                  <PagePermissionsList
                    key={index}
                    title={title}
                    status={permissionStatus}
                    editRestricted={editRestricted}
                    restrictUseEffect={false}
                    showAllPages={showAllPages}
                    editAllPages={editAllPages}
                  />
                );
              })}

          {showAllPages && (
            <PagePermissionsList
              title={pagePermissionFields.ALL_PAGES}
              status={pagePermissionFields.FULL_ACCESS}
              editRestricted
              restrictUseEffect
              showAllPages={showAllPages}
              editAllPages={editAllPages}
            />
          )}
        </div>
      </CustomScrollbars>

      <div className={classes.button}>
        <Button className={classes.buttonInner} onClick={() => onClick(role, i)}>
          <EditIcon inline className={classes.editIcon} />
          Manage Pages
        </Button>
      </div>
    </Card>
  );
};

export default PagePermissionsCard;

PagePermissionsCard.propTypes = {
  i: PropTypes.number,
  allFilterActive: PropTypes.bool,
  onClick: PropTypes.func,
  pages: PropTypes.arrayOf(
    PropTypes.shape({
      editRestricted: PropTypes.bool,
      id: PropTypes.string,
      permissionStatus: PropTypes.string,
      title: PropTypes.string,
    })
  ),
  role: PropTypes.string,
  showModal: PropTypes.bool,
  isLoading: PropTypes.bool,
};
