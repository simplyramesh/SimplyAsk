import PropTypes from 'prop-types';

import MappingEditorIcons from '../../icons/MappingEditorIcons';
import css from './NewRowButton.module.css';

const NewRowButton = ({ onAction }) => {
  return (
    <button className={css.new_rowBtn} onClick={onAction}>
      <span className={css.new_icon}><MappingEditorIcons icon="ADD_COLUMN" /></span>
      <span className={css.new_text}>New Row</span>
    </button>
  );
};

export default NewRowButton;

NewRowButton.propTypes = {
  onAction: PropTypes.func,
};
