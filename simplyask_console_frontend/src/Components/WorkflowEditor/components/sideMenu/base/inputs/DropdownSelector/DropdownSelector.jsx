import classnames from 'classnames';
import PropTypes from 'prop-types';
import { memo } from 'react';
import Select from 'react-select';

import { ERROR_TYPES } from '../../../../../utils/validation';
import AddDeleteButton from '../AddDeleteButton/AddDeleteButton';
import CustomDropdownIndicator from './CustomDropdownIndicator';
import CustomGroupHeading from './CustomGroupHeading';
import css from './DropdownSelector.module.css';
import { dropdownStyles } from './dropdownStyles';
import { useProxyDefinitions } from '../../../../../../../hooks/process/useProxyDefinitions';

const DropdownSelector = (props) => {
  const {
    placeholder,
    onChange,
    value,
    name,
    error,
    possibleValues,
    plusIcon,
    deleteIcon,
    onIconClick,
    displayDynamicParamValues,
    requestType,
  } = props;

  const { definitions } = useProxyDefinitions(requestType);

  const values = definitions?.possibleValues || possibleValues;

  const keys = values ? Object.keys(values) : [];

  const possibleValuesArray =
    keys.length > 1
      ? keys.map((key, index) => ({
          label: key,
          includeDivider: keys.length > 1 && (index !== 0 || index !== keys.length - 1),
          displayDynamicParamValues,
          options: values[key].map((option) => ({ label: option.title, value: option.value })),
        }))
      : keys[0] &&
        values[keys[0]].map((option) => ({
          label: option.title,
          includeDivider: false,
          displayDynamicParamValues,
          options: [{ label: option.title, value: option.value }],
        }));

  return (
    <div className={css.wrapper}>
      <div className={css.container}>
        <Select
          className={classnames({
            [css.error]: error?.type === ERROR_TYPES.ERROR,
            [css.warning]: error?.type === ERROR_TYPES.WARNING,
          })}
          components={{ DropdownIndicator: CustomDropdownIndicator, GroupHeading: CustomGroupHeading }}
          type="text"
          placeholder={placeholder}
          value={value}
          name={name}
          onChange={onChange}
          styles={dropdownStyles}
          options={possibleValuesArray}
          maxMenuHeight={300}
          plusIcon={plusIcon}
          error={error?.type}
        />
      </div>
      {(plusIcon || deleteIcon) && (
        <AddDeleteButton onIconClick={onIconClick} plusIcon={plusIcon} deleteIcon={deleteIcon} />
      )}
    </div>
  );
};

// possible_values: {
//   'STRING Title 1': [{
//     title: 'STRING',
//     value: 'STRING',
//   }],
// };

export default memo(DropdownSelector);

DropdownSelector.defaultProps = {
  plusIcon: false,
  deleteIcon: false,
};

DropdownSelector.propTypes = {
  placeholder: PropTypes.string,
  onChange: PropTypes.func,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  name: PropTypes.string,
  error: PropTypes.shape({
    type: PropTypes.oneOf([ERROR_TYPES.WARNING, ERROR_TYPES.ERROR]),
    message: PropTypes.string,
  }),
  plusIcon: PropTypes.bool,
  deleteIcon: PropTypes.bool,
  onIconClick: PropTypes.func,
  possibleValues: PropTypes.shape({
    [PropTypes.string]: PropTypes.arrayOf(
      PropTypes.shape({
        title: PropTypes.string,
        value: PropTypes.string,
      })
    ),
  }),
  displayDynamicParamValues: PropTypes.bool,
};
