import classnames from 'classnames';
import PropTypes from 'prop-types';

import MappingEditorIcons from '../../icons/MappingEditorIcons';
import css from './EditDeleteButton.module.css';

const EditDeleteButton = ({ icon, isRowIcon, onAction }) => {
  return (
    <span
      className={classnames({
        [css.icon]: true,
        [css.row_icon]: isRowIcon,
      })}
      onClick={onAction}
    >
      <MappingEditorIcons icon={icon} />
    </span>
  );
};

export default EditDeleteButton;

EditDeleteButton.propTypes = {
  icon: PropTypes.string,
  isRowIcon: PropTypes.bool,
  onAction: PropTypes.func,
};
