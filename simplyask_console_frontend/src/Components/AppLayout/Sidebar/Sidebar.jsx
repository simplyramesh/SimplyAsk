import classnames from 'classnames';
import PropTypes from 'prop-types';
import { useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil';

import useOutsideClick from '../../../hooks/useOutsideClick';
import { useSidebarScrollStyles } from '../../../hooks/useSidebarScrollStyles';
import { mappedGrantedPagesSelector } from '../../../store/selectors';
import { groupBy } from '../../../utils/helperFunctions';
import SidebarIcons from '../SidebarIcons/SidebarIcons';
import CategoriesMenu from './CategoriesMenu';
import css from './Sidebar.module.css';
import SidebarToggle from './SidebarToggle/SidebarToggle';
import SubMenu from './SubMenu';

const Sidebar = ({ isSidebarOpen, toggleSidebar }) => {
  const ref = useRef();
  const sidebarBodyRef = useRef(null);
  const navigate = useNavigate();
  const grantedPages = useRecoilValue(mappedGrantedPagesSelector);
  const menuItems = useMemo(() => {
    const topItems = grantedPages
      ?.filter((page) => page.isTopMenuItem)
      .sort((a, b) => a.menuItemOrder - b.menuItemOrder);
    return groupBy(topItems, 'categoryName');
  }, [grantedPages]);
  const withScroll = useSidebarScrollStyles(sidebarBodyRef);

  const [subMenuItems, setSubMenuItems] = useState([]);
  const [isActiveSubmenu, setIsActiveSubmenu] = useState(false);
  const [menuItemId, setMenuItemId] = useState(null);

  const [isPointerEventsNone, setIsPointerEventsNone] = useState(false);

  useOutsideClick(ref, () => {
    if (isSidebarOpen) {
      setIsActiveSubmenu(false);
    }
  });

  const handleCurrentNavLinkClick = (item, e) => {
    e.preventDefault();

    if (item.subPages?.length) {
      // clicking on topItem with subPages
      if (isActiveSubmenu && menuItemId === item.topMenuItemId) {
        setIsActiveSubmenu(false);
        setMenuItemId(null);
        return;
      }
      setMenuItemId(item.topMenuItemId);
      setSubMenuItems(item.subPages);
      setIsActiveSubmenu(true);
    } else if (item.isTopMenuItem) {
      // clicking on topItem without subPages
      navigate(item?.pageUrlPath);
      setSubMenuItems([]);
      setIsActiveSubmenu(false);
    } else {
      // clicking on subMenu item
      navigate(item?.pageUrlPath);

      if (isSidebarOpen) {
        // hiding submenu only in non-compact mode
        setIsActiveSubmenu(false);
      }
    }
  };

  const handleLogoClick = () => {
    setSubMenuItems([]);
    navigate('/');
  };

  return (
    <div
      ref={ref}
      className={classnames({
        [css.absolute_container]: !isSidebarOpen,
      })}
    >
      <nav
        className={classnames({
          [css.nav]: true,
          [css['nav-open']]: isSidebarOpen,
          [css['nav-compact']]: !isSidebarOpen,
          [css['toggle-pointer-events']]: isPointerEventsNone,
        })}
        onTransitionEnd={() => setIsPointerEventsNone(false)}
      >
        <div className={css.nav_inner}>
          {/* Symphona Logo */}
          <div
            className={classnames({
              [css.simplyAsk_logo]: true,
              [css.border]: withScroll,
            })}
            onClick={handleLogoClick}
          >
            <span
              className={classnames({
                [css.simplyAsk_icon]: true,
                [css['simplyAsk_icon-open']]: isSidebarOpen,
                [css['simplyAsk_icon-compact']]: !isSidebarOpen,
              })}
            >
              <SidebarIcons icon="SYMPHONA" />
            </span>
            <p
              className={classnames({
                [css.simplyAsk_text]: true,
                [css['simplyAsk_text-compact']]: !isSidebarOpen,
              })}
            >
              <strong>Symphona</strong>
            </p>
          </div>
          {/* Links and Category headings */}
          <div className={css.category_wrapper} ref={sidebarBodyRef}>
            <CategoriesMenu onClick={handleCurrentNavLinkClick} menuItems={menuItems} isSidebarOpen={isSidebarOpen} />
          </div>
        </div>
        {/* submenu */}
        <SubMenu
          onClick={handleCurrentNavLinkClick}
          subMenuItems={subMenuItems}
          isSidebarOpen={isSidebarOpen}
          isActiveSubmenu={isActiveSubmenu}
          isPointerEventsNone={isPointerEventsNone}
        />
        {/* Open/Close Menu Toggle */}
        <SidebarToggle
          onClick={(e) => {
            toggleSidebar(e);
            setIsPointerEventsNone(true);
          }}
          isActiveSubmenu={isActiveSubmenu}
          isSidebarOpen={isSidebarOpen}
        />
      </nav>
    </div>
  );
};

export default Sidebar;

Sidebar.propTypes = {
  isSidebarOpen: PropTypes.bool,
  toggleSidebar: PropTypes.func,
};
