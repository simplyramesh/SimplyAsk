import PropTypes from 'prop-types';

import MappingEditorIcons from '../../icons/MappingEditorIcons';
import css from './AvailableParametersButton.module.css';

const AvailableParametersButton = ({ onAction }) => {
  return (
    <button className={css.available_params} onClick={onAction}>
      <span className={css.available_icon}><MappingEditorIcons icon="INFO" /></span>
      <span className={css.available_text}>Available Parameters</span>
    </button>
  );
};

export default AvailableParametersButton;

AvailableParametersButton.propTypes = {
  onAction: PropTypes.func,
};
