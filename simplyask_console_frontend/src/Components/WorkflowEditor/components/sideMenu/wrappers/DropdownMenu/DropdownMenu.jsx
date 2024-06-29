import classnames from 'classnames';
import PropTypes from 'prop-types';

import css from './DropdownMenu.module.css';

const DropdownMenu = ({
  isDropdownOpen, fitContent, testEditor, children,
}) => {
  return (
    <div
      aria-hidden={!isDropdownOpen}
      data-expanded={isDropdownOpen}
      className={classnames({
        [css.fit_content]: fitContent,
        [css.menu]: !fitContent,
        [css.test_editor]: testEditor,
      })}
    >
      {children}
    </div>
  );
};

export default DropdownMenu;

DropdownMenu.propTypes = {
  isDropdownOpen: PropTypes.bool.isRequired,
  fitContent: PropTypes.bool,
  testEditor: PropTypes.bool,
  children: PropTypes.node.isRequired,
};
