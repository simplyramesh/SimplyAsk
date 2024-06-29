import classnames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { NavLink } from 'react-router-dom';

import css from './Sidebar.module.css';

const SubMenu = ({ subMenuItems, isSidebarOpen, isActiveSubmenu, onClick, isPointerEventsNone }) => {
  return (
    <div
      className={classnames({
        [css.sub_menu]: true,
        [css['sub_menu-open']]: isSidebarOpen && isActiveSubmenu,
        [css['sub_menu-compact']]: !isSidebarOpen && isActiveSubmenu && !isPointerEventsNone,
        [css['pointer-events-none']]: isPointerEventsNone,
      })}
    >
      <ul
        className={classnames({
          [css.submenu_list]: true,
          [css['submenu_list-compact']]: false,
        })}
      >
        {subMenuItems?.map((item) => (
          <li className={css.submenu_li} key={item.pageName}>
            <NavLink
              to={`${item.pageUrlPath}`}
              name={item.pageName}
              className={({ isActive }) =>
                classnames({
                  [css.submenu_link]: true,
                  [css['submenu_link--active']]: isActive,
                })
              }
              onClick={(e) => onClick(item, e)}
            >
              {({ isActive }) => (
                <div
                  className={classnames({
                    [css.submenu_text]: true,
                  })}
                >
                  <h4
                    className={classnames({
                      [css.submenu_heading]: true,
                      [css['submenu_heading-color']]: !isActive,
                    })}
                  >
                    {item.pageName}
                  </h4>
                  <p
                    className={classnames({
                      [css.link_description]: true,
                      [css['submenu_description-color']]: !isActive,
                    })}
                  >
                    {item.description}
                  </p>
                </div>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  );
};

SubMenu.propTypes = {
  subMenuItems: PropTypes.arrayOf(PropTypes.object),
  onClick: PropTypes.func,
  isSidebarOpen: PropTypes.bool,
  isActiveSubmenu: PropTypes.bool,
  isPointerEventsNone: PropTypes.bool,
};

export default SubMenu;
