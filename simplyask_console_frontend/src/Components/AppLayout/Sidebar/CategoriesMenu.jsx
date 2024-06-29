import classnames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import { StyledText } from '../../shared/styles/styled';
import SidebarIcons from '../SidebarIcons/SidebarIcons';
import css from './Sidebar.module.css';
import NavLinkItem from './SidebarNavLinks/NavLinkItem';
import SidebarNavLinks from './SidebarNavLinks/SidebarNavLinks';

const MENU_TYPES = {
  SIDEBAR: 'sidebar',
  SUBMENU: 'submenu',
};

const KEY_NAME = {
  DISPLAY_NAME: 'displayName',
  PAGE_NAME: 'pageName',
};

const CategoriesMenu = ({ menuItems, onClick, isSidebarOpen }) => {
  return (
    <div className={css['category_flex-space']}>
      {menuItems &&
        Object.keys(menuItems).map((category) => (
          <div key={category} className={css.category}>
            <p
              className={classnames({
                [css.category_name]: true,
                [css['category_name-compact']]: !isSidebarOpen,
              })}
            >
              {category}
            </p>
            <SidebarNavLinks categoryItems={menuItems[category]}>
              {({ item }) => (
                <NavLinkItem
                  item={item}
                  onNavLink={onClick}
                  menuType={MENU_TYPES.SIDEBAR}
                  nameType={KEY_NAME.DISPLAY_NAME}
                >
                  <span className={css.link_icon}>
                    <SidebarIcons icon={item.icon} />
                  </span>
                  <p
                    className={classnames({
                      [css.link_text]: isSidebarOpen,
                      [css['link_text-compact']]: !isSidebarOpen,
                    })}
                  >
                    <StyledText size={14} color="inherit" weight={700}>
                      {item.displayName}
                    </StyledText>
                  </p>
                  {!!item.subPages.length && (
                    <span className={css.arrow_icon}>
                      <SidebarIcons icon="BACK" />
                    </span>
                  )}
                </NavLinkItem>
              )}
            </SidebarNavLinks>
          </div>
        ))}
    </div>
  );
};

CategoriesMenu.propTypes = {
  menuItems: PropTypes.object,
  onClick: PropTypes.func,
  isSidebarOpen: PropTypes.bool,
};

export default CategoriesMenu;
