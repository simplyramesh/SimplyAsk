import classnames from 'classnames';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';

import css from './SidebarNavLinks.module.css';

const NavLinkItem = ({
  item, children, onNavLink, menuType, nameType,
}) => {
  const handleNavLinkClick = (e, pages) => {
    onNavLink(pages, e, menuType);
  };

  const checkIfGeneralDashboard = (itemName) => {
    const sideBarItemNames = ['My Summary', 'BOA Dashboard', 'Converse Dashboard', 'Test Dashboard',
      'Settings', 'Web Pages', 'File Manager', 'Support'];

    return sideBarItemNames.includes(itemName);
  };

  return (
    <NavLink
      to={`${item?.pageUrlPath || ''}`}
      name={item[nameType]}
      className={classnames({
        [css.navLink_option]: true,
        [css.dashboardGeneralSideMenuItemsFocus]: checkIfGeneralDashboard(item.displayName),
        [css['navLink_option--active']]: item.isActive && !checkIfGeneralDashboard(item.displayName),
        [css['navLink_option-api_colour--active']]: item.isActive && !checkIfGeneralDashboard(item.displayName),
        [css.dashboardGeneralSideMenuItemsActive]: item.isActive && checkIfGeneralDashboard(item.displayName),
      })}
      style={{ '--api_colour': `${item.colour}`, '--api-hover_colour': `${item.hoverColour}` }}
      onClick={(e) => handleNavLinkClick(e, item)}
    >
      {children}
    </NavLink>
  );
};

export default NavLinkItem;

NavLinkItem.propTypes = {
  item: PropTypes.object,
  children: PropTypes.node,
  onNavLink: PropTypes.func,
  menuType: PropTypes.string,
  nameType: PropTypes.string,
};
