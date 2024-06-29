import PropTypes from 'prop-types';

import { LabeledField } from '../../../wrappers';
import AddedInputItem from '../../AddedInputItem/AddedInputItem';
import DropdownSelector from '../DropdownSelector/DropdownSelector';
import css from './ErrorCode.module.css';

const ErrorCode = (props) => {
  const {
    placeholder, onChange, value, name, possibleValues, displayDynamicParamValues, error, onIconClick, errorTitle, errorValue, addedErrors, onRemoveError,
  } = props;

  return (
    <>
      <LabeledField withOption>
        <div className={css.error_container}>
          <DropdownSelector
            plusIcon
            onChange={onChange}
            value={value}
            name={name}
            placeholder={placeholder || 'Select Error Code...'}
            possibleValues={possibleValues}
            displayDynamicParamValues={displayDynamicParamValues}
            error={error}
            onIconClick={onIconClick}
          />
        </div>
      </LabeledField>
      {addedErrors?.map((error) => (
        <AddedInputItem
          key={error.value}
          title={errorTitle}
          value={errorValue}
          onRemove={onRemoveError}
        />
      ))}
    </>
  );
};

export default ErrorCode;

ErrorCode.propTypes = {
  placeholder: PropTypes.string,
  onChange: PropTypes.func,
  value: PropTypes.string,
  name: PropTypes.string,
  error: PropTypes.string,
  onIconClick: PropTypes.func,
  possibleValues: PropTypes.shape({
    [PropTypes.string]: PropTypes.arrayOf(PropTypes.shape({
      title: PropTypes.string,
      value: PropTypes.string,
    })),
  }),
  displayDynamicParamValues: PropTypes.bool,
  errorTitle: PropTypes.string,
  errorValue: PropTypes.string,
  addedErrors: PropTypes.array,
  onRemoveError: PropTypes.func,
};
