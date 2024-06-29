import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import routes from '../../../../config/routes';
import { useSideDrawer } from '../../../../contexts/SideDrawerContext';
import classes from './NavLink.module.css';

const NavLink = ({
  title,
  pathName,
  isAuth,
  hideIcon,
  hover,
  rootStyle,
  style,
  isAccountDisabled,
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [active, setActive] = useState(false);
  const { isFullWidth } = useSideDrawer();

  useEffect(() => {
    const checkActive = () => {
      const currentPath = location.pathname;
      // Check whether path name is null or not
      if (pathName !== null) {
        // split the name with '/'
        const pathArray = pathName.split('/');
        const currPathArray = currentPath.split('/');
        let newPathName = '';
        // As our path comes like /dashboard so first two elements will always be empty and dashboard so starts with 2
        if (pathArray.length > 2) {
          newPathName = `/${pathArray.slice(-2).join('/')}`;
          const newPathArray = newPathName.split('/');

          // if current path includes newpath(without dashboard one then return true else false)
          if (newPathName != null && currentPath.includes(newPathName) && newPathArray[newPathArray.length - 1] === currPathArray[currPathArray.length - 1]) {
            return setActive(currentPath.includes(newPathName));
          }
          return setActive(false);
        }
        // if current path exactly same then only return true
        if (currentPath === pathName) {
          setActive(true);
        } else {
          setActive(false);
        }
      } else if (pathName === routes.DEFAULT) return setActive(currentPath === pathName);
    };
    checkActive();
  }, [location, pathName, isFullWidth]);

  const changeRoute = () => {
    if (pathName === location.pathname || isAccountDisabled) return;

    navigate(`${pathName}`);
  };
  if (!isAuth) return null;

  return (
    <div
      className={`${classes.root} ${active && classes.active} ${!hideIcon && active && classes.activeMain} ${!isAccountDisabled && classes.colorHoverEvent} ${
        isAccountDisabled && classes.disable_cursor
      }`}
      style={rootStyle}
      onClick={changeRoute}
    >
      {isFullWidth ? (
        <p style={style} className={`${isAccountDisabled && classes.link_disabled}`}>
          {isAuth ? title : ''}
        </p>
      ) : (
        hover && (
          <p style={style} className={`${isAccountDisabled && classes.link_disabled}`}>
            {isAuth ? title : ''}
          </p>
        )
      )}
    </div>
  );
};

export default NavLink;

NavLink.defaultProps = {
  isAuth: true,
  pathName: routes.DEFAULT,
};

NavLink.propTypes = {
  title: PropTypes.string,
  pathName: PropTypes.string,
  isAuth: PropTypes.bool,
  hideIcon: PropTypes.bool,
  hover: PropTypes.bool,
  rootStyle: PropTypes.object,
  style: PropTypes.object,
  isAccountDisabled: PropTypes.bool,
};
