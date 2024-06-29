import classnames from 'classnames';
import PropTypes from 'prop-types';

import SidebarIcons from '../../SidebarIcons/SidebarIcons';
import css from './SidebarToggle.module.css';

const SidebarToggle = ({ onClick, isActiveSubmenu, isSidebarOpen }) => {
  return (
    <div className={classnames({
      [css.toggle]: true,
      [css.active_submenu]: isActiveSubmenu,
      [css['active_submenu-closed']]: !isSidebarOpen,
    })}
    >
      <div className={css.toggle_background}>
        <button
          type="button"
          className={css.toggle_button}
          onClick={onClick}
        >
          <span className={css.toggle_icon}><SidebarIcons icon="OPEN_CLOSE" /></span>
        </button>
        <div className={css.toggle_line} />
      </div>
    </div>
  );
};

export default SidebarToggle;

SidebarToggle.propTypes = {
  onClick: PropTypes.func,
  isActiveSubmenu: PropTypes.bool,
  isSidebarOpen: PropTypes.bool,
};
