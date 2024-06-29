import PropTypes from 'prop-types';
import { components } from 'react-select';

import Checkbox from '../../../../../../shared/REDISIGNED/controls/Checkbox/Checkbox';
import { StyledFlex } from '../../../../../../shared/styles/styled';

const CustomCheckboxOptions = ({
  data, selectProps, selectOption, isSelected, innerRef, ...rest
}) => {
  const isStatus = data.type === 'statusBadge';
  const nameId = isStatus ? `${data.type}-${data.value}` : selectProps.getOptionLabel(data);

  const handleCheckboxChange = (e) => {
    if (typeof e !== 'boolean') e.preventDefault();

    selectOption(
      isStatus
        ? {
          ...data,
          label: data.value ? 'Deactivated' : 'Activated',
          value: data.value,
        }
        : {
          ...data,
          [selectProps.labelKey]: selectProps.getOptionLabel(data),
          [selectProps.valueKey]: selectProps.getOptionValue(data),
        },
    );
  };

  return (
    <components.Option
      {...rest}
      selectProps={{ ...selectProps }}
      innerProps={{
        ...rest.innerProps,
        onClick: handleCheckboxChange,
      }}
    >
      <StyledFlex
        direction="row"
        pointerEvents="auto"
        gap="18px"
        alignItems="center"
        cursor="pointer"
        ref={innerRef}
      >
        <Checkbox
          onChange={handleCheckboxChange}
          id={nameId}
          name={nameId}
          checkValue={isSelected}
        />
        {selectProps.getOptionLabel(data)}
      </StyledFlex>
    </components.Option>
  );
};

export default CustomCheckboxOptions;

CustomCheckboxOptions.propTypes = {
  data: PropTypes.object,
  selectProps: PropTypes.object,
  selectOption: PropTypes.func,
  isSelected: PropTypes.bool,
  innerRef: PropTypes.func,
};
