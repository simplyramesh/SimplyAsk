import PropTypes from 'prop-types';

import css from './SidebarNavLinks.module.css';

const SidebarNavLinks = ({ categoryItems, children }) => {
  return (
    <ul className={css.navLinks}>
      {categoryItems.map((item, index) => (
        <li key={`${item.displayName}-${index}`} className={css.navLink_li}>
          {children({ item })}
        </li>
      ))}
    </ul>
  );
};

export default SidebarNavLinks;

SidebarNavLinks.propTypes = {
  categoryItems: PropTypes.arrayOf(PropTypes.object),
  children: PropTypes.any,
};
