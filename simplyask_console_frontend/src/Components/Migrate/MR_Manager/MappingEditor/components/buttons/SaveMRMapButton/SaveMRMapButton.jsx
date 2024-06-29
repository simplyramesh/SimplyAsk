import classnames from 'classnames';
import PropTypes from 'prop-types';

import MappingEditorIcons from '../../icons/MappingEditorIcons';
import SaveMRMapMenu from '../../menu/SaveMRMapMenu/SaveMRMapMenu';
import css from './SaveMRMapButton.module.css';

const SaveMRMapButton = ({
  onSave, isDisabled, columnNames, ...rest
}) => {
  const handleSave = (e) => {
    if (typeof onSave === 'function') {
      onSave(e);
    }
  };

  return (
    <button
      className={classnames({
        [css.button]: true,
        [css['button--disabled']]: isDisabled,
      })}
      {...rest}
      onClick={handleSave}
    >
      <span className={classnames({
        [css.text]: true,
        [css['text--disabled']]: isDisabled,
      })}
      >
        Save MR Map
      </span>
      {isDisabled && (
        <span className={css.icon}>
          <MappingEditorIcons icon="HELP" />
        </span>
      )}
      {isDisabled && <SaveMRMapMenu columnNames={columnNames} hoverClass={css.menu} />}
    </button>
  );
};

export default SaveMRMapButton;

SaveMRMapButton.propTypes = {
  onSave: PropTypes.func,
  isDisabled: PropTypes.bool,
  columnNames: PropTypes.arrayOf(PropTypes.string),
};
