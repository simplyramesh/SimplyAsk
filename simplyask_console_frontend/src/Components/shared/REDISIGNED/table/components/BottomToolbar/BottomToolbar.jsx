import PropTypes from 'prop-types';

import css from './BottomToolbar.module.css';

const BottomToolbar = ({ children }) => {
  return (
    <div className={css.bottomToolbar}>{children}</div>
  );
};

BottomToolbar.Left = ({ children }) => {
  return (
    <div className={css.left}>{children}</div>
  );
};

BottomToolbar.Right = ({ children }) => {
  return (
    <div className={css.right}>{children}</div>
  );
};

export default BottomToolbar;

BottomToolbar.propTypes = {
  children: PropTypes.node,
};
BottomToolbar.Left.propTypes = BottomToolbar.propTypes;
BottomToolbar.Right.propTypes = BottomToolbar.propTypes;
