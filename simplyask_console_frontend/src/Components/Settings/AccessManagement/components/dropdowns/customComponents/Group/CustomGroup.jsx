import PropTypes from 'prop-types';
import { Children, useEffect, useState } from 'react';
import { components } from 'react-select';

import Checkbox from '../../../../../../shared/REDISIGNED/controls/Checkbox/Checkbox';
import { StyledDivider, StyledFlex, StyledText } from '../../../../../../shared/styles/styled';

const selectAll = {
  label: 'Select All',
  value: '*',
};

const CustomGroup = ({
  data, children, selectProps, innerRef, setValue, getValue, ...props
}) => {
  const [isChecked, setIsChecked] = useState(false);

  const areAllChildrenChecked = Children.toArray(children).every((child) => child.props.isSelected);

  const { isAllSelected } = selectProps;

  useEffect(() => {
    setIsChecked(areAllChildrenChecked);

    if (!areAllChildrenChecked) selectProps.onSelectAll(false);
  }, [areAllChildrenChecked]);

  const handleCheckboxChange = (e) => {
    e.preventDefault();

    if (isChecked) {
      const removedOptions = getValue().filter((option) => !data.options.includes(option));

      setValue(removedOptions);
    }

    if (!isChecked) {
      const value = getValue() || [];

      const uniqueValues = [...new Set([...value, ...data.options])];

      setValue(uniqueValues);
    }

    setIsChecked((prev) => !prev);
  };

  const handleSelectAll = (e) => {
    e.preventDefault();

    selectProps.onSelectAll(true);

    if (isAllSelected) setValue([]);

    if (!isAllSelected) {
      const allOptions = selectProps.options.reduce((acc, option) => {
        if (option.options) return [...acc, ...option.options];

        return acc;
      }, []);

      setValue(allOptions);
    }
  };

  const isFirstGroupHeading = props.headingProps.id.includes('group-0-heading');

  const groupHeading = (label, isAll) => (
    <StyledFlex
      as="label"
      direction="row"
      pointerEvents="auto"
      gap="18px"
      alignItems="center"
      cursor="pointer"
      htmlFor={label}
      ref={innerRef}
    >
      <Checkbox
        onChange={isAll ? handleSelectAll : handleCheckboxChange}
        id={label}
        name={label}
        checkValue={isAll ? isAllSelected : isChecked}
      />
      <StyledText
        weight={600}
        cursor="pointer"
        id={label}
        onClick={isAll ? handleSelectAll : handleCheckboxChange}
      >
        {label}
      </StyledText>
    </StyledFlex>
  );

  return (
    <components.Group {...props}>
      {isFirstGroupHeading && groupHeading(selectProps.selectAllText || selectAll.label, true)}
      {groupHeading(data.label)}
      <StyledFlex direction="row" alignItems="center" gap="6px" paddingLeft="20px">
        <StyledDivider orientation="vertical" variant="middle" flexItem />
        <StyledFlex>
          {children}
        </StyledFlex>
      </StyledFlex>
    </components.Group>
  );
};

export default CustomGroup;

CustomGroup.propTypes = {
  data: PropTypes.object,
  selectProps: PropTypes.object,
  children: PropTypes.node,
  innerRef: PropTypes.func,
  setValue: PropTypes.func,
  headingProps: PropTypes.object,
  getValue: PropTypes.func,
};
