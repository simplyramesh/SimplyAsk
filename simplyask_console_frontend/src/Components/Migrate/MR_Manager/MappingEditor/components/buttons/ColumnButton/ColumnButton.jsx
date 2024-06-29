import classnames from 'classnames';
import PropTypes from 'prop-types';

import MappingEditorIcons from '../../icons/MappingEditorIcons';
import css from './ColumnButton.module.css';

const TEXT = {
  ADD_COLUMN: 'New Column',
  COLLAPSE: 'Collapse Columns',
  EXPAND_MORE: 'Expand Columns',
};

const ColumnButton = ({
  onNew, icon, headerName, ...rest
}) => {
  return (
    <button
      type="button"
      className={classnames({
        [css.add_column]: true,
        [css[`add_column--${`${headerName}`.toLowerCase()}`]]: true,
      })}
      {...rest}
    >
      <span className={css.add_icon}><MappingEditorIcons icon={icon || 'ADD_COLUMN'} /></span>
      <p className={css.add_text}>{TEXT[icon]}</p>
    </button>
  );
};

export default ColumnButton;

ColumnButton.propTypes = {
  onNew: PropTypes.func,
  headerName: PropTypes.string,
  icon: PropTypes.string,
};
